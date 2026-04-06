import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is required`);
  return v;
}

export function signAccessToken({ userId, role }) {
  const secret = requireEnv("JWT_SECRET");
  const expiresIn = process.env.JWT_EXPIRE || "15m";
  return jwt.sign({ sub: userId, role, typ: "access" }, secret, { expiresIn });
}

export function signRefreshToken({ userId, tokenId }) {
  const secret = requireEnv("JWT_REFRESH_SECRET");
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRE || "7d";
  return jwt.sign(
    { sub: userId, tid: tokenId, typ: "refresh" },
    secret,
    { expiresIn }
  );
}

export function verifyAccessToken(token) {
  try {
    const secret = requireEnv("JWT_SECRET");
    const payload = jwt.verify(token, secret);
    if (payload?.typ !== "access") throw new ApiError(401, "Invalid token");
    return payload;
  } catch {
    throw new ApiError(401, "Unauthorized");
  }
}

export function verifyRefreshToken(token) {
  try {
    const secret = requireEnv("JWT_REFRESH_SECRET");
    const payload = jwt.verify(token, secret);
    if (payload?.typ !== "refresh") throw new ApiError(401, "Invalid token");
    return payload;
  } catch {
    throw new ApiError(401, "Unauthorized");
  }
}

