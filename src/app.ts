import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import apiRoutes from "./api/routes";

import { env } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

/**
 * Security
 */
app.use(helmet());
app.use(errorHandler);

/**
 * CORS
 */
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

/**
 * Request Parsing
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Compression
 */
app.use(compression());

/**
 * Logging
 */
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

/**
 * Health Check
 */

app.use("/api/v1", apiRoutes);
/**
 * 404 Handler
 */
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/**
 * Global Error Handler
 */
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);

    res.status(500).json({
      success: false,
      message:
        env.NODE_ENV === "development" ? err.message : "Internal Server Error",
    });
  },
);

export default app;
