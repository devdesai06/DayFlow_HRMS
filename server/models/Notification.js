import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    message: { type: String, required: true, trim: true, maxlength: 800 },
    type: { type: String, enum: ["INFO", "SUCCESS", "WARNING", "ERROR"], default: "INFO", index: true },
    readAt: { type: Date, default: null, index: true },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);

