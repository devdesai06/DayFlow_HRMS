import { PageWrapper } from "../../components/layout/PageWrapper.jsx";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Trash2, Pencil, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button.jsx";
import { DataTable } from "../../components/ui/DataTable.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Avatar } from "../../components/ui/Avatar.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { ROUTES } from "../../constants/routes.js";
import {
  bulkDeleteEmployees,
  createEmployee,
  deleteEmployee,
  fetchEmployees,
} from "./employeeApi.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeCreateSchema } from "./employeeSchemas.js";
import { AvatarUpload } from "./AvatarUpload.jsx";

export function EmployeeList() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      search: search.trim() || undefined,
      department: department.trim() || undefined,
      status: status || undefined,
      role: role || undefined,
      sortBy: "createdAt",
      sortDir: "desc",
    }),
    [page, search, department, status, role]
  );

  const qKey = ["employees", params];
  const listQ = useQuery({
    queryKey: qKey,
    queryFn: () => fetchEmployees(params),
  });

  const rows = listQ.data?.data?.employees || [];
  const pagination = listQ.data?.pagination || null;

  const createM = useMutation({
    mutationFn: (payload) => createEmployee(payload),
    onSuccess: () => {
      toast.success("Employee created.");
      qc.invalidateQueries({ queryKey: ["employees"] });
      setCreateOpen(false);
    },
  });

  const deleteM = useMutation({
    mutationFn: (id) => deleteEmployee(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["employees"] });
      const prev = qc.getQueryData(qKey);
      qc.setQueryData(qKey, (old) => {
        const employees = old?.data?.employees || [];
        return {
          ...old,
          data: {
            ...old.data,
            employees: employees.filter((e) => String(e._id) !== String(id)),
          },
        };
      });
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(qKey, ctx.prev);
    },
    onSuccess: () => {
      toast.success("Employee deleted.");
      qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const bulkDeleteM = useMutation({
    mutationFn: (ids) => bulkDeleteEmployees(ids),
    onMutate: async (ids) => {
      await qc.cancelQueries({ queryKey: ["employees"] });
      const prev = qc.getQueryData(qKey);
      qc.setQueryData(qKey, (old) => {
        const employees = old?.data?.employees || [];
        const set = new Set(ids);
        return {
          ...old,
          data: {
            ...old.data,
            employees: employees.filter((e) => !set.has(String(e._id))),
          },
        };
      });
      return { prev };
    },
    onError: (_e, _ids, ctx) => {
      if (ctx?.prev) qc.setQueryData(qKey, ctx.prev);
    },
    onSuccess: (data) => {
      const n = data?.data?.deletedCount ?? selectedIds.length;
      toast.success(`Deleted ${n} employee${n === 1 ? "" : "s"}.`);
      setSelectedIds([]);
      qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const columns = useMemo(
    () => [
      {
        key: "name",
        header: "Employee",
        cell: (e) => (
          <div className="flex items-center gap-3 min-w-[260px]">
            <Avatar
              src={e.avatar?.url || ""}
              name={`${e.firstName} ${e.lastName}`}
            />
            <div className="min-w-0">
              <div className="font-bold text-slate-900 truncate">
                {e.firstName} {e.lastName}
              </div>
              <div className="text-xs text-slate-600 font-mono truncate">
                {e.employeeCode} • {e.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: "dept",
        header: "Department",
        cell: (e) => (
          <div className="font-semibold text-slate-800">
            {e.department || "—"}
          </div>
        ),
      },
      {
        key: "role",
        header: "Role",
        cell: (e) => <Badge tone="indigo">{e.role}</Badge>,
      },
      {
        key: "status",
        header: "Status",
        cell: (e) => (
          <Badge
            tone={
              e.status === "ACTIVE"
                ? "green"
                : e.status === "EXITED"
                  ? "red"
                  : "slate"
            }
          >
            {e.status}
          </Badge>
        ),
      },
      {
        key: "salary",
        header: "Salary",
        cellClassName: "font-mono text-slate-800",
        cell: (e) =>
          e.salary?.annual
            ? `${e.salary.currency} ${Number(e.salary.annual).toLocaleString()}`
            : "—",
      },
    ],
    []
  );

  const empty = (
    <EmptyState
      title="Your employee directory is empty"
      description="Create your first employee record. Add department, role, salary structure, and an avatar for a polished org view."
      illustration="people"
      action={
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Add employee
        </Button>
      }
    />
  );

  return (
    <PageWrapper>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-extrabold tracking-tight">Employees</div>
          <div className="mt-1 text-sm text-slate-600">
            Advanced filters, bulk actions, and clean profiles.
          </div>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Add employee
        </Button>
      </div>

      <div className="mt-6 card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            label="Search"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
          <Input
            label="Department"
            value={department}
            onChange={(e) => {
              setPage(1);
              setDepartment(e.target.value);
            }}
          />
          <div className="relative">
            <select
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
              className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 pb-3 pt-5 text-sm font-semibold text-slate-900 hover:border-slate-300"
            >
              <option value="">All statuses</option>
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
            <select
              value={role}
              onChange={(e) => {
                setPage(1);
                setRole(e.target.value);
              }}
              className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 pb-3 pt-5 text-sm font-semibold text-slate-900 hover:border-slate-300"
            >
              <option value="">All roles</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="ADMIN">ADMIN</option>
              <option value="HR">HR</option>
              <option value="EMPLOYEE">EMPLOYEE</option>
            </select>
            <div className="pointer-events-none absolute left-4 top-2 text-xs font-semibold text-slate-500">
              Role
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">
              {pagination?.total ?? 0}
            </span>{" "}
            employees
            {selectedIds.length ? (
              <>
                {" "}
                •{" "}
                <span className="font-semibold text-slate-900">
                  {selectedIds.length}
                </span>{" "}
                selected
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.length ? (
              <Button
                variant="destructive"
                size="sm"
                disabled={bulkDeleteM.isPending}
                onClick={() => bulkDeleteM.mutate(selectedIds)}
              >
                <Trash2 className="h-4 w-4" />
                Delete selected
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          rows={rows}
          getRowId={(e) => String(e._id)}
          selectedIds={selectedIds}
          onToggleAll={(next) =>
            setSelectedIds(next ? rows.map((e) => String(e._id)) : [])
          }
          onToggleRow={(id, next) =>
            setSelectedIds((prev) => {
              const set = new Set(prev);
              if (next) set.add(String(id));
              else set.delete(String(id));
              return Array.from(set);
            })
          }
          empty={empty}
          actions={(e) => (
            <div className="flex items-center gap-2">
              <Link
                className="focus-ring inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                to={`${ROUTES.EMPLOYEES}/${e._id}`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open
              </Link>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  toast.message("Edit from profile page.");
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={deleteM.isPending}
                onClick={() => deleteM.mutate(String(e._id))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        />

        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="subtle"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <div className="text-xs text-slate-600 font-mono">
            page {pagination?.page ?? page} / {pagination?.pages ?? 1}
          </div>
          <Button
            variant="subtle"
            size="sm"
            disabled={!pagination || page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <CreateEmployeeModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(payload) => createM.mutate(payload)}
        busy={createM.isPending}
      />
    </PageWrapper>
  );
}

function CreateEmployeeModal({ open, onClose, onCreate, busy }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeCreateSchema),
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

  const name = `${watch("firstName") || ""} ${watch("lastName") || ""}`.trim();
  const avatar = watch("__avatar") || null;

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose?.();
      }}
      title="Add employee"
      description="Create a clean employee record with department, role, and compensation."
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              reset();
              onClose?.();
            }}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button
            disabled={busy}
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
                joinDate: v.joinDate ? new Date(v.joinDate).toISOString() : undefined,
                salary: { currency: v.salaryCurrency, annual: v.salaryAnnual },
                avatar: avatar || undefined,
              };
              onCreate?.(payload);
            })}
          >
            {busy ? "Creating..." : "Create"}
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
          <Input
            label="Employee code"
            mono
            error={errors.employeeCode?.message}
            {...register("employeeCode")}
          />
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="First name"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            label="Last name"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
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
          <Input
            label="Annual salary"
            mono
            inputMode="numeric"
            {...register("salaryAnnual", { valueAsNumber: true })}
          />
          <Input
            label="Currency"
            mono
            {...register("salaryCurrency")}
          />
        </div>
      </div>
    </Modal>
  );
}

