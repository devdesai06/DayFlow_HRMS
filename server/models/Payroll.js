import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true, index: true },
    periodYear: { type: Number, required: true, index: true },
    periodMonth: { type: Number, required: true, min: 1, max: 12, index: true },

    structure: {
      base: { type: Number, default: 0, min: 0 },
      hra: { type: Number, default: 0, min: 0 },
      allowances: { type: Number, default: 0, min: 0 },
      deductions: { type: Number, default: 0, min: 0 },
      currency: { type: String, default: "USD" },
    },

    gross: { type: Number, default: 0, min: 0 },
    net: { type: Number, default: 0, min: 0 },

    status: { type: String, enum: ["DRAFT", "FINALIZED", "EMAILED"], default: "FINALIZED", index: true },
    pdf: {
      url: { type: String, default: "" },
      generatedAt: { type: Date, default: null },
    },
    emailedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

payrollSchema.index({ employeeId: 1, periodYear: 1, periodMonth: 1 }, { unique: true });

export const Payroll = mongoose.model("Payroll", payrollSchema);

