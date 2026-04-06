import mongoose from "mongoose";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Employee } from "../models/Employee.js";
import { writeAudit } from "../services/auditService.js";

function normalizeSort(sortBy, sortDir) {
  const dir = sortDir === "asc" ? 1 : -1;
  return { [sortBy]: dir, _id: dir };
}

export const listEmployees = asyncWrapper(async (req, res) => {
  const {
    page,
    limit,
    search,
    department,
    role,
    status,
    salaryMin,
    salaryMax,
    joinFrom,
    joinTo,
    sortBy,
    sortDir,
  } = req.query;

  const filter = {};
  if (department) filter.department = department;
  if (role) filter.role = role;
  if (status) filter.status = status;

  if (typeof salaryMin === "number" || typeof salaryMax === "number") {
    filter["salary.annual"] = {};
    if (typeof salaryMin === "number") filter["salary.annual"].$gte = salaryMin;
    if (typeof salaryMax === "number") filter["salary.annual"].$lte = salaryMax;
  }

  if (joinFrom || joinTo) {
    filter.joinDate = {};
    if (joinFrom) filter.joinDate.$gte = joinFrom;
    if (joinTo) filter.joinDate.$lte = joinTo;
  }

  if (search) {
    filter.$or = [
      { employeeCode: new RegExp(escapeRegExp(search), "i") },
      { firstName: new RegExp(escapeRegExp(search), "i") },
      { lastName: new RegExp(escapeRegExp(search), "i") },
      { email: new RegExp(escapeRegExp(search), "i") },
    ];
  }

  const skip = (page - 1) * limit;
  const sort = normalizeSort(sortBy, sortDir);

  const [rows, total] = await Promise.all([
    Employee.find(filter).sort(sort).skip(skip).limit(limit),
    Employee.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse({
      message: "Employees fetched.",
      data: { employees: rows },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  );
});

export const getEmployee = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const employee = await Employee.findById(id);
  if (!employee) throw new ApiError(404, "Employee not found");
  res
    .status(200)
    .json(new ApiResponse({ message: "Employee fetched.", data: { employee } }));
});

export const createEmployee = asyncWrapper(async (req, res) => {
  const { employeeCode, email } = req.body;

  const exists = await Employee.findOne({
    $or: [{ employeeCode }, { email }],
  }).select("_id");
  if (exists) {
    throw new ApiError(409, "Employee already exists", [
      { field: "employeeCode", message: "Employee code or email already exists" },
    ]);
  }

  const employee = await Employee.create(req.body);
  await writeAudit({
    req,
    action: "CREATE",
    entityType: "Employee",
    entityId: String(employee._id),
    before: null,
    after: employee.toObject(),
  });
  res
    .status(201)
    .json(new ApiResponse({ message: "Employee created.", data: { employee } }));
});

export const updateEmployee = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const before = await Employee.findById(id);
  if (!before) throw new ApiError(404, "Employee not found");

  if (req.body.employeeCode || req.body.email) {
    const conflict = await Employee.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(id) },
      $or: [
        req.body.employeeCode ? { employeeCode: req.body.employeeCode } : null,
        req.body.email ? { email: req.body.email } : null,
      ].filter(Boolean),
    }).select("_id");
    if (conflict) throw new ApiError(409, "Employee code/email already in use");
  }

  const employee = await Employee.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res
    .status(200)
    .json(new ApiResponse({ message: "Employee updated.", data: { employee } }));

  await writeAudit({
    req,
    action: "UPDATE",
    entityType: "Employee",
    entityId: String(employee._id),
    before: before.toObject(),
    after: employee.toObject(),
  });
});

export const deleteEmployee = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const employee = await Employee.findByIdAndDelete(id);
  if (!employee) throw new ApiError(404, "Employee not found");
  await writeAudit({
    req,
    action: "DELETE",
    entityType: "Employee",
    entityId: String(employee._id),
    before: employee.toObject(),
    after: null,
  });
  res.status(200).json(new ApiResponse({ message: "Employee deleted.", data: {} }));
});

export const bulkDeleteEmployees = asyncWrapper(async (req, res) => {
  const { ids } = req.body;
  const objectIds = ids.map((x) => new mongoose.Types.ObjectId(x));
  const employees = await Employee.find({ _id: { $in: objectIds } });
  const result = await Employee.deleteMany({ _id: { $in: objectIds } });
  res.status(200).json(
    new ApiResponse({
      message: "Employees deleted.",
      data: { deletedCount: result.deletedCount || 0 },
    })
  );

  await writeAudit({
    req,
    action: "BULK_DELETE",
    entityType: "Employee",
    entityId: ids.join(","),
    before: employees.map((e) => e.toObject()),
    after: null,
  });
});

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

