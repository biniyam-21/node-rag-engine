import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import { env } from "./config/env";
import apiRoutes from "./api/routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(helmet());

const allowedOrigins = [
  env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === "development") {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

app.use("/api/v1", apiRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;
