import crypto from "crypto";

export function sha256(input) {
  return crypto.createHash("sha256").update(String(input)).digest("hex");
}

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function randomOtp() {
  const n = crypto.randomInt(0, 1_000_000);
  return String(n).padStart(6, "0");
}

