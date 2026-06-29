"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface BranchOption {
  id: string;
  name: string;
}

export default function ExportPage() {
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [branchFilter, setBranchFilter] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch("/api/super-admin/members?page=1")
      .then((r) => r.json())
      .then((d) => setBranches(d.branches ?? []));
  }, []);

  async function handleExport() {
    setExporting(true);
    const params = new URLSearchParams();
    if (branchFilter) params.set("branch", branchFilter);

    const res = await fetch(`/api/super-admin/export?${params}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      res.headers
        .get("Content-Disposition")
        ?.match(/filename="(.+)"/)?.[1] ?? "members-export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExporting(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-[var(--font-heading)] text-[var(--color-text)] mb-6">
        Export Data
      </h1>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Export Members to CSV</CardTitle>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Download a CSV file with all member details including phone numbers,
            emails, demographics, and visit history.
          </p>
        </CardHeader>

        <div className="flex flex-col gap-4">
          <Select
            label="Filter by Branch"
            options={[
              { value: "", label: "All Branches" },
              ...branches.map((b) => ({ value: b.id, label: b.name })),
            ]}
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
          />

          <Button onClick={handleExport} disabled={exporting}>
            {exporting ? "Exporting..." : "Download CSV"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
