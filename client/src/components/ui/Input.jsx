import * as React from "react";
import { cn } from "../../utils/cn.js";

export function Input({
  className,
  label,
  error,
  type = "text",
  mono = false,
  ...props
}) {
  const id = React.useId();

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder=" "
          className={cn(
            "focus-ring peer w-full rounded-2xl border bg-white px-4 pb-3 pt-5 text-sm transition-premium",
            "border-slate-200 hover:border-slate-300",
            error ? "border-rose focus-visible:ring-rose" : "",
            mono ? "font-mono" : ""
          )}
          {...props}
        />
        {label ? (
          <label
            htmlFor={id}
            className={cn(
              "pointer-events-none absolute left-4 top-4 origin-left text-xs font-semibold text-slate-500 transition-premium",
              "peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:text-slate-500",
              "peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-slate-700"
            )}
          >
            {label}
          </label>
        ) : null}
      </div>
      {error ? (
        <div className="mt-1.5 text-xs font-medium text-rose">{error}</div>
      ) : null}
    </div>
  );
}

