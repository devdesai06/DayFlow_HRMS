import { cn } from "../../utils/cn.js";

export function Badge({ className, tone = "slate", ...props }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald/10 text-emerald",
    red: "bg-rose/10 text-rose",
    indigo: "bg-indigo/10 text-indigo",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

