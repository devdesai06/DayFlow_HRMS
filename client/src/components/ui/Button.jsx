import * as React from "react";
import { cn } from "../../utils/cn.js";

export const Button = React.forwardRef(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    disabled,
    type = "button",
    ...props
  },
  ref
) {
  const base =
    "focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-premium active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-indigo text-white hover:bg-[#5558E6] shadow-sm shadow-indigo/10",
    ghost:
      "bg-transparent text-slate-900 hover:bg-slate-100 border border-slate-200",
    destructive: "bg-rose text-white hover:bg-[#E33651]",
    subtle:
      "bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200",
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});

