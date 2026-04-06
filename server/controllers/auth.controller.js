import { nanoid } from "nanoid";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.js";
import { randomOtp, randomToken, sha256 } from "../utils/crypto.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import {
  otpEmailTemplate,
  sendEmail,
  verificationEmailTemplate,
} from "../services/emailService.js";
import { getAppName, getPrimaryClientUrl } from "../config/env.js";

function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    path: "/",
  };
}

function setRefreshCookie(res, token) {
  const opts = cookieOptions();
  const days = parseExpiryDays(process.env.REFRESH_TOKEN_EXPIRE || "7d");
  res.cookie("dayflow_rt", token, { ...opts, maxAge: days * 24 * 60 * 60 * 1000 });
}

function clearRefreshCookie(res) {
  res.clearCookie("dayflow_rt", cookieOptions());
}

function parseExpiryDays(s) {
  const str = String(s).trim();
  if (/^\d+d$/.test(str)) return Number(str.replace("d", ""));
  if (/^\d+$/.test(str)) return Math.max(1, Math.floor(Number(str) / 86400));
  return 7;
}

function appName() {
  return getAppName();
}

function buildClientUrl(path) {
  const base = getPrimaryClientUrl();
  return new URL(path, base).toString();
}

async function issueTokens({ user, res, meta }) {
  const tokenId = nanoid(24);
  const refreshToken = signRefreshToken({ userId: String(user._id), tokenId });
  const refreshHash = sha256(refreshToken);

  await User.updateOne(
    { _id: user._id },
    {
      $push: {
        refreshTokens: {
          tokenId,
          tokenHash: refreshHash,
          userAgent: meta.userAgent,
          ip: meta.ip,
          createdAt: new Date(),
        },
      },
    }
  );

  const accessToken = signAccessToken({
    userId: String(user._id),
    role: user.role,
  });

  setRefreshCookie(res, refreshToken);
  return { accessToken };
}

export const register = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email }).select("_id");
  if (existing) {
    throw new ApiError(409, "Email already in use", [
      { field: "email", message: "Email already in use" },
    ]);
  }

  const passwordHash = await User.hashPassword(password);

  const token = randomToken(32);
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  const user = await User.create({
    email,
    passwordHash,
    isEmailVerified: false,
    emailVerifyTokenHash: tokenHash,
    emailVerifyExpiresAt: expiresAt,
  });

  const verifyUrl = buildClientUrl(`/verify-email?token=${encodeURIComponent(token)}`);
  const tpl = verificationEmailTemplate({ appName: appName(), verifyUrl });
  await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text });

  res.status(201).json(
    new ApiResponse({
      message: "Account created. Please verify your email.",
      data: {
        user: { id: String(user._id), email: user.email, role: user.role, isEmailVerified: false },
      },
    })
  );
});

export const verifyEmail = asyncWrapper(async (req, res) => {
  const { token } = req.body;
  const tokenHash = sha256(token);

  const user = await User.findOne({
    emailVerifyTokenHash: tokenHash,
    emailVerifyExpiresAt: { $gt: new Date() },
  }).select("_id email role isEmailVerified");

  if (!user) throw new ApiError(400, "Invalid or expired token");
  if (user.isEmailVerified) {
    return res.status(200).json(
      new ApiResponse({
        message: "Email already verified.",
        data: { user: { id: String(user._id), email: user.email, role: user.role, isEmailVerified: true } },
      })
    );
  }

  await User.updateOne(
    { _id: user._id },
    {
      $set: { isEmailVerified: true },
      $unset: { emailVerifyTokenHash: "", emailVerifyExpiresAt: "" },
    }
  );

  res.status(200).json(
    new ApiResponse({
      message: "Email verified successfully.",
      data: { user: { id: String(user._id), email: user.email, role: user.role, isEmailVerified: true } },
    })
  );
});

export const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select(
    "_id email role isEmailVerified passwordHash"
  );
  if (!user) throw new ApiError(401, "Invalid credentials");

  const ok = await user.verifyPassword(password);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });

  const { accessToken } = await issueTokens({
    user,
    res,
    meta: { userAgent: req.get("user-agent") || "", ip: req.ip || "" },
  });

  res.status(200).json(
    new ApiResponse({
      message: "Logged in successfully.",
      data: {
        accessToken,
        user: {
          id: String(user._id),
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
    })
  );
});

export const refresh = asyncWrapper(async (req, res) => {
  const refreshToken = req.cookies?.dayflow_rt;
  if (!refreshToken) throw new ApiError(401, "Unauthorized");

  const payload = verifyRefreshToken(refreshToken);
  const userId = String(payload.sub);
  const tokenId = String(payload.tid || "");
  if (!tokenId) throw new ApiError(401, "Unauthorized");

  const refreshHash = sha256(refreshToken);

  const user = await User.findById(userId).select(
    "_id email role isEmailVerified refreshTokens"
  );
  if (!user) throw new ApiError(401, "Unauthorized");

  const idx = user.refreshTokens.findIndex(
    (t) => t.tokenId === tokenId && t.tokenHash === refreshHash && !t.revokedAt
  );
  if (idx === -1) throw new ApiError(401, "Unauthorized");

  user.refreshTokens[idx].revokedAt = new Date();
  await user.save({ validateBeforeSave: false });

  const { accessToken } = await issueTokens({
    user,
    res,
    meta: { userAgent: req.get("user-agent") || "", ip: req.ip || "" },
  });

  res.status(200).json(
    new ApiResponse({
      message: "Token refreshed.",
      data: {
        accessToken,
        user: {
          id: String(user._id),
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
    })
  );
});

export const logout = asyncWrapper(async (req, res) => {
  const refreshToken = req.cookies?.dayflow_rt;
  if (refreshToken) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const refreshHash = sha256(refreshToken);
      await User.updateOne(
        { _id: payload.sub, "refreshTokens.tokenId": payload.tid, "refreshTokens.tokenHash": refreshHash },
        { $set: { "refreshTokens.$.revokedAt": new Date() } }
      );
    } catch {
      // ignore
    }
  }
  clearRefreshCookie(res);
  res.status(200).json(new ApiResponse({ message: "Logged out.", data: {} }));
});

export const forgotPassword = asyncWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select("_id email passwordReset");

  if (!user) {
    return res.status(200).json(
      new ApiResponse({
        message: "If that email exists, an OTP has been sent.",
        data: {},
      })
    );
  }

  const now = new Date();
  const lastSentAt = user.passwordReset?.lastSentAt || null;
  if (lastSentAt && now.getTime() - new Date(lastSentAt).getTime() < 60_000) {
    throw new ApiError(429, "Please wait before requesting another code.");
  }

  const otp = randomOtp();
  const otpHash = sha256(otp);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        "passwordReset.otpHash": otpHash,
        "passwordReset.expiresAt": expiresAt,
        "passwordReset.attempts": 0,
        "passwordReset.lastSentAt": now,
      },
    }
  );

  const tpl = otpEmailTemplate({ appName: appName(), otp });
  await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text });

  res.status(200).json(
    new ApiResponse({
      message: "If that email exists, an OTP has been sent.",
      data: {},
    })
  );
});

export const resetPassword = asyncWrapper(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email }).select("_id passwordReset");
  if (!user) throw new ApiError(400, "Invalid OTP");

  const pr = user.passwordReset || {};
  const expiresAt = pr.expiresAt ? new Date(pr.expiresAt) : null;
  if (!pr.otpHash || !expiresAt || expiresAt <= new Date()) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  const attempts = Number(pr.attempts || 0);
  if (attempts >= 5) throw new ApiError(429, "Too many attempts. Try again later.");

  const otpHash = sha256(otp);
  if (otpHash !== pr.otpHash) {
    await User.updateOne(
      { _id: user._id },
      { $inc: { "passwordReset.attempts": 1 } }
    );
    throw new ApiError(400, "Invalid OTP");
  }

  const passwordHash = await User.hashPassword(newPassword);

  await User.updateOne(
    { _id: user._id },
    {
      $set: { passwordHash },
      $unset: {
        "passwordReset.otpHash": "",
        "passwordReset.expiresAt": "",
        "passwordReset.attempts": "",
        "passwordReset.lastSentAt": "",
      },
      $setOnInsert: {},
    }
  );

  await User.updateOne(
    { _id: user._id },
    { $set: { refreshTokens: [] } }
  );

  clearRefreshCookie(res);
  res.status(200).json(new ApiResponse({ message: "Password reset successfully.", data: {} }));
});

export const me = asyncWrapper(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  res.status(200).json(
    new ApiResponse({
      message: "OK",
      data: { user: req.user },
    })
  );
});

