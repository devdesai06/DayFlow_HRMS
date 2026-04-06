import { PageWrapper } from "../../components/layout/PageWrapper.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "../../services/api.js";
import { StatCard } from "../../components/ui/StatCard.jsx";
import { Users, ClipboardList, Activity, FileText } from "lucide-react";

export function AdminDash() {
  const q = useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: () => fetchDashboard("admin"),
  });
  const d = q.data?.data || {};
  return (
    <PageWrapper>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-extrabold tracking-tight">
            Admin Dashboard
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Company-wide metrics and approvals in one view.
          </div>
        </div>
        <Badge tone="indigo">Live</Badge>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Headcount"
          value={String(d.headcount ?? "—")}
          change="Active employees"
          changeTone="slate"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Pending approvals"
          value={String(d.pendingApprovals ?? "—")}
          change="Leaves awaiting action"
          changeTone={Number(d.pendingApprovals || 0) ? "red" : "slate"}
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <StatCard
          label="Live check-ins"
          value={String(d.liveAttendance ?? "—")}
          change="Today"
          changeTone="indigo"
          icon={<Activity className="h-5 w-5" />}
        />
        <StatCard
          label="Payroll runs"
          value={String(d.payrollRuns ?? "—")}
          change="All time"
          changeTone="slate"
          icon={<FileText className="h-5 w-5" />}
        />
      </div>
    </PageWrapper>
  );
}

