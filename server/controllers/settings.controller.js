import { asyncWrapper } from "../utils/asyncWrapper.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { CompanySettings } from "../models/CompanySettings.js";
import { writeAudit } from "../services/auditService.js";

async function getSingleton() {
  let doc = await CompanySettings.findOne({});
  if (!doc) doc = await CompanySettings.create({});
  return doc;
}

export const getSettings = asyncWrapper(async (req, res) => {
  const doc = await getSingleton();
  res.status(200).json(new ApiResponse({ message: "Settings fetched.", data: { settings: doc } }));
});

export const updateCompany = asyncWrapper(async (req, res) => {
  const before = await getSingleton();
  const updated = await CompanySettings.findByIdAndUpdate(before._id, { $set: req.body }, { new: true });

  await writeAudit({
    req,
    action: "UPDATE",
    entityType: "CompanySettings",
    entityId: String(updated._id),
    before: before.toObject(),
    after: updated.toObject(),
  });

  res.status(200).json(new ApiResponse({ message: "Company updated.", data: { settings: updated } }));
});

export const addDepartment = asyncWrapper(async (req, res) => {
  const doc = await getSingleton();
  const name = req.body.name;
  if (doc.departments.includes(name)) throw new ApiError(409, "Department already exists");
  doc.departments.push(name);
  await doc.save();

  await writeAudit({
    req,
    action: "UPDATE",
    entityType: "CompanySettings",
    entityId: String(doc._id),
    before: null,
    after: { departments: doc.departments },
  });

  res.status(200).json(new ApiResponse({ message: "Department added.", data: { departments: doc.departments } }));
});

export const removeDepartment = asyncWrapper(async (req, res) => {
  const doc = await getSingleton();
  const name = req.params.name;
  doc.departments = doc.departments.filter((d) => d !== name);
  await doc.save();

  await writeAudit({
    req,
    action: "UPDATE",
    entityType: "CompanySettings",
    entityId: String(doc._id),
    before: null,
    after: { departments: doc.departments },
  });

  res.status(200).json(new ApiResponse({ message: "Department removed.", data: { departments: doc.departments } }));
});

export const updateLeavePolicy = asyncWrapper(async (req, res) => {
  const doc = await getSingleton();
  doc.leavePolicy = req.body;
  await doc.save();

  await writeAudit({
    req,
    action: "UPDATE",
    entityType: "CompanySettings",
    entityId: String(doc._id),
    before: null,
    after: { leavePolicy: doc.leavePolicy },
  });

  res.status(200).json(new ApiResponse({ message: "Leave policy updated.", data: { leavePolicy: doc.leavePolicy } }));
});

export const updateEmailTemplates = asyncWrapper(async (req, res) => {
  const doc = await getSingleton();
  doc.emailTemplates = { ...doc.emailTemplates, payslip: req.body.payslipHtml };
  await doc.save();

  await writeAudit({
    req,
    action: "UPDATE",
    entityType: "CompanySettings",
    entityId: String(doc._id),
    before: null,
    after: { emailTemplates: { payslip: doc.emailTemplates.payslip } },
  });

  res.status(200).json(new ApiResponse({ message: "Email templates updated.", data: { emailTemplates: doc.emailTemplates } }));
});

