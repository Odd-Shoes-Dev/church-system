import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/providers/database";
import { getSessionUser } from "@/lib/auth/session";
import { detailsSchema } from "@/lib/registration/validation";

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const db = getDatabase();

  let memberId = body.existingMemberId;

  // Validate member details before hitting the DB when creating a new member
  if (!memberId) {
    const result = detailsSchema.safeParse({
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      email: body.email ?? "",
      gender: body.gender,
      ageGroup: body.ageGroup,
      district: body.district,
      occupation: body.occupation,
      maritalStatus: body.maritalStatus,
    });

    if (!result.success) {
      const first = result.error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? "Invalid registration data" },
        { status: 422 }
      );
    }
  }

  if (!memberId) {
    const rows = await db.query<{ id: string }>(
      `INSERT INTO members (tenant_id, home_branch_id, first_name, last_name, phone, email, gender, age_group, district, occupation, marital_status, is_first_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [
        user.tenantId,
        user.branchId,
        body.firstName,
        body.lastName,
        body.phone || null,
        body.email || null,
        body.gender || null,
        body.ageGroup || null,
        body.district || null,
        body.occupation || null,
        body.maritalStatus || null,
        body.isFirstTime ?? true,
      ]
    );
    memberId = rows[0].id;

    if (body.referralSourceId) {
      await db.execute(
        "INSERT INTO member_referrals (member_id, referral_source_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [memberId, body.referralSourceId]
      );
    }
  }

  const regRows = await db.query<{ id: string }>(
    `INSERT INTO registrations (tenant_id, branch_id, member_id, service_id, event_id, registered_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [
      user.tenantId,
      user.branchId,
      memberId,
      body.serviceId,
      body.eventId || null,
      user.id,
    ]
  );

  const registrationId = regRows[0].id;

  if (body.prayerRequest) {
    await db.execute(
      "INSERT INTO prayer_requests (tenant_id, registration_id, content) VALUES ($1, $2, $3)",
      [user.tenantId, registrationId, body.prayerRequest]
    );
  }

  return NextResponse.json({ registrationId, memberId });
}
