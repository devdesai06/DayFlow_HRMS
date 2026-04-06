import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { PageWrapper } from "../../components/layout/PageWrapper.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Avatar } from "../../components/ui/Avatar.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { cn } from "../../utils/cn.js";
import { ROUTES } from "../../constants/routes.js";
import { deleteEmployee, fetchEmployee, updateEmployee } from "./employeeApi.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeUpdateSchema } from "./employeeSchemas.js";
import { AvatarUpload } from "./AvatarUpload.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";

export function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);

  const qKey = useMemo(() => ["employee", id], [id]);
  const empQ = useQuery({
    queryKey: qKey,
    queryFn: () => fetchEmployee(id),
    enabled: Boolean(id),
  });

  const employee = empQ.data?.data?.employee || null;

  const updateM = useMutation({
    mutationFn: (payload) => updateEmployee(id, payload),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: qKey });
      const prev = qc.getQueryData(qKey);
      qc.setQueryData(qKey, (old) => {
        const e = old?.data?.employee;
        if (!e) return old;
        return { ...old, data: { ...old.data, employee: deepMerge(e, payload) } };
      });
      return { prev };
    },
    onError: (_e, _p, ctx) => {
      if (ctx?.prev) qc.setQueryData(qKey, ctx.prev);
    },
    onSuccess: () => {
      toast.success("Employee updated.");
      qc.invalidateQueries({ queryKey: ["employees"] });
      qc.invalidateQueries({ queryKey: qKey });
      setEditOpen(false);
    },
  });

  const deleteM = useMutation({
    mutationFn: () => deleteEmployee(id),
    onSuccess: () => {
      toast.success("Employee deleted.");
      qc.invalidateQueries({ queryKey: ["employees"] });
      navigate(ROUTES.EMPLOYEES, { replace: true });
    },
  });

  const header = (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <Link
          to={ROUTES.EMPLOYEES}
          className="focus-ring inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to employees
        </Link>

        <div className="mt-4 flex items-center gap-3">
          <Avatar
            src={employee?.avatar?.url || ""}
            name={employee ? `${employee.firstName} ${employee.lastName}` : ""}
            className="h-12 w-12 rounded-2xl"
          />
          <div className="min-w-0">
            <div className="text-2xl font-extrabold tracking-tight truncate">
              {employee ? `${employee.firstName} ${employee.lastName}` : "Employee"}
            </div>
            <div className="mt-1 text-sm text-slate-600 font-mono truncate">
              {employee?.employeeCode || "—"} • {employee?.email || "—"}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {employee?.department ? <Badge tone="slate">{employee.department}</Badge> : null}
          {employee?.role ? <Badge tone="indigo">{employee.role}</Badge> : null}
          {employee?.status ? (
            <Badge tone={employee.status === "ACTIVE" ? "green" : employee.status === "EXITED" ? "red" : "slate"}>
              {employee.status}
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="subtle" onClick={() => setEditOpen(true)} disabled={!employee}>
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
        <Button variant="destructive" onClick={() => deleteM.mutate()} disabled={deleteM.isPending || !employee}>
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );

  return (
    <PageWrapper>
      {header}

      <div className="mt-6 card p-2">
        <div className="flex flex-wrap gap-1">
          <Tab to="profile">Profile</Tab>
          <Tab to="documents">Documents</Tab>
          <Tab to="attendance">Attendance</Tab>
          <Tab to="payroll">Payroll</Tab>
          <Tab to="leave">Leave</Tab>
        </div>
      </div>

      <div className="mt-4">
        <Routes>
          <Route path="/" element={<ProfileTab employee={employee} />} />
          <Route path="profile" element={<ProfileTab employee={employee} />} />
          <Route path="documents" element={<DocumentsTab />} />
          <Route path="attendance" element={<AttendanceTab />} />
          <Route path="payroll" element={<PayrollTab />} />
          <Route path="leave" element={<LeaveTab />} />
        </Routes>
      </div>

      <EditEmployeeModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        employee={employee}
        busy={updateM.isPending}
        onSave={(payload) => updateM.mutate(payload)}
      />
    </PageWrapper>
  );
}

function Tab({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          "focus-ring rounded-xl px-3 py-2 text-sm font-semibold transition-premium",
          isActive ? "bg-white border border-slate-200 shadow-card" : "text-slate-700 hover:bg-slate-50"
        )
      }
    >
      {children}
    </NavLink>
  );
}

function ProfileTab({ employee }) {
  if (!employee) {
    return (
      <EmptyState
        title="Employee not loaded"
        description="We couldn’t load this employee record yet. If the issue persists, refresh the page."
      />
    );
  }

  const salary =
    employee.salary?.annual
      ? `${employee.salary.currency} ${Number(employee.salary.annual).toLocaleString()}`
      : "—";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="card p-5 lg:col-span-2">
        <div className="text-sm font-extrabold tracking-tight">Details</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <Field label="First name" value={employee.firstName} />
          <Field label="Last name" value={employee.lastName} />
          <Field label="Email" value={employee.email} mono />
          <Field label="Phone" value={employee.phone || "—"} mono />
          <Field label="Join date" value={employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : "—"} />
          <Field label="Salary" value={salary} mono />
          <Field label="Department" value={employee.department || "—"} />
          <Field label="Role" value={employee.role} mono />
        </div>
      </div>

      <div className="card p-5">
        <div className="text-sm font-extrabold tracking-tight">Address</div>
        <div className="mt-4 grid gap-2 text-sm">
          <Field label="Line 1" value={employee.address?.line1 || "—"} />
          <Field label="Line 2" value={employee.address?.line2 || "—"} />
          <Field label="City" value={employee.address?.city || "—"} />
          <Field label="State" value={employee.address?.state || "—"} />
          <Field label="Postal code" value={employee.address?.postalCode || "—"} mono />
          <Field label="Country" value={employee.address?.country || "—"} />
        </div>
      </div>

      <div className="card p-5 lg:col-span-3">
        <div className="text-sm font-extrabold tracking-tight">Emergency contact</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <Field label="Name" value={employee.emergencyContact?.name || "—"} />
          <Field label="Relation" value={employee.emergencyContact?.relation || "—"} />
          <Field label="Phone" value={employee.emergencyContact?.phone || "—"} mono />
        </div>
      </div>
    </div>
  );
}

function DocumentsTab() {
  return (
    <EmptyState
      title="No documents yet"
      description="Upload offer letter, ID proof, and contracts here for a complete employee file."
    />
  );
}
function AttendanceTab() {
  return (
    <EmptyState
      title="No attendance data yet"
      description="Attendance records will appear here once check-ins begin."
    />
  );
}
function PayrollTab() {
  return (
    <EmptyState
      title="No payroll history yet"
      description="Run payroll to generate payslips and salary history for this employee."
    />
  );
}
function LeaveTab() {
  return (
    <EmptyState
      title="No leave records yet"
      description="Leave applications and balances will show up here."
    />
  );
}

function Field({ label, value, mono }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className={cn("mt-1 font-semibold text-slate-900", mono ? "font-mono" : "")}>
        {value}
      </div>
    </div>
  );
}

function EditEmployeeModal({ open, onClose, employee, onSave, busy }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeUpdateSchema),
    defaultValues: {
      employeeCode: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      role: "EMPLOYEE",
      status: "ACTIVE",
      joinDate: "",
      salaryAnnual: 0,
      salaryCurrency: "USD",
    },
    mode: "onChange",
  });

  const avatar = watch("__avatar") || null;

  const initial = useMemo(() => employee, [employee]);

  useEffect(() => {
    if (!open || !initial) return;
    reset({
      employeeCode: initial.employeeCode || "",
      firstName: initial.firstName || "",
      lastName: initial.lastName || "",
      email: initial.email || "",
      phone: initial.phone || "",
      department: initial.department || "",
      role: initial.role || "EMPLOYEE",
      status: initial.status || "ACTIVE",
      joinDate: initial.joinDate ? new Date(initial.joinDate).toISOString().slice(0, 10) : "",
      salaryAnnual: initial.salary?.annual || 0,
      salaryCurrency: initial.salary?.currency || "USD",
    });
    setValue("__avatar", initial.avatar?.url ? { url: initial.avatar.url, publicId: initial.avatar.publicId } : null);
  }, [open, initial, reset, setValue]);

  const name = `${watch("firstName") || ""} ${watch("lastName") || ""}`.trim();

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose?.();
      }}
      title="Edit employee"
      description="Update profile details. Changes are audited."
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            disabled={busy || !employee}
            onClick={handleSubmit((v) => {
              const payload = {
                employeeCode: v.employeeCode,
                firstName: v.firstName,
                lastName: v.lastName,
                email: v.email,
                phone: v.phone,
                department: v.department,
                role: v.role,
                status: v.status,
                joinDate: v.joinDate ? new Date(v.joinDate).toISOString() : null,
                salary: { currency: v.salaryCurrency, annual: v.salaryAnnual },
                avatar: avatar || { url: "", publicId: "" },
              };
              onSave?.(payload);
            })}
          >
            {busy ? "Saving..." : "Save changes"}
          </Button>
        </div>
      }
    >
      <div className="grid gap-4">
        <AvatarUpload
          value={avatar}
          name={name}
          onChange={(next) => setValue("__avatar", next, { shouldDirty: true })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Employee code" mono error={errors.employeeCode?.message} {...register("employeeCode")} />
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <Input label="First name" error={errors.firstName?.message} {...register("firstName")} />
          <Input label="Last name" error={errors.lastName?.message} {...register("lastName")} />
          <Input label="Phone" {...register("phone")} />
          <Input label="Department" {...register("department")} />
          <div className="relative">
            <select
              className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 pb-3 pt-5 text-sm font-semibold text-slate-900 hover:border-slate-300"
              {...register("role")}
            >
              <option value="EMPLOYEE">EMPLOYEE</option>
              <option value="HR">HR</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>
            <div className="pointer-events-none absolute left-4 top-2 text-xs font-semibold text-slate-500">
              Role
            </div>
          </div>
          <div className="relative">
            <select
              className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 pb-3 pt-5 text-sm font-semibold text-slate-900 hover:border-slate-300"
              {...register("status")}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="ONBOARDING">ONBOARDING</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="EXITED">EXITED</option>
            </select>
            <div className="pointer-events-none absolute left-4 top-2 text-xs font-semibold text-slate-500">
              Status
            </div>
          </div>
          <div className="relative">
            <input
              type="date"
              className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 pb-3 pt-5 text-sm font-semibold text-slate-900 hover:border-slate-300"
              {...register("joinDate")}
            />
            <div className="pointer-events-none absolute left-4 top-2 text-xs font-semibold text-slate-500">
              Join date
            </div>
          </div>
          <Input label="Annual salary" mono inputMode="numeric" {...register("salaryAnnual", { valueAsNumber: true })} />
          <Input label="Currency" mono {...register("salaryCurrency")} />
        </div>
      </div>
    </Modal>
  );
}

function deepMerge(target, patch) {
  if (!patch || typeof patch !== "object") return patch;
  if (!target || typeof target !== "object") return patch;
  const out = Array.isArray(target) ? [...target] : { ...target };
  for (const [k, v] of Object.entries(patch)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = deepMerge(target[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

