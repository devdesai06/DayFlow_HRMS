import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI or MONGO_URI is required (MongoDB Atlas/Cloud)");
  }
  mongoose.set("strictQuery", true);
  const autoIndex = process.env.NODE_ENV !== "production";
  const maxAttempts = Number(process.env.DB_CONNECT_ATTEMPTS || 10);
  const delayMs = Number(process.env.DB_CONNECT_DELAY_MS || 800);
  const serverSelectionTimeoutMS = Number(
    process.env.DB_SERVER_SELECTION_TIMEOUT_MS || 8000
  );

  let lastErr = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      // eslint-disable-next-line no-console
      console.log(`[db] Connecting to MongoDB (attempt ${attempt}/${maxAttempts})...`);
      await mongoose.connect(uri, {
        autoIndex,
        serverSelectionTimeoutMS,
      });
      // eslint-disable-next-line no-console
      console.log("[db] Connected");
      return;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr || new Error("Failed to connect to MongoDB");
}

