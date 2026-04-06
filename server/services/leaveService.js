export function diffDaysInclusive(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startDay = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const endDay = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
  const days = Math.floor((endDay - startDay) / 86400000) + 1;
  return Math.max(1, days);
}

export function defaultAnnualBalance() {
  return {
    SICK: Number(process.env.LEAVE_BAL_SICK || 10),
    CASUAL: Number(process.env.LEAVE_BAL_CASUAL || 10),
    PAID: Number(process.env.LEAVE_BAL_PAID || 15),
    UNPAID: 9999,
  };
}

