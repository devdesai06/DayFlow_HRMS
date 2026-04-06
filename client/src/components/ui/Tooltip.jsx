import { useId, useState } from "react";
import { cn } from "../../utils/cn.js";

export function Tooltip({ children, content, className }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-describedby={id}
    >
      {children}
      {open ? (
        <span
          id={id}
          role="tooltip"
          className="absolute left-1/2 top-full z-40 mt-2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-card"
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}

