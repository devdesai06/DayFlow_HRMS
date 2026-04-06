import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true, index: true },
    type: {
      type: String,
      enum: ["SICK", "CASUAL", "PAID", "UNPAID"],
      required: true,
      index: true,
    },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    days: { type: Number, required: true, min: 0.5 },
    reason: { type: String, default: "", trim: true, maxlength: 800 },
    attachmentUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
    decidedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    decidedAt: { type: Date, default: null },
    decisionNote: { type: String, default: "", trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

leaveSchema.index({ employeeId: 1, startDate: 1, endDate: 1 });

export const Leave = mongoose.model("Leave", leaveSchema);

