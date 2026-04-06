import { cn } from "../../utils/cn.js";

export function EmptyState({
  className,
  title,
  description,
  action,
  illustration = "people",
}) {
  return (
    <div className={cn("card p-6", className)}>
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        <div className="w-36 h-28 shrink-0 rounded-2xl border border-slate-200 bg-slate-50 grid place-items-center">
          {illustration === "people" ? <PeopleSvg /> : <GenericSvg />}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-extrabold tracking-tight text-slate-900">
            {title}
          </div>
          <div className="mt-1 text-sm text-slate-600">{description}</div>
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}

function PeopleSvg() {
  return (
    <svg
      width="112"
      height="80"
      viewBox="0 0 112 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="8" y="10" width="96" height="60" rx="16" fill="#FFFFFF" />
      <rect x="8" y="10" width="96" height="60" rx="16" stroke="#E2E8F0" />
      <path
        d="M35 52c0-6.075 4.925-11 11-11h20c6.075 0 11 4.925 11 11v6H35v-6z"
        fill="#EEF2FF"
        stroke="#6366F1"
      />
      <circle cx="46" cy="33" r="8" fill="#E0F2FE" stroke="#0EA5E9" />
      <circle cx="66" cy="33" r="8" fill="#DCFCE7" stroke="#10B981" />
      <path
        d="M24 26h10M24 32h14M24 38h12"
        stroke="#CBD5E1"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M84 26h8M84 32h12M84 38h10"
        stroke="#CBD5E1"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GenericSvg() {
  return (
    <svg
      width="112"
      height="80"
      viewBox="0 0 112 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="8" y="10" width="96" height="60" rx="16" fill="#FFFFFF" />
      <rect x="8" y="10" width="96" height="60" rx="16" stroke="#E2E8F0" />
      <path
        d="M34 28h44M34 38h34M34 48h28"
        stroke="#CBD5E1"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="80" cy="50" r="8" fill="#FEE2E2" stroke="#F43F5E" />
    </svg>
  );
}

