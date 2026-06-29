import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/providers/database";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDatabase();
  const tid = user.tenantId;

  const [
    totalMembers,
    totalRegistrations,
    todayRegistrations,
    membersPerBranch,
    serviceAttendance,
    genderBreakdown,
    ageGroupBreakdown,
    maritalBreakdown,
    monthlyGrowth,
    topServices,
    newVsReturning,
  ] = await Promise.all([
    db.queryOne<{ count: string }>(
      "SELECT COUNT(*) as count FROM members WHERE tenant_id = $1",
      [tid]
    ),
    db.queryOne<{ count: string }>(
      "SELECT COUNT(*) as count FROM registrations WHERE tenant_id = $1",
      [tid]
    ),
    db.queryOne<{ count: string }>(
      "SELECT COUNT(*) as count FROM registrations WHERE tenant_id = $1 AND registered_at::date = CURRENT_DATE",
      [tid]
    ),
    db.query(
      `SELECT b.name as branch_name, COUNT(m.id) as member_count
       FROM branches b
       LEFT JOIN members m ON m.home_branch_id = b.id
       WHERE b.tenant_id = $1 AND b.is_active = true
       GROUP BY b.id, b.name
       ORDER BY member_count DESC`,
      [tid]
    ),
    db.query(
      `SELECT s.name as service_name, b.name as branch_name, COUNT(r.id) as attendance
       FROM registrations r
       JOIN services s ON s.id = r.service_id
       JOIN branches b ON b.id = r.branch_id
       WHERE r.tenant_id = $1 AND r.registered_at >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY s.name, b.name
       ORDER BY attendance DESC
       LIMIT 10`,
      [tid]
    ),
    db.query(
      `SELECT gender, COUNT(*) as count
       FROM members WHERE tenant_id = $1 AND gender IS NOT NULL
       GROUP BY gender`,
      [tid]
    ),
    db.query(
      `SELECT age_group, COUNT(*) as count
       FROM members WHERE tenant_id = $1 AND age_group IS NOT NULL
       GROUP BY age_group
       ORDER BY count DESC`,
      [tid]
    ),
    db.query(
      `SELECT marital_status, COUNT(*) as count
       FROM members WHERE tenant_id = $1 AND marital_status IS NOT NULL
       GROUP BY marital_status
       ORDER BY count DESC`,
      [tid]
    ),
    db.query(
      `SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as new_members
       FROM members WHERE tenant_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '6 months'
       GROUP BY month
       ORDER BY month`,
      [tid]
    ),
    db.query(
      `SELECT s.name, COUNT(r.id) as total
       FROM registrations r
       JOIN services s ON s.id = r.service_id
       WHERE r.tenant_id = $1
       GROUP BY s.name
       ORDER BY total DESC
       LIMIT 5`,
      [tid]
    ),
    db.queryOne<{ new_count: string; returning_count: string }>(
      `SELECT
         COUNT(*) FILTER (WHERE m.is_first_time = true) as new_count,
         COUNT(*) FILTER (WHERE m.is_first_time = false) as returning_count
       FROM registrations r
       JOIN members m ON m.id = r.member_id
       WHERE r.tenant_id = $1 AND r.registered_at >= CURRENT_DATE - INTERVAL '30 days'`,
      [tid]
    ),
  ]);

  return NextResponse.json({
    summary: {
      totalMembers: parseInt(totalMembers?.count ?? "0"),
      totalRegistrations: parseInt(totalRegistrations?.count ?? "0"),
      todayRegistrations: parseInt(todayRegistrations?.count ?? "0"),
    },
    membersPerBranch,
    serviceAttendance,
    demographics: {
      gender: genderBreakdown,
      ageGroup: ageGroupBreakdown,
      maritalStatus: maritalBreakdown,
    },
    monthlyGrowth,
    topServices,
    newVsReturning: {
      new: parseInt(newVsReturning?.new_count ?? "0"),
      returning: parseInt(newVsReturning?.returning_count ?? "0"),
    },
  });
}
