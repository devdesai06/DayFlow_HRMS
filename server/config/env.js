function firstDefinedEnv(...names) {
  for (const name of names) {
    const value = process.env[name];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

export function getAppName() {
  return firstDefinedEnv("APP_NAME", "VITE_APP_NAME") || "Dayflow";
}

export function getClientUrls() {
  const raw =
    firstDefinedEnv("CLIENT_URLS", "CLIENT_URL") || "http://localhost:5173";

  return [...new Set(raw.split(",").map((value) => value.trim()).filter(Boolean))];
}

export function getPrimaryClientUrl() {
  return getClientUrls()[0] || "http://localhost:5173";
}

export function getMongoUri() {
  return firstDefinedEnv("MONGODB_URI", "MONGO_URI");
}

export function getCloudinaryCredentials() {
  const cloudName = firstDefinedEnv("CLOUDINARY_CLOUD_NAME");
  const apiKey = firstDefinedEnv("CLOUDINARY_API_KEY");
  const apiSecret = firstDefinedEnv("CLOUDINARY_API_SECRET");

  if (cloudName && apiKey && apiSecret) {
    return { cloudName, apiKey, apiSecret };
  }

  const cloudinaryUrl = firstDefinedEnv("CLOUDINARY_URL");
  if (!cloudinaryUrl) {
    return { cloudName, apiKey, apiSecret };
  }

  try {
    const parsed = new URL(cloudinaryUrl);
    return {
      cloudName: decodeURIComponent(parsed.hostname),
      apiKey: decodeURIComponent(parsed.username),
      apiSecret: decodeURIComponent(parsed.password),
    };
  } catch {
    throw new Error(
      "CLOUDINARY_URL is invalid. Expected cloudinary://<api_key>:<api_secret>@<cloud_name>"
    );
  }
}
