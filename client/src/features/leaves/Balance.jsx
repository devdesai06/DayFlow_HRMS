import { PageWrapper } from "../../components/layout/PageWrapper.jsx";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { ProgressRing } from "../../components/ui/ProgressRing.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { DataTable } from "../../components/ui/DataTable.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import {
  applyLeave,
  approveLeave,
  fetchLeaveBalance,
  fetchLeaves,
  rejectLeave,
} from "./leaveApi.js";
import { useAuthStore } from "../auth/authStore.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export function LeaveBalance() {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const isPrivileged = ["SUPER_ADMIN", "ADMIN", "HR"].includes(user?.role);
  const [applyOpen, setApplyOpen] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const year = new Date().getFullYear();

  const balQ = useQuery({
    queryKey: ["leaves", "balance", year],
    queryFn: () => fetchLeaveBalance(year),
  });

  const mineQ = useQuery({
    queryKey: ["leaves", "mine"],
    queryFn: () => fetchLeaves({ page: 1, limit: 20 }),
  });

  const approvalsQ = useQuery({
    queryKey: ["leaves", "approvals"],
    enabled: isPrivileged,
    queryFn: () => fetchLeaves({ page: 1, limit: 30, status: "PENDING" }),
  });

  const applyM = useMutation({
    mutationFn: (payload) => applyLeave(payload),
    onSuccess: () => {
      toast.success("Leave request submitted.");
      setApplyOpen(false);
      qc.invalidateQueries({ queryKey: ["leaves"] });
    },
  });

  const approveM = useMutation({
    mutationFn: ({ id, note }) => approveLeave(id, note),
    onSuccess: () => {
      toast.success("Approved.");
      qc.invalidateQueries({ queryKey: ["leaves"] });
    },
  });

  const rejectM = useMutation({
    mutationFn: ({ id, note }) => rejectLeave(id, note),
    onSuccess: () => {
      toast.success("Rejected.");
      qc.invalidateQueries({ queryKey: ["leaves"] });
    },
  });

  const balance = balQ.data?.data || null;
  const annual = balance?.annual || {};
  const remaining = balance?.remaining || {};

  const ring = useMemo(() => {
    const total = Object.entries(annual)
      .filter(([k]) => k !== "UNPAID")
      .reduce((a, [, v]) => a + Number(v || 0), 0);
    const rem = Object.entries(remaining)
      .filter(([k]) => k !== "UNPAID")
      .reduce((a, [, v]) => a + Number(v || 0), 0);
    if (!total) return 0;
    return ((total - rem) / total) * 100;
  }, [annual, remaining]);

  const myLeaves = mineQ.data?.data?.leaves || [];
  const pendingApprovals = approvalsQ.data?.data?.leaves || [];

  const columns = useMemo(
    () => [
      {
        key: "range",
        header: "Dates",
        cell: (l) => (
          <div>
            <div className="font-semibold text-slate-900">
              {new Date(l.startDate).toLocaleDateString()} →{" "}
              {new Date(l.endDate).toLocaleDateString()}
            </div>
            <div className="text-xs text-slate-600 font-mono">
              {l.days} day(s) • {l.type}
            </div>
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        cell: (l) => (
          <Badge
            tone={
              l.status === "APPROVED"
                ? "green"
                : l.status === "REJECTED"
                  ? "red"
                  : "slate"
            }
          >
            {l.status}
          </Badge>
        ),
      },
      {
        key: "reason",
        header: "Reason",
        cell: (l) => (
          <div className="text-sm text-slate-700 max-w-[420px] truncate">
            {l.reason || "—"}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <PageWrapper>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-extrabold tracking-tight">Leaves</div>
          <div className="mt-1 text-sm text-slate-600">
            Apply with date range, approvals queue, and a clean balance view.
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPrivileged ? (
            <Button variant="subtle" onClick={() => setApprovalOpen(true)}>
              <CalendarDays className="h-4 w-4" />
              Approvals
            </Button>
          ) : null}
          <Button onClick={() => setApplyOpen(true)}>Apply leave</Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold tracking-tight">
                Leave balance ({year})
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Remaining balance by type.
              </div>
            </div>
            <ProgressRing value={ring} label="Used" />
          </div>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {["SICK", "CASUAL", "PAID", "UNPAID"].map((t) => (
              <div key={t} className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="text-xs font-semibold text-slate-600">{t}</div>
                <div className="mt-2 text-2xl font-extrabold tracking-tight font-mono">
                  {String(remaining?.[t] ?? "—")}
                </div>
                <div className="mt-1 text-xs text-slate-500 font-mono">
                  / {String(annual?.[t] ?? "—")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="text-sm font-extrabold tracking-tight">Team calendar</div>
          <div className="mt-1 text-sm text-slate-600">
            Upcoming leaves will appear here (color-coded).
          </div>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No team events yet.
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm font-extrabold tracking-tight">Your requests</div>
        <div className="mt-1 text-sm text-slate-600">
          Latest leave applications and decisions.
        </div>
        <div className="mt-3">
          <DataTable
            columns={columns}
            rows={myLeaves}
            getRowId={(l) => l._id}
            selectedIds={[]}
            onToggleAll={() => {}}
            onToggleRow={() => {}}
            empty={
              <EmptyState
                title="No leave requests"
                description="Apply leave for a date range; approvals and balance will update automatically."
              />
            }
          />
        </div>
      </div>

      <ApplyLeaveModal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        busy={applyM.isPending}
        onApply={(p) => applyM.mutate(p)}
      />

      <ApprovalsModal
        open={approvalOpen}
        onClose={() => setApprovalOpen(false)}
        leaves={pendingApprovals}
        busy={approveM.isPending || rejectM.isPending}
        onApprove={(id, note) => approveM.mutate({ id, note })}
        onReject={(id, note) => rejectM.mutate({ id, note })}
      />
    </PageWrapper>
  );
}

const applySchema = z.object({
  type: z.enum(["SICK", "CASUAL", "PAID", "UNPAID"]),
  startDate: z.string().min(10),
  endDate: z.string().min(10),
  reason: z.string().trim().max(800).optional().default(""),
  attachmentUrl: z.string().url().optional().or(z.literal("")).default(""),
});

function ApplyLeaveModal({ open, onClose, busy, onApply }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(applySchema),
    defaultValues: {
      type: "PAID",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      reason: "",
      attachmentUrl: "",
    },
    mode: "onChange",
  });

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose?.();
      }}
      title="Apply leave"
      description="Choose a date range and type; attachments are optional."
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            disabled={busy}
            onClick={handleSubmit((v) => {
              const payload = {
                type: v.type,
                startDate: new Date(v.startDate).toISOString(),
                endDate: new Date(v.endDate).toISOString(),
                reason: v.reason,
                attachmentUrl: v.attachmentUrl || "",
              };
              onApply?.(payload);
            })}
          >
            {busy ? "Submitting..." : "Submit request"}
          </Button>
        </div>
      }
    >
      <div className="grid gap-3">
        <div className="relative">
          <select
            className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 pb-3 pt-5 text-sm font-semibold text-slate-900 hover:border-slate-300"
            {...register("type")}
          >
            <option value="PAID">PAID</option>
            <option value="CASUAL">CASUAL</option>
            <option value="SICK">SICK</option>
            <option value="UNPAID">UNPAID</option>
          </select>
          <div className="pointer-events-none absolute left-4 top-2 text-xs font-semibold text-slate-500">
            Type
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <input
              type="date"
              className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 pb-3 pt-5 text-sm font-semibold text-slate-900 hover:border-slate-300"
              {...register("startDate")}
            />
            <div className="pointer-events-none absolute left-4 top-2 text-xs font-semibold text-slate-500">
              Start date
            </div>
          </div>
          <div className="relative">
            <input
              type="date"
              className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 pb-3 pt-5 text-sm font-semibold text-slate-900 hover:border-slate-300"
              {...register("endDate")}
            />
            <div className="pointer-events-none absolute left-4 top-2 text-xs font-semibold text-slate-500">
              End date
            </div>
          </div>
        </div>
        <Input label="Reason" error={errors.reason?.message} {...register("reason")} />
        <Input
          label="Attachment URL (optional)"
          error={errors.attachmentUrl?.message}
          {...register("attachmentUrl")}
        />
      </div>
    </Modal>
  );
}

function ApprovalsModal({ open, onClose, leaves, busy, onApprove, onReject }) {
  const [noteById, setNoteById] = useState({});

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Approval queue"
      description="Approve or reject leave requests. Every decision is audited."
      footer={
        <div className="flex items-center justify-end">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      }
      className="max-w-3xl"
    >
      {leaves?.length ? (
        <div className="grid gap-3">
          {leaves.map((l) => (
            <div key={l._id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold tracking-tight">
                    {new Date(l.startDate).toLocaleDateString()} →{" "}
                    {new Date(l.endDate).toLocaleDateString()}
                  </div>
                  <div className="mt-1 text-xs text-slate-600 font-mono">
                    {l.days} day(s) • {l.type} • {l.employeeId}
                  </div>
                  <div className="mt-2 text-sm text-slate-700">
                    {l.reason || "—"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    disabled={busy}
                    onClick={() => onApprove?.(l._id, noteById[l._id] || "")}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={busy}
                    onClick={() => onReject?.(l._id, noteById[l._id] || "")}
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
              <div className="mt-3">
                <Input
                  label="Decision note (optional)"
                  value={noteById[l._id] || ""}
                  onChange={(e) =>
                    setNoteById((p) => ({ ...p, [l._id]: e.target.value }))
                  }
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No pending approvals"
          description="You’re all caught up."
        />
      )}
    </Modal>
  );
}

