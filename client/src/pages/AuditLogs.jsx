import { PageWrapper } from "../components/layout/PageWrapper.jsx";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { api } from "../services/api.js";
import { Badge } from "../components/ui/Badge.jsx";
import { DataTable } from "../components/ui/DataTable.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Button } from "../components/ui/Button.jsx";

export function AuditLogsPage() {
  const [page, setPage] = useState(1);

  const logsQ = useQuery({
    queryKey: ["audit-logs", page],
    queryFn: async () => {
      const res = await api.get(`/api/audit-logs?page=${page}&limit=30`);
      return res.data;
    },
  });

  const rows = logsQ.data?.data?.rows || [];
  const pagination = logsQ.data?.pagination || null;

  const columns = useMemo(
    () => [
      {
        key: "action",
        header: "Action",
        cell: (l) => <Badge tone="slate">{l.action}</Badge>,
      },
      {
        key: "entityType",
        header: "Entity",
        cell: (l) => <div className="font-semibold text-slate-800">{l.entityType}</div>,
      },
      {
        key: "entityId",
        header: "Entity ID",
        cellClassName: "font-mono text-xs text-slate-500",
        cell: (l) => l.entityId || "—",
      },
      {
        key: "actorEmail",
        header: "Actor",
        cellClassName: "font-mono text-sm",
        cell: (l) => l.actorEmail || l.actorId || "System",
      },
      {
        key: "ip",
        header: "IP / Agent",
        cell: (l) => (
          <div className="text-xs text-slate-500 font-mono truncate max-w-[200px]">
            {l.ip} • {l.userAgent || "—"}
          </div>
        ),
      },
      {
        key: "time",
        header: "Timestamp",
        cellClassName: "font-mono text-xs text-slate-500",
        cell: (l) => new Date(l.createdAt).toLocaleString(),
      },
    ],
    []
  );

  return (
    <PageWrapper>
      <div className="text-2xl font-extrabold tracking-tight">Audit Logs</div>
      <div className="mt-1 text-sm text-slate-600">
        Immutable record of administrative actions and sensitive data access.
      </div>
      <div className="mt-6 card p-4">
        <div className="text-sm font-bold">Recent events</div>
        <div className="mt-4">
          <DataTable
            columns={columns}
            rows={rows}
            getRowId={(l) => l._id}
            selectedIds={[]}
            onToggleAll={() => {}}
            onToggleRow={() => {}}
            empty={<EmptyState title="No events yet" description="Audit events will appear here." />}
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="subtle"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <div className="text-xs text-slate-600 font-mono">
            page {pagination?.page ?? page} / {pagination?.pages ?? 1}
          </div>
          <Button
            variant="subtle"
            size="sm"
            disabled={!pagination || page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}

