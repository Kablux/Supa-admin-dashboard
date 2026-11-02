import { useState } from "react";
import { Box, Chip, MenuItem, Stack, TextField, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { errorMessage, resetMe, sendAnalytics, useAnalytics } from "../api";
import { formatDateTime } from "../format";
import type { Paged } from "../types";
import { ErrorState, Loading, Section } from "../components/ui";
import DataTable from "../components/DataTable";

interface AccessData {
  roles: { key: string; label: string; permissions: string[] }[];
  admins: { id: string; email: string; first_name: string; last_name: string; status: string; role: string; explicit: boolean }[];
}

type AuditRow = { id: string; created_at: string; actor_email: string; action: string; target: string; metadata: Record<string, unknown>; ip_address: string } & Record<string, unknown>;

const PERMISSION_LABELS: Record<string, string> = {
  "executive.view": "Executive",
  "riders.view": "Riders",
  "drivers.view": "Drivers",
  "trips.view": "Trips",
  "finance.view": "Finance",
  "finance.transactions": "Transaction drill-down",
  "geography.view": "Geography",
  "operations.view": "Operations",
  "alerts.manage": "Manage alerts",
  "reports.export": "Export",
  "pii.view": "Personal data",
  "roles.manage": "Manage roles",
};

export default function AccessPage() {
  const access = useAnalytics<AccessData>("access/");
  const [page, setPage] = useState(1);
  const audit = useAnalytics<Paged<AuditRow>>("audit-log/", { page, page_size: 20 });

  const changeRole = async (userId: string, role: string) => {
    try {
      await sendAnalytics("put", `access/${userId}/`, { role });
      toast.success("Role updated.");
      resetMe();
      access.reload();
      audit.reload();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  if (access.loading && !access.data) return <Loading />;
  if (access.error) return <ErrorState message={access.error} onRetry={access.reload} />;
  const roles = access.data?.roles || [];

  return (
    <Stack spacing={2.5}>
      <Section title="Admin roles" subtitle="Business admins without an explicit role are Super Administrators. At least one Super Administrator must remain.">
        <DataTable
          rows={(access.data?.admins || []) as unknown as Record<string, unknown>[]}
          columns={[
            { key: "email", label: "Admin" },
            { key: "name", label: "Name", render: (row) => `${row.first_name || ""} ${row.last_name || ""}`.trim() || "—" },
            { key: "status", label: "Account" },
            {
              key: "role",
              label: "Analytics role",
              render: (row) => (
                <TextField select size="small" value={String(row.role)} onChange={(e) => changeRole(String(row.id), e.target.value)} sx={{ minWidth: 210 }}>
                  {roles.map((role) => (
                    <MenuItem key={role.key} value={role.key}>
                      {role.label}
                    </MenuItem>
                  ))}
                </TextField>
              ),
            },
          ]}
        />
      </Section>

      <Section title="What each role can see">
        <Stack spacing={1.5}>
          {roles.map((role) => (
            <Box key={role.key}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", mb: 0.5 }}>{role.label}</Typography>
              <Stack sx={{ flexWrap: "wrap", gap: 0.75 }} direction="row">
                {role.permissions.filter((p) => p !== "analytics.view").map((permission) => (
                  <Chip key={permission} size="small" label={PERMISSION_LABELS[permission] || permission} variant="outlined" sx={{ borderColor: "var(--border)", color: "var(--text-secondary)" }} />
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Section>

      <Section title="Audit log" subtitle="Exports, personal-data views, role changes and alert changes.">
        <DataTable<AuditRow>
          loading={audit.loading}
          rows={audit.data?.results || []}
          count={audit.data?.count}
          page={page}
          pageSize={20}
          onPage={setPage}
          columns={[
            { key: "created_at", label: "When", nowrap: true, render: (row) => formatDateTime(row.created_at) },
            { key: "actor_email", label: "Admin" },
            { key: "action", label: "Action", render: (row) => row.action.replace("analytics.", "").replace(/_/g, " ") },
            { key: "target", label: "Target" },
            { key: "metadata", label: "Details", render: (row) => <span title={JSON.stringify(row.metadata)}>{Object.keys(row.metadata || {}).join(", ") || "—"}</span> },
          ]}
        />
      </Section>
    </Stack>
  );
}
