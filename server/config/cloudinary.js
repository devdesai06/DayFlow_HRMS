import crypto from "crypto";
import { ApiError } from "../utils/ApiError.js";
import { getCloudinaryCredentials } from "./env.js";

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new ApiError(500, `${name} is required`);
  return v;
}

export function cloudinaryConfig() {
  const credentials = getCloudinaryCredentials();

  return {
    cloudName:
      credentials.cloudName || requireEnv("CLOUDINARY_CLOUD_NAME or CLOUDINARY_URL"),
    apiKey: credentials.apiKey || requireEnv("CLOUDINARY_API_KEY or CLOUDINARY_URL"),
    apiSecret:
      credentials.apiSecret || requireEnv("CLOUDINARY_API_SECRET or CLOUDINARY_URL"),
    folder: process.env.CLOUDINARY_FOLDER || "dayflow/avatars",
  };
}

export function signCloudinaryUpload({ publicId, timestamp, folder }) {
  const { apiSecret } = cloudinaryConfig();
  const paramsToSign = [`folder=${folder}`, `public_id=${publicId}`, `timestamp=${timestamp}`]
    .sort()
    .join("&");
  return crypto.createHash("sha1").update(paramsToSign + apiSecret).digest("hex");
}

