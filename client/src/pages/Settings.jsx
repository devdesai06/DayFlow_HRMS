import { PageWrapper } from "../components/layout/PageWrapper.jsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Input.jsx";
import { DataTable } from "../components/ui/DataTable.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Modal } from "../components/ui/Modal.jsx";
import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";

export function SettingsPage() {
  const qc = useQueryClient();
  const [deptOpen, setDeptOpen] = useState(false);
  const [deptName, setDeptName] = useState("");
  const [form, setForm] = useState({ companyName: "", domain: "", address: "" });

  const settingsQ = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await api.get("/api/settings");
      return res.data;
    },
  });

  const settings = settingsQ.data?.data?.settings || null;

  useEffect(() => {
    if (settings) {
      setForm({
        companyName: settings.companyName || "",
        domain: settings.domain || "",
        address: settings.address || "",
      });
    }
  }, [settings]);

  const updateCompanyM = useMutation({
    mutationFn: async (payload) => {
      const res = await api.patch("/api/settings/company", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Company updated.");
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  const addDeptM = useMutation({
    mutationFn: async (name) => {
      const res = await api.post("/api/settings/departments", { name });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Department added.");
      setDeptName("");
      setDeptOpen(false);
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  const removeDeptM = useMutation({
    mutationFn: async (name) => {
      const res = await api.delete(`/api/settings/departments/${encodeURIComponent(name)}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Department removed.");
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  const deptRows = settings?.departments || [];

  return (
    <PageWrapper>
      <div className="text-2xl font-extrabold tracking-tight">Settings</div>
      <div className="mt-1 text-sm text-slate-600">
        Company profile, departments, policies, and templates.
      </div>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="text-sm font-extrabold tracking-tight">Company profile</div>
          <div className="mt-1 text-sm text-slate-600">Used across PDFs and email templates.</div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Company name"
              value={form.companyName}
              onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
            />
            <Input
              label="Domain"
              value={form.domain}
              onChange={(e) => setForm((p) => ({ ...p, domain: e.target.value }))}
            />
            <div className="md:col-span-2">
              <Input
                label="Address"
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              disabled={updateCompanyM.isPending || !settings}
              onClick={() => updateCompanyM.mutate(form)}
            >
              {updateCompanyM.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-extrabold tracking-tight">Departments</div>
              <div className="mt-1 text-sm text-slate-600">Used in employee filters and dashboards.</div>
            </div>
            <Button variant="subtle" size="sm" onClick={() => setDeptOpen(true)}>
              Add
            </Button>
          </div>
          <div className="mt-4">
            {deptRows.length ? (
              <div className="grid gap-2">
                {deptRows.map((d) => (
                  <div
                    key={d}
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50 transition-premium"
                  >
                    <div className="font-semibold text-slate-900">{d}</div>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={removeDeptM.isPending}
                      onClick={() => removeDeptM.mutate(d)}
                      className="opacity-0 group-hover:opacity-100 transition-premium"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No departments"
                description="Add departments to power filters, charts, and org views."
              />
            )}
          </div>
        </div>
      </div>

      <Modal
        open={deptOpen}
        onClose={() => setDeptOpen(false)}
        title="Add department"
        description="Keep it consistent. This value is used across the product."
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeptOpen(false)} disabled={addDeptM.isPending}>
              Cancel
            </Button>
            <Button
              disabled={addDeptM.isPending || deptName.trim().length < 2}
              onClick={() => addDeptM.mutate(deptName.trim())}
            >
              {addDeptM.isPending ? "Adding..." : "Add"}
            </Button>
          </div>
        }
      >
        <Input label="Department name" value={deptName} onChange={(e) => setDeptName(e.target.value)} />
      </Modal>
    </PageWrapper>
  );
}

