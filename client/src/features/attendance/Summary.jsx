import { PageWrapper } from "../../components/layout/PageWrapper.jsx";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Clock, LogIn, LogOut } from "lucide-react";
import { Button } from "../../components/ui/Button.jsx";
import { StatCard } from "../../components/ui/StatCard.jsx";
import { DataTable } from "../../components/ui/DataTable.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import { useAuthStore } from "../auth/authStore.js";
import { checkIn, checkOut, fetchMonthly } from "./attendanceApi.js";

export function AttendanceSummary() {
  const user = useAuthStore((s) => s.user);
  const employeeId = user?.employeeId || "";

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [active, setActive] = useState(null); // { checkInAt }

  const monthlyQ = useQuery({
    queryKey: ["attendance", "monthly", employeeId, year, month],
    enabled: Boolean(employeeId),
    queryFn: () => fetchMonthly(employeeId, { year, month }),
  });

  const rows = monthlyQ.data?.data?.rows || [];
  const summary = monthlyQ.data?.data?.summary || {
    days: 0,
    totalMinutes: 0,
    lateDays: 0,
    earlyLeaveDays: 0,
    overtimeDays: 0,
  };

  const checkInM = useMutation({
    mutationFn: () => checkIn(),
    onSuccess: (data) => {
      const a = data?.data?.attendance || null;
      setActive(a?.checkInAt && !a?.checkOutAt ? { checkInAt: a.checkInAt } : null);
      toast.success("Checked in.");
      monthlyQ.refetch();
    },
  });

  const checkOutM = useMutation({
    mutationFn: () => checkOut(),
    onSuccess: () => {
      setActive(null);
      toast.success("Checked out.");
      monthlyQ.refetch();
    },
  });

  const [timerText, setTimerText] = useState("—");

  useEffect(() => {
    if (!active?.checkInAt) {
      setTimerText("—");
      return;
    }
    const update = () => {
      const ms = Date.now() - new Date(active.checkInAt).getTime();
      const mins = Math.max(0, Math.floor(ms / 60000));
      const h = String(Math.floor(mins / 60)).padStart(2, "0");
      const m = String(mins % 60).padStart(2, "0");
      setTimerText(`${h}:${m}`);
    };
    update();
    const interval = setInterval(update, 60000); // update every minute
    return () => clearInterval(interval);
  }, [active]);

  const heat = useMemo(() => buildHeatmap(rows, year), [rows, year]);

  const columns = useMemo(
    () => [
      {
        key: "date",
        header: "Date",
        cell: (r) => (
          <div className="font-mono text-slate-800">{r.dateKey}</div>
        ),
      },
      {
        key: "in",
        header: "Check in",
        cell: (r) => (r.checkInAt ? new Date(r.checkInAt).toLocaleTimeString() : "—"),
      },
      {
        key: "out",
        header: "Check out",
        cell: (r) => (r.checkOutAt ? new Date(r.checkOutAt).toLocaleTimeString() : "—"),
      },
      {
        key: "total",
        header: "Total",
        cellClassName: "font-mono",
        cell: (r) => (r.totalMinutes ? `${Math.floor(r.totalMinutes / 60)}h ${r.totalMinutes % 60}m` : "—"),
      },
      {
        key: "flags",
        header: "Flags",
        cell: (r) => (
          <div className="flex flex-wrap gap-1.5">
            {r.flags?.late ? <Badge tone="red">Late</Badge> : null}
            {r.flags?.earlyLeave ? <Badge tone="red">Early</Badge> : null}
            {r.flags?.overtime ? <Badge tone="green">Overtime</Badge> : null}
            {!r.flags?.late && !r.flags?.earlyLeave && !r.flags?.overtime ? (
              <Badge tone="slate">—</Badge>
            ) : null}
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
          <div className="text-2xl font-extrabold tracking-tight">Attendance</div>
          <div className="mt-1 text-sm text-slate-600">
            Check-in/out with a live timer, a GitHub-style heatmap, and monthly summaries.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={active ? "subtle" : "primary"}
            disabled={checkInM.isPending || checkOutM.isPending || !employeeId}
            onClick={() => {
              if (active) return;
              checkInM.mutate();
            }}
          >
            <LogIn className="h-4 w-4" />
            Check in
          </Button>
          <Button
            variant={active ? "primary" : "subtle"}
            disabled={checkInM.isPending || checkOutM.isPending || !employeeId}
            onClick={() => {
              if (!active) return;
              checkOutM.mutate();
            }}
          >
            <LogOut className="h-4 w-4" />
            Check out
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Live timer"
          value={timerText}
          change={active ? "Checked in" : "Not checked in"}
          changeTone={active ? "green" : "slate"}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          label="Days recorded"
          value={String(summary.days || 0)}
          change={`${monthName(month)} ${year}`}
          changeTone="indigo"
        />
        <StatCard
          label="Total hours"
          value={formatHours(summary.totalMinutes || 0)}
          change={`${summary.lateDays || 0} late • ${summary.earlyLeaveDays || 0} early`}
          changeTone={summary.lateDays || summary.earlyLeaveDays ? "red" : "slate"}
        />
        <StatCard
          label="Overtime days"
          value={String(summary.overtimeDays || 0)}
          change={summary.overtimeDays ? "Great effort" : "—"}
          changeTone={summary.overtimeDays ? "green" : "slate"}
        />
      </div>

      <div className="mt-6 card p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-sm font-extrabold tracking-tight">Heatmap</div>
            <div className="mt-1 text-sm text-slate-600">
              Each square is a day; intensity reflects total hours.
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
                  {monthName(m)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-auto">
          <div className="min-w-[760px]">
            <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(53, minmax(0, 1fr))" }}>
              {heat.map((cell) => (
                <div
                  key={cell.key}
                  title={`${cell.key}: ${cell.minutes ? formatHours(cell.minutes) : "—"}`}
                  className={[
                    "h-3.5 w-3.5 rounded-[4px] border transition-premium",
                    "hover:scale-[1.12] hover:border-slate-400",
                    cell.level === 0
                      ? "bg-slate-50 border-slate-200"
                      : cell.level === 1
                        ? "bg-indigo/10 border-indigo/20"
                        : cell.level === 2
                          ? "bg-indigo/25 border-indigo/30"
                          : cell.level === 3
                            ? "bg-indigo/50 border-indigo/40"
                            : "bg-indigo border-indigo/60",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-sm font-extrabold tracking-tight">Monthly log</div>
            <div className="mt-1 text-sm text-slate-600">
              Recorded days with flags and totals.
            </div>
          </div>
        </div>
        <div className="mt-3">
          <DataTable
            columns={columns}
            rows={rows}
            getRowId={(r) => r._id}
            selectedIds={[]}
            onToggleAll={() => {}}
            onToggleRow={() => {}}
            empty={
              <EmptyState
                title="No attendance records"
                description="Check in and check out to start building your attendance history."
              />
            }
          />
        </div>
      </div>
    </PageWrapper>
  );
}

function formatHours(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
}

function monthName(m) {
  return new Date(2000, m - 1, 1).toLocaleString(undefined, { month: "short" });
}

function buildHeatmap(rows, year) {
  const byKey = new Map(rows.map((r) => [r.dateKey, Number(r.totalMinutes || 0)]));
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));

  const days = [];
  for (let d = new Date(start); d < end; d = new Date(d.getTime() + 86400000)) {
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    const minutes = byKey.get(key) || 0;
    const level = minutes === 0 ? 0 : minutes < 240 ? 1 : minutes < 420 ? 2 : minutes < 540 ? 3 : 4;
    days.push({ key, minutes, level });
  }

  // Pad to 53*7 grid by adding leading blanks based on weekday (Sun=0)
  const firstWeekday = start.getUTCDay();
  const padded = [];
  for (let i = 0; i < firstWeekday; i += 1) {
    padded.push({ key: `pad-start-${i}`, minutes: 0, level: 0 });
  }
  padded.push(...days);
  while (padded.length < 53 * 7) {
    padded.push({ key: `pad-end-${padded.length}`, minutes: 0, level: 0 });
  }
  return padded.slice(0, 53 * 7);
}

