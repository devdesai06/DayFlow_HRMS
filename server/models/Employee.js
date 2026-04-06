import mongoose from "mongoose";
import { ROLE_LIST, ROLES } from "../constants/roles.js";

const employeeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    employeeCode: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, default: "", trim: true, maxlength: 32 },

    department: { type: String, default: "", trim: true, maxlength: 120, index: true },
    role: { type: String, enum: ROLE_LIST, default: ROLES.EMPLOYEE, index: true },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "ONBOARDING", "EXITED"],
      default: "ACTIVE",
      index: true,
    },
    joinDate: { type: Date, default: null, index: true },

    avatar: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    salary: {
      currency: { type: String, default: "USD" },
      annual: { type: Number, default: 0, min: 0, index: true },
    },

    address: {
      line1: { type: String, default: "", trim: true, maxlength: 160 },
      line2: { type: String, default: "", trim: true, maxlength: 160 },
      city: { type: String, default: "", trim: true, maxlength: 80 },
      state: { type: String, default: "", trim: true, maxlength: 80 },
      postalCode: { type: String, default: "", trim: true, maxlength: 20 },
      country: { type: String, default: "", trim: true, maxlength: 80 },
    },

    emergencyContact: {
      name: { type: String, default: "", trim: true, maxlength: 120 },
      relation: { type: String, default: "", trim: true, maxlength: 80 },
      phone: { type: String, default: "", trim: true, maxlength: 32 },
    },
  },
  { timestamps: true }
);

employeeSchema.index({ firstName: "text", lastName: "text", email: "text", employeeCode: "text" });

export const Employee = mongoose.model("Employee", employeeSchema);

