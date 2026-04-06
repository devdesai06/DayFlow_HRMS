export function calculatePayroll(structure) {
  const base = Number(structure?.base || 0);
  const hra = Number(structure?.hra || 0);
  const allowances = Number(structure?.allowances || 0);
  const deductions = Number(structure?.deductions || 0);

  const gross = Math.max(0, base + hra + allowances);
  const net = Math.max(0, gross - deductions);

  return {
    gross,
    net,
    structure: {
      base,
      hra,
      allowances,
      deductions,
      currency: structure?.currency || "USD",
    },
  };
}

