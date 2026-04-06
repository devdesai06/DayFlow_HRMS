import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { ROUTES } from "../../constants/routes.js";
import { useAuthStore } from "./authStore.js";
import { loginSchema } from "./schemas.js";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  return (
    <div className="min-h-screen bg-white grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-extrabold tracking-tight">
                Welcome back
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Sign in to Dayflow to continue.
              </div>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-indigo/10 border border-slate-200 grid place-items-center">
              <div className="h-2.5 w-2.5 rounded-full bg-indigo" />
            </div>
          </div>

          <form
            className="mt-6 grid gap-4"
            onSubmit={handleSubmit(async (values) => {
              try {
                await login(values);
                toast.success("Logged in.");
                navigate(from, { replace: true });
              } catch (e) {
                const msg =
                  e?.response?.data?.message || "Login failed. Please try again.";
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
              label="Password"
              type="password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="focus-ring rounded-lg text-slate-700 hover:text-slate-900 hover:underline"
              >
                Forgot password?
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="focus-ring rounded-lg text-slate-700 hover:text-slate-900 hover:underline"
              >
                Create account
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-4 text-xs text-slate-500">
          By continuing, you agree to Dayflow’s terms and privacy policy.
        </div>
      </div>
    </div>
  );
}

