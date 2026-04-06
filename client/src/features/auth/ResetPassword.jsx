import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { ROUTES } from "../../constants/routes.js";
import { useAuthStore } from "./authStore.js";
import { resetSchema } from "./schemas.js";

export function ResetPassword() {
  const resetPassword = useAuthStore((s) => s.resetPassword);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "", otp: "", newPassword: "" },
    mode: "onChange",
  });

  return (
    <div className="min-h-screen bg-white grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="card p-6">
          <div className="text-lg font-extrabold tracking-tight">
            Enter your reset code
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Use the 6-digit code and set a new password.
          </div>

          <form
            className="mt-6 grid gap-4"
            onSubmit={handleSubmit(async (values) => {
              try {
                await resetPassword(values);
                toast.success("Password reset. You can sign in now.");
              } catch (e) {
                const msg =
                  e?.response?.data?.message ||
                  "Reset failed. Please check the code and try again.";
                toast.error(msg);
              }
            })}
          >
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="6-digit code"
              mono
              inputMode="numeric"
              error={errors.otp?.message}
              {...register("otp")}
            />
            <Input
              label="New password"
              type="password"
              autoComplete="new-password"
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Resetting..." : "Reset password"}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="focus-ring rounded-lg text-slate-700 hover:text-slate-900 hover:underline"
              >
                Resend code
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="focus-ring rounded-lg text-slate-700 hover:text-slate-900 hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

