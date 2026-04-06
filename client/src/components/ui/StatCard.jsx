import { cn } from "../../utils/cn.js";
import { Badge } from "./Badge.jsx";

export function StatCard({
  label,
  value,
  change,
  changeTone,
  icon,
  sparkline,
  className,
}) {
  return (
    <div className={cn("card p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-600">{label}</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </div>
          {typeof change === "string" ? (
            <div className="mt-2">
              <Badge tone={changeTone || "slate"}>{change}</Badge>
            </div>
          ) : null}
        </div>
        {icon ? (
          <div className="h-10 w-10 rounded-2xl border border-slate-200 bg-slate-50 grid place-items-center text-slate-800">
            {icon}
          </div>
        ) : null}
      </div>
      {sparkline ? <div className="mt-4">{sparkline}</div> : null}
    </div>
  );
}

