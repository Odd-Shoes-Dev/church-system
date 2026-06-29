import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/providers/database";
import { getSessionUser } from "@/lib/auth/session";

interface MemberExportRow {
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  gender: string | null;
  age_group: string | null;
  district: string | null;
  occupation: string | null;
  marital_status: string | null;
  home_branch_name: string;
  visit_count: string;
  last_visit: string | null;
  created_at: string;
}

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const branchFilter = request.nextUrl.searchParams.get("branch") ?? "";
  const db = getDatabase();

  let whereClause = "WHERE m.tenant_id = $1";
  const params: unknown[] = [user.tenantId];

  if (branchFilter) {
    params.push(branchFilter);
    whereClause += ` AND m.home_branch_id = $${params.length}`;
  }

  const members = await db.query<MemberExportRow>(
    `SELECT m.first_name, m.last_name, m.phone, m.email, m.gender, m.age_group,
            m.district, m.occupation, m.marital_status, m.created_at,
            b.name as home_branch_name,
            (SELECT COUNT(*) FROM registrations r WHERE r.member_id = m.id) as visit_count,
            (SELECT MAX(r.registered_at)::text FROM registrations r WHERE r.member_id = m.id) as last_visit
     FROM members m
     JOIN branches b ON b.id = m.home_branch_id
     ${whereClause}
     ORDER BY b.name, m.last_name, m.first_name`,
    params
  );

  const headers = [
    "First Name",
    "Last Name",
    "Phone",
    "Email",
    "Gender",
    "Age Group",
    "District",
    "Occupation",
    "Marital Status",
    "Home Branch",
    "Visit Count",
    "Last Visit",
    "Registered On",
  ];

  function escapeCSV(val: string | null): string {
    if (!val) return "";
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  }

  const rows = members.map((m) =>
    [
      escapeCSV(m.first_name),
      escapeCSV(m.last_name),
      escapeCSV(m.phone),
      escapeCSV(m.email),
      escapeCSV(m.gender),
      escapeCSV(m.age_group?.replace("_", " ") ?? null),
      escapeCSV(m.district),
      escapeCSV(m.occupation),
      escapeCSV(m.marital_status),
      escapeCSV(m.home_branch_name),
      m.visit_count,
      escapeCSV(m.last_visit ? new Date(m.last_visit).toLocaleDateString() : null),
      escapeCSV(new Date(m.created_at).toLocaleDateString()),
    ].join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="members-export-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
