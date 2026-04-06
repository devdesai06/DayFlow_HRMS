import { useEffect, useRef } from "react";
import { cn } from "../../utils/cn.js";

export function Checkbox({ className, indeterminate, ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "focus-ring h-4 w-4 rounded border-slate-300 text-indigo accent-indigo transition-premium",
        "hover:border-slate-400",
        className
      )}
      {...props}
    />
  );
}

