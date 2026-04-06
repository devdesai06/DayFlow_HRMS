import { PageWrapper } from "../../components/layout/PageWrapper.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "../../services/api.js";
import { StatCard } from "../../components/ui/StatCard.jsx";
import { ClipboardList, Users } from "lucide-react";
import { Badge } from "../../components/ui/Badge.jsx";

export function HRDash() {
  const q = useQuery({
    queryKey: ["dashboard", "hr"],
    queryFn: () => fetchDashboard("hr"),
  });
  const d = q.data?.data || {};
  const pending = d.pendingLeaves || [];
  return (
    <PageWrapper>
      <div className="text-2xl font-extrabold tracking-tight">HR Dashboard</div>
      <div className="mt-1 text-sm text-slate-600">
        Leave requests, attendance summary, and activity feed.
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          label="Active employees"
          value={String(d.activeEmployees ?? "—")}
          change="Company"
          changeTone="slate"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Pending leave requests"
          value={String(pending.length)}
          change="Needs review"
          changeTone={pending.length ? "red" : "slate"}
          icon={<ClipboardList className="h-5 w-5" />}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4 lg:col-span-2">
          <div className="text-sm font-bold">Leave requests</div>
          <div className="mt-3 grid gap-2">
            {pending.length ? (
              pending.slice(0, 6).map((l) => (
                <div
                  key={l._id}
                  className="rounded-2xl border border-slate-200 bg-white p-3 hover:bg-slate-50 transition-premium"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {new Date(l.startDate).toLocaleDateString()} →{" "}
                        {new Date(l.endDate).toLocaleDateString()}
                      </div>
                      <div className="mt-1 text-xs text-slate-600 font-mono">
                        {l.days} day(s) • {l.type}
                      </div>
                      <div className="mt-1 text-sm text-slate-700 truncate">
                        {l.reason || "—"}
                      </div>
                    </div>
                    <Badge tone="slate">PENDING</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-2 text-sm text-slate-600">
                No requests yet.
              </div>
            )}
          </div>
        </div>
        <div className="card p-4">
          <div className="text-sm font-bold">Birthdays & anniversaries</div>
          <div className="mt-2 text-sm text-slate-600">Nothing today.</div>
        </div>
      </div>
    </PageWrapper>
  );
}

