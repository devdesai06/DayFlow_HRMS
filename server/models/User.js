import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ROLE_LIST, ROLES } from "../constants/roles.js";

const refreshTokenSchema = new mongoose.Schema(
  {
    tokenId: { type: String, required: true },
    tokenHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    revokedAt: { type: Date, default: null },
    userAgent: { type: String, default: "" },
    ip: { type: String, default: "" },
  },
  { _id: false }
);

const passwordResetSchema = new mongoose.Schema(
  {
    otpHash: { type: String, default: null },
    expiresAt: { type: Date, default: null },
    attempts: { type: Number, default: 0 },
    lastSentAt: { type: Date, default: null },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLE_LIST, default: ROLES.EMPLOYEE },
    isEmailVerified: { type: Boolean, default: false },
    emailVerifyTokenHash: { type: String, default: null, select: false },
    emailVerifyExpiresAt: { type: Date, default: null, select: false },
    refreshTokens: { type: [refreshTokenSchema], default: [], select: false },
    passwordReset: { type: passwordResetSchema, default: () => ({}) },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.methods.verifyPassword = async function verifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = async function hashPassword(password) {
  const rounds = 12;
  return bcrypt.hash(password, rounds);
};

export const User = mongoose.model("User", userSchema);

