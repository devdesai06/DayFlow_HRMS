import { cn } from "../../utils/cn.js";

export function Avatar({ className, src, name }) {
  const initials = getInitials(name);
  return (
    <div
      className={cn(
        "h-9 w-9 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden grid place-items-center",
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name || "Avatar"}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className="font-mono text-xs font-bold text-slate-700">
          {initials}
        </span>
      )}
    </div>
  );
}

function getInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (!parts.length) return "—";
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}

