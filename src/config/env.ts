import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 5000,

  NODE_ENV: process.env.NODE_ENV || "development",

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

  BACKEND_URL: process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL || "",

  KEEP_ALIVE_INTERVAL_MS: Number(process.env.KEEP_ALIVE_INTERVAL_MS) || 10 * 60 * 1000, // 10 minutes default

  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || "",
};

export const getParsedFrontendUrls = (): string[] => {
  return env.FRONTEND_URL.split(",")
    .map((url) => url.trim().replace(/\/$/, ""))
    .filter(Boolean);
};

