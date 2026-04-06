import mongoose from "mongoose";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Payroll } from "../models/Payroll.js";
import { Employee } from "../models/Employee.js";
import { calculatePayroll } from "../services/payrollCalculator.js";
import { generatePayslipPdfBuffer } from "../utils/pdfGenerator.js";
import { writeAudit } from "../services/auditService.js";
import { sendEmail } from "../services/emailService.js";
import { getAppName } from "../config/env.js";

function isPrivileged(req) {
  return ["SUPER_ADMIN", "ADMIN", "HR"].includes(req.user.role);
}

export const runPayroll = asyncWrapper(async (req, res) => {
  if (!isPrivileged(req)) throw new ApiError(403, "Forbidden");
  const { year, month, employeeIds, preview } = req.body;

  const employees = await Employee.find({ _id: { $in: employeeIds.map((x) => new mongoose.Types.ObjectId(x)) } });
  if (!employees.length) throw new ApiError(400, "No employees found");

  const results = [];
  for (const emp of employees) {
    const annual = Number(emp.salary?.annual || 0);
    const currency = emp.salary?.currency || "USD";
    const monthlyBase = Math.round(annual / 12);
    const structure = {
      base: monthlyBase,
      hra: Math.round(monthlyBase * 0.2),
      allowances: Math.round(monthlyBase * 0.1),
      deductions: Math.round(monthlyBase * 0.05),
      currency,
    };
    const calc = calculatePayroll(structure);
    results.push({
      employeeId: String(emp._id),
      employeeCode: emp.employeeCode,
      name: `${emp.firstName} ${emp.lastName}`,
      email: emp.email,
      periodYear: year,
      periodMonth: month,
      ...calc,
    });
  }

  if (preview) {
    return res.status(200).json(
      new ApiResponse({
        message: "Payroll preview generated.",
        data: { preview: results },
      })
    );
  }

  const upserts = [];
  for (const r of results) {
    const doc = await Payroll.findOneAndUpdate(
      { employeeId: r.employeeId, periodYear: year, periodMonth: month },
      {
        $set: {
          structure: r.structure,
          gross: r.gross,
          net: r.net,
          status: "FINALIZED",
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    upserts.push(doc);
  }

  await writeAudit({
    req,
    action: "CREATE",
    entityType: "PayrollRun",
    entityId: `${year}-${String(month).padStart(2, "0")}`,
    before: null,
    after: { employees: employeeIds, count: upserts.length },
  });

  res.status(200).json(
    new ApiResponse({
      message: "Payroll run completed.",
      data: { payroll: upserts },
    })
  );
});

export const history = asyncWrapper(async (req, res) => {
  if (!isPrivileged(req)) throw new ApiError(403, "Forbidden");
  const { page, limit, year, month, employeeId } = req.query;
  const filter = {};
  if (year) filter.periodYear = year;
  if (month) filter.periodMonth = month;
  if (employeeId) filter.employeeId = employeeId;

  const skip = (page - 1) * limit;
  const [rows, total] = await Promise.all([
    Payroll.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Payroll.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse({
      message: "Payroll history fetched.",
      data: { rows },
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  );
});

export const payslipPdf = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const payroll = await Payroll.findById(id);
  if (!payroll) throw new ApiError(404, "Payslip not found");

  const isSelf =
    req.user.employeeId && String(req.user.employeeId) === String(payroll.employeeId);
  if (!isSelf && !isPrivileged(req)) throw new ApiError(403, "Forbidden");

  const employee = await Employee.findById(payroll.employeeId);
  if (!employee) throw new ApiError(404, "Employee not found");

  const buf = await generatePayslipPdfBuffer({
    appName: getAppName(),
    employee,
    payroll,
  });

  res.setHeader("content-type", "application/pdf");
  res.setHeader(
    "content-disposition",
    `inline; filename="payslip_${employee.employeeCode}_${payroll.periodYear}-${String(payroll.periodMonth).padStart(2, "0")}.pdf"`
  );
  res.status(200).send(buf);
});

export const emailPayslip = asyncWrapper(async (req, res) => {
  if (!isPrivileged(req)) throw new ApiError(403, "Forbidden");
  const { id } = req.params;
  const payroll = await Payroll.findById(id);
  if (!payroll) throw new ApiError(404, "Payslip not found");
  const employee = await Employee.findById(payroll.employeeId);
  if (!employee) throw new ApiError(404, "Employee not found");

  const buf = await generatePayslipPdfBuffer({
    appName: getAppName(),
    employee,
    payroll,
  });

  await sendEmail({
    to: employee.email,
    subject: `Payslip ${payroll.periodYear}-${String(payroll.periodMonth).padStart(2, "0")}`,
    text: "Your payslip is attached.",
    html: "<p>Your payslip is attached.</p>",
  });

  payroll.emailedAt = new Date();
  payroll.status = "EMAILED";
  await payroll.save();

  await writeAudit({
    req,
    action: "UPDATE",
    entityType: "Payroll",
    entityId: String(payroll._id),
    before: null,
    after: { emailedAt: payroll.emailedAt },
  });

  res.status(200).json(new ApiResponse({ message: "Payslip emailed.", data: {} }));
});

