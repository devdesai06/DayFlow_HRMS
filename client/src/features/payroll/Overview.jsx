import { PageWrapper } from "../../components/layout/PageWrapper.jsx";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FileDown, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { DataTable } from "../../components/ui/DataTable.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { fetchEmployees } from "../employees/employeeApi.js";
import { downloadPayslip, fetchPayrollHistory, runPayroll } from "./payrollApi.js";

export function PayrollOverview() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [open, setOpen] = useState(false);
  const [previewRows, setPreviewRows] = useState([]);

  const empQ = useQuery({
    queryKey: ["employees", "mini"],
    queryFn: () => fetchEmployees({ page: 1, limit: 50, sortBy: "createdAt", sortDir: "desc" }),
  });
  const employees = empQ.data?.data?.employees || [];

  const histQ = useQuery({
    queryKey: ["payroll", "history", year, month],
    queryFn: () => fetchPayrollHistory({ page: 1, limit: 30, year, month }),
  });
  const history = histQ.data?.data?.rows || [];

  const previewM = useMutation({
    mutationFn: (employeeIds) => runPayroll({ year, month, employeeIds, preview: true }),
    onSuccess: (data) => {
      setPreviewRows(data?.data?.preview || []);
    },
  });

  const runM = useMutation({
    mutationFn: (employeeIds) => runPayroll({ year, month, employeeIds, preview: false }),
    onSuccess: () => {
      toast.success("Payroll run completed.");
      setOpen(false);
      histQ.refetch();
    },
  });

  const columns = useMemo(
    () => [
      {
        key: "period",
        header: "Period",
        cell: (r) => (
          <div className="font-mono text-slate-800">
            {r.periodYear}-{String(r.periodMonth).padStart(2, "0")}
          </div>
        ),
      },
      {
        key: "emp",
        header: "Employee",
        cell: (r) => <div className="font-semibold text-slate-900">{r.employeeId}</div>,
      },
      {
        key: "net",
        header: "Net pay",
        cellClassName: "font-mono",
        cell: (r) => `${r.structure?.currency || "USD"} ${Number(r.net || 0).toLocaleString()}`,
      },
      {
        key: "status",
        header: "Status",
        cell: (r) => (
          <Badge tone={r.status === "EMAILED" ? "green" : "slate"}>{r.status}</Badge>
        ),
      },
    ],
    []
  );

  return (
    <PageWrapper>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-extrabold tracking-tight">Payroll</div>
          <div className="mt-1 text-sm text-slate-600">
            One-click payroll run with preview and payslip download.
          </div>
        </div>
        <Button onClick={() => setOpen(true)}>
          <PlayCircle className="h-4 w-4" />
          Run payroll
        </Button>
      </div>

      <div className="mt-6 card p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-sm font-extrabold tracking-tight">History</div>
            <div className="mt-1 text-sm text-slate-600">
              Filter by year/month and download payslips.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="focus-ring h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold hover:border-slate-300"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {[year - 1, year, year + 1].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select
              className="focus-ring h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold hover:border-slate-300"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(2000, m - 1, 1).toLocaleString(undefined, { month: "short" })}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <DataTable
            columns={columns}
            rows={history}
            getRowId={(r) => r._id}
            selectedIds={[]}
            onToggleAll={() => {}}
            onToggleRow={() => {}}
            actions={(r) => (
              <Button
                size="sm"
                variant="subtle"
                onClick={async () => {
                  const resp = await downloadPayslip(r._id);
                  const blob = new Blob([resp.data], { type: "application/pdf" });
                  const url = URL.createObjectURL(blob);
                  window.open(url, "_blank", "noopener,noreferrer");
                  setTimeout(() => URL.revokeObjectURL(url), 30_000);
                }}
              >
                <FileDown className="h-4 w-4" />
              </Button>
            )}
            empty={
              <EmptyState
                title="No payroll history"
                description="Run payroll for the first time to generate payslips."
              />
            }
          />
        </div>
      </div>

      <RunPayrollModal
        open={open}
        onClose={() => setOpen(false)}
        employees={employees}
        year={year}
        month={month}
        previewRows={previewRows}
        busy={previewM.isPending || runM.isPending}
        onPreview={(ids) => previewM.mutate(ids)}
        onRun={(ids) => runM.mutate(ids)}
      />
    </PageWrapper>
  );
}

function RunPayrollModal({
  open,
  onClose,
  employees,
  year,
  month,
  previewRows,
  busy,
  onPreview,
  onRun,
}) {
  const [ids, setIds] = useState([]);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((e) =>
      `${e.firstName} ${e.lastName} ${e.email} ${e.employeeCode}`.toLowerCase().includes(q)
    );
  }, [employees, search]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Run payroll"
      description={`Preview and finalize payroll for ${year}-${String(month).padStart(2, "0")}.`}
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600 font-mono">{ids.length} selected</div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button
              variant="subtle"
              disabled={busy || !ids.length}
              onClick={() => onPreview?.(ids)}
            >
              Preview
            </Button>
            <Button disabled={busy || !ids.length} onClick={() => onRun?.(ids)}>
              Finalize run
            </Button>
          </div>
        </div>
      }
      className="max-w-4xl"
    >
      <div className="grid gap-4">
        <Input label="Search employees" value={search} onChange={(e) => setSearch(e.target.value)} />

        <div className="card p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-auto pr-1">
            {filtered.map((e) => {
              const id = String(e._id);
              const checked = ids.includes(id);
              return (
                <label
                  key={id}
                  className="focus-ring flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50 cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">
                      {e.firstName} {e.lastName}
                    </div>
                    <div className="text-xs text-slate-600 font-mono truncate">
                      {e.employeeCode} • {e.email}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setIds((prev) =>
                        checked ? prev.filter((x) => x !== id) : [...prev, id]
                      )
                    }
                    className="h-4 w-4 accent-indigo"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {previewRows?.length ? (
          <div className="card p-4">
            <div className="text-sm font-extrabold tracking-tight">Preview</div>
            <div className="mt-1 text-sm text-slate-600">
              Estimated breakdown from annual salary (base/HRA/allowances/deductions).
            </div>
            <div className="mt-3 overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-white border-b border-slate-200">
                  <tr>
                    <th className="text-left px-2 py-2 font-extrabold">Employee</th>
                    <th className="text-right px-2 py-2 font-extrabold">Gross</th>
                    <th className="text-right px-2 py-2 font-extrabold">Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {previewRows.map((r) => (
                    <tr key={r.employeeId} className="hover:bg-slate-50 transition-premium">
                      <td className="px-2 py-2">
                        <div className="font-semibold">{r.name}</div>
                        <div className="text-xs text-slate-600 font-mono">{r.employeeCode}</div>
                      </td>
                      <td className="px-2 py-2 text-right font-mono">
                        {r.structure.currency} {Number(r.gross).toLocaleString()}
                      </td>
                      <td className="px-2 py-2 text-right font-mono">
                        {r.structure.currency} {Number(r.net).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

