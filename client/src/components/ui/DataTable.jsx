import { cn } from "../../utils/cn.js";
import { Checkbox } from "./Checkbox.jsx";

export function DataTable({
  columns,
  rows,
  getRowId,
  selectedIds,
  onToggleRow,
  onToggleAll,
  actions,
  empty,
}) {
  const allIds = rows.map(getRowId);
  const selectedSet = new Set(selectedIds || []);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedSet.has(id));
  const someSelected = allIds.some((id) => selectedSet.has(id)) && !allSelected;

  if (!rows.length) return empty || null;

  return (
    <div className="card overflow-hidden">
      <div className="relative overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-white border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={() => onToggleAll?.(!allSelected)}
                  aria-label="Select all"
                />
              </th>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "px-4 py-3 text-left font-extrabold tracking-tight text-slate-900 whitespace-nowrap",
                    c.className
                  )}
                >
                  {c.header}
                </th>
              ))}
              {actions ? <th className="px-4 py-3 text-right w-24" /> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row) => {
              const id = getRowId(row);
              const selected = selectedSet.has(id);
              return (
                <tr
                  key={id}
                  className={cn(
                    "group transition-premium",
                    "hover:bg-slate-50"
                  )}
                >
                  <td className="px-4 py-3 align-middle">
                    <Checkbox
                      checked={selected}
                      onChange={() => onToggleRow?.(id, !selected)}
                      aria-label="Select row"
                    />
                  </td>
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn("px-4 py-3 align-middle", c.cellClassName)}
                    >
                      {c.cell(row)}
                    </td>
                  ))}
                  {actions ? (
                    <td className="px-4 py-3 align-middle text-right">
                      <div className="opacity-0 translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-premium inline-flex justify-end">
                        {actions(row)}
                      </div>
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

