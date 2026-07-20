import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 5000,

  NODE_ENV: process.env.NODE_ENV || "development",

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};
