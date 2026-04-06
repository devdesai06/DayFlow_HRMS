import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true, index: true },
    dateKey: { type: String, required: true, index: true }, // YYYY-MM-DD (UTC)

    checkInAt: { type: Date, default: null },
    checkOutAt: { type: Date, default: null },

    totalMinutes: { type: Number, default: 0, min: 0 },
    flags: {
      late: { type: Boolean, default: false },
      earlyLeave: { type: Boolean, default: false },
      overtime: { type: Boolean, default: false },
    },
    notes: { type: String, default: "", trim: true, maxlength: 500 },

    editedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    editedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

attendanceSchema.index({ employeeId: 1, dateKey: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);

