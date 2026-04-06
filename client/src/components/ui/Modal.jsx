import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn.js";
import { Button } from "./Button.jsx";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) onClose?.();
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
            className={cn(
              "absolute left-1/2 top-1/2 w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2",
              "bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden",
              className
            )}
            role="dialog"
            aria-modal="true"
          >
            <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-extrabold tracking-tight">
                  {title}
                </div>
                {description ? (
                  <div className="mt-1 text-sm text-slate-600">
                    {description}
                  </div>
                ) : null}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="shrink-0"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-5">{children}</div>
            {footer ? (
              <div className="p-5 border-t border-slate-200 bg-slate-50/60">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

