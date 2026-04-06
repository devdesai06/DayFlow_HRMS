import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { ROUTES } from "../../constants/routes.js";
import { useAuthStore } from "./authStore.js";
import { forgotSchema } from "./schemas.js";

export function ForgotPassword() {
  const forgotPassword = useAuthStore((s) => s.forgotPassword);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  return (
    <div className="min-h-screen bg-white grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="card p-6">
          <div className="text-lg font-extrabold tracking-tight">
            Reset your password
          </div>
          <div className="mt-1 text-sm text-slate-600">
            We’ll email a 6-digit code if the account exists.
          </div>

          <form
            className="mt-6 grid gap-4"
            onSubmit={handleSubmit(async (values) => {
              try {
                await forgotPassword(values);
                toast.success("If the email exists, a code has been sent.");
              } catch (e) {
                const msg =
                  e?.response?.data?.message ||
                  "Could not request code. Please try again.";
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

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Sending..." : "Send code"}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <Link
                to={ROUTES.RESET_PASSWORD}
                className="focus-ring rounded-lg font-semibold text-slate-900 hover:underline"
              >
                I have a code
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

