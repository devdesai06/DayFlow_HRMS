import { cn } from "../../utils/cn.js";

export function ProgressRing({ value, size = 84, stroke = 10, className, label }) {
  const v = Math.max(0, Math.min(100, Number(value || 0)));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (v / 100) * c;

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <svg width={size} height={size} className="shrink-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#E2E8F0"
          strokeWidth={stroke}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#6366F1"
          strokeWidth={stroke}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-slate-900 font-mono text-sm font-extrabold"
        >
          {Math.round(v)}%
        </text>
      </svg>
      {label ? (
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-600">{label}</div>
        </div>
      ) : null}
    </div>
  );
}

