import http from "http";
import https from "https";
import { env } from "../config/env";
import { logger } from "../shared/logger/logger";

let pingInterval: NodeJS.Timeout | null = null;

export const startSelfPing = () => {
  const targetUrl = env.BACKEND_URL;

  if (!targetUrl) {
    logger.info("Self-ping keep-alive service disabled (BACKEND_URL / RENDER_EXTERNAL_URL not set).");
    return;
  }

  const healthEndpoint = targetUrl.replace(/\/$/, "") + "/health";
  logger.info({ healthEndpoint, intervalMs: env.KEEP_ALIVE_INTERVAL_MS }, "Starting self-ping keep-alive service...");

  const doPing = () => {
    try {
      const client = healthEndpoint.startsWith("https") ? https : http;
      client
        .get(healthEndpoint, (res) => {
          logger.debug({ statusCode: res.statusCode }, "Self-ping keep-alive response received");
        })
        .on("error", (err) => {
          logger.warn({ error: err.message }, "Self-ping keep-alive ping failed");
        });
    } catch (err: any) {
      logger.warn({ error: err.message }, "Self-ping execution error");
    }
  };

  // Run initial ping after 1 minute, then repeat on schedule
  setTimeout(doPing, 60 * 1000);
  pingInterval = setInterval(doPing, env.KEEP_ALIVE_INTERVAL_MS);
};

export const stopSelfPing = () => {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
};
