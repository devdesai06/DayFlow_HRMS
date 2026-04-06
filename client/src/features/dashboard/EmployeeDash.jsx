import { PageWrapper } from "../../components/layout/PageWrapper.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "../../services/api.js";
import { StatCard } from "../../components/ui/StatCard.jsx";
import { CalendarDays, FileText, Timer } from "lucide-react";

export function EmployeeDash() {
  const q = useQuery({
    queryKey: ["dashboard", "employee"],
    queryFn: () => fetchDashboard("employee"),
  });
  const d = q.data?.data || {};
  return (
    <PageWrapper>
      <div className="text-2xl font-extrabold tracking-tight">
        Your Dayflow
      </div>
      <div className="mt-1 text-sm text-slate-600">
        Attendance, leave balance, and payslips at a glance.
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Recent leaves"
          value={String((d.recentLeaves || []).length)}
          change="Last 5"
          changeTone="slate"
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <StatCard
          label="Recent payslips"
          value={String((d.recentPayroll || []).length)}
          change="Last 5"
          changeTone="slate"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="This month"
          value={`${d.year ?? "—"}-${String(d.month ?? "—").padStart(2, "0")}`}
          change="Period"
          changeTone="indigo"
          icon={<Timer className="h-5 w-5" />}
        />
        <StatCard
          label="Quick actions"
          value="—"
          change="Attendance • Leave • Payslips"
          changeTone="slate"
        />
      </div>
    </PageWrapper>
  );
}

