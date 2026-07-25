import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import { env, getParsedFrontendUrls } from "./config/env";
import apiRoutes from "./api/routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(helmet());

const defaultLocalOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, uptime monitors)
      if (!origin) {
        return callback(null, true);
      }

      const configuredFrontendUrls = getParsedFrontendUrls();
      const allAllowed = [...defaultLocalOrigins, ...configuredFrontendUrls];

      const isAllowed =
        allAllowed.includes(origin) ||
        env.NODE_ENV === "development" ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".netlify.app") ||
        origin.endsWith(".onrender.com");

      if (isAllowed) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

// Lightweight health check endpoint for UptimeRobot / pingers
app.get(["/", "/health"], (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "portfolio-ai-backend",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

app.use("/api/v1", apiRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;
