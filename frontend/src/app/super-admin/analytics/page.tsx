"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface AnalyticsData {
  summary: {
    totalMembers: number;
    totalRegistrations: number;
    todayRegistrations: number;
  };
  membersPerBranch: { branch_name: string; member_count: string }[];
  serviceAttendance: {
    service_name: string;
    branch_name: string;
    attendance: string;
  }[];
  demographics: {
    gender: { gender: string; count: string }[];
    ageGroup: { age_group: string; count: string }[];
    maritalStatus: { marital_status: string; count: string }[];
  };
  monthlyGrowth: { month: string; new_members: string }[];
  topServices: { name: string; total: string }[];
  newVsReturning: { new: number; returning: number };
}

function StatBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[var(--color-text)] w-36 shrink-0 truncate">
        {label}
      </span>
      <div className="flex-1 h-5 bg-[var(--color-border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm text-[var(--color-muted)] w-12 text-right">
        {value}
      </span>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/super-admin/analytics")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) return null;

  const maxBranchMembers = Math.max(
    ...data.membersPerBranch.map((b) => parseInt(b.member_count)),
    1
  );
  const maxServiceAttendance = Math.max(
    ...data.serviceAttendance.map((s) => parseInt(s.attendance)),
    1
  );
  const maxAgeGroup = Math.max(
    ...data.demographics.ageGroup.map((a) => parseInt(a.count)),
    1
  );

  return (
    <div>
      <h1 className="text-2xl font-[var(--font-heading)] text-[var(--color-text)] mb-6">
        Analytics
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <p className="text-sm text-[var(--color-muted)]">Total Members</p>
            <CardTitle className="text-3xl mt-1">
              {data.summary.totalMembers}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <p className="text-sm text-[var(--color-muted)]">
              Total Registrations
            </p>
            <CardTitle className="text-3xl mt-1">
              {data.summary.totalRegistrations}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <p className="text-sm text-[var(--color-muted)]">Today</p>
            <CardTitle className="text-3xl mt-1">
              {data.summary.todayRegistrations}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-[var(--font-heading)] text-[var(--color-text)] mb-4">
            Members per Branch
          </h3>
          <div className="flex flex-col gap-2">
            {data.membersPerBranch.map((b) => (
              <StatBar
                key={b.branch_name}
                label={b.branch_name}
                value={parseInt(b.member_count)}
                max={maxBranchMembers}
              />
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-[var(--font-heading)] text-[var(--color-text)] mb-4">
            Service Attendance (Last 30 Days)
          </h3>
          <div className="flex flex-col gap-2">
            {data.serviceAttendance.map((s, i) => (
              <StatBar
                key={i}
                label={`${s.service_name} (${s.branch_name})`}
                value={parseInt(s.attendance)}
                max={maxServiceAttendance}
              />
            ))}
            {data.serviceAttendance.length === 0 && (
              <p className="text-sm text-[var(--color-muted)]">
                No attendance data yet
              </p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-[var(--font-heading)] text-[var(--color-text)] mb-4">
            Gender
          </h3>
          <div className="flex flex-col gap-2">
            {data.demographics.gender.map((g) => (
              <div
                key={g.gender}
                className="flex justify-between text-sm"
              >
                <span className="text-[var(--color-text)] capitalize">
                  {g.gender}
                </span>
                <span className="text-[var(--color-muted)]">{g.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-[var(--font-heading)] text-[var(--color-text)] mb-4">
            Age Groups
          </h3>
          <div className="flex flex-col gap-2">
            {data.demographics.ageGroup.map((a) => (
              <StatBar
                key={a.age_group}
                label={a.age_group.replace("_", " ")}
                value={parseInt(a.count)}
                max={maxAgeGroup}
              />
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-[var(--font-heading)] text-[var(--color-text)] mb-4">
            Marital Status
          </h3>
          <div className="flex flex-col gap-2">
            {data.demographics.maritalStatus.map((m) => (
              <div
                key={m.marital_status}
                className="flex justify-between text-sm"
              >
                <span className="text-[var(--color-text)] capitalize">
                  {m.marital_status}
                </span>
                <span className="text-[var(--color-muted)]">{m.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-[var(--font-heading)] text-[var(--color-text)] mb-4">
            Monthly New Members (Last 6 Months)
          </h3>
          <div className="flex flex-col gap-2">
            {data.monthlyGrowth.map((m) => (
              <div key={m.month} className="flex justify-between text-sm">
                <span className="text-[var(--color-text)]">{m.month}</span>
                <span className="text-[var(--color-muted)]">
                  {m.new_members} new
                </span>
              </div>
            ))}
            {data.monthlyGrowth.length === 0 && (
              <p className="text-sm text-[var(--color-muted)]">No data yet</p>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-[var(--font-heading)] text-[var(--color-text)] mb-4">
            New vs Returning (Last 30 Days)
          </h3>
          <div className="flex gap-6">
            <div>
              <p className="text-3xl font-[var(--font-heading)] text-[var(--color-text)]">
                {data.newVsReturning.new}
              </p>
              <p className="text-sm text-[var(--color-muted)]">New Visitors</p>
            </div>
            <div>
              <p className="text-3xl font-[var(--font-heading)] text-[var(--color-text)]">
                {data.newVsReturning.returning}
              </p>
              <p className="text-sm text-[var(--color-muted)]">Returning</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
