import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { ROUTES } from "../../constants/routes.js";
import { useAuthStore } from "./authStore.js";
import { registerSchema } from "./schemas.js";

export function Register() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((s) => s.register);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
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
                Create your account
              </div>
              <div className="mt-1 text-sm text-slate-600">
                You’ll receive an email verification link.
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
                await registerUser(values);
                toast.success("Account created. Check your email to verify.");
                navigate(ROUTES.LOGIN, { replace: true });
              } catch (e) {
                const msg =
                  e?.response?.data?.message ||
                  "Registration failed. Please try again.";
                toast.error(msg);
              }
            })}
          >
            <Input
              label="Work email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register("password")}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating..." : "Create account"}
            </Button>

            <div className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to={ROUTES.LOGIN}
                className="focus-ring rounded-lg font-semibold text-slate-900 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

