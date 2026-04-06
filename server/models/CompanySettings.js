import mongoose from "mongoose";

const companySettingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "Dayflow Company", trim: true, maxlength: 140 },
    domain: { type: String, default: "", trim: true, maxlength: 140 },
    address: { type: String, default: "", trim: true, maxlength: 500 },
    departments: { type: [String], default: [] },
    emailTemplates: {
      payslip: { type: String, default: "<p>Your payslip is attached.</p>" },
    },
    leavePolicy: {
      SICK: { type: Number, default: 10 },
      CASUAL: { type: Number, default: 10 },
      PAID: { type: Number, default: 15 },
    },
  },
  { timestamps: true }
);

export const CompanySettings = mongoose.model("CompanySettings", companySettingsSchema);

