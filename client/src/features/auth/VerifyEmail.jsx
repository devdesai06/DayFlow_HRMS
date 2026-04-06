import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button.jsx";
import { ROUTES } from "../../constants/routes.js";
import { useAuthStore } from "./authStore.js";

export function VerifyEmail() {
  const [params] = useSearchParams();
  const verifyEmail = useAuthStore((s) => s.verifyEmail);
  const token = useMemo(() => params.get("token") || "", [params]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!token) return;
      setStatus("loading");
      try {
        await verifyEmail({ token });
        if (cancelled) return;
        toast.success("Email verified.");
        setStatus("success");
      } catch (e) {
        if (cancelled) return;
        const msg =
          e?.response?.data?.message || "Verification failed. Try again.";
        toast.error(msg);
        setStatus("error");
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen bg-white grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="card p-6">
          <div className="text-lg font-extrabold tracking-tight">
            Verify your email
          </div>
          <div className="mt-1 text-sm text-slate-600">
            {token
              ? "We’re confirming your verification token."
              : "Missing token. Please open the verification link again."}
          </div>

          <div className="mt-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-600">
                Status
              </div>
              <div className="mt-1 font-mono text-sm text-slate-900">
                {status}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Link
              to={ROUTES.LOGIN}
              className="focus-ring rounded-lg text-sm font-semibold text-slate-900 hover:underline"
            >
              Go to sign in
            </Link>
            <Button
              variant="subtle"
              onClick={() => window.location.reload()}
              disabled={!token}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

