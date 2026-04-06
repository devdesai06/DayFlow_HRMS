import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

export function loadEnv() {
  const mode = process.env.NODE_ENV || "development";
  const cwd = process.cwd();
  const candidates = [
    ".env",
    `.env.${mode}`,
    ".env.local",
    `.env.${mode}.local`,
  ];

  const loadedFiles = [];

  for (const candidate of candidates) {
    const envPath = path.resolve(cwd, candidate);
    if (!fs.existsSync(envPath)) continue;

    dotenv.config({ path: envPath, override: true });
    loadedFiles.push(candidate);
  }

  return { mode, loadedFiles };
}
