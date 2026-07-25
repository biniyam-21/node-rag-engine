import "./loadEnv";
import app from "./app";
import { env } from "./config/env";
import { initializeRagPipeline } from "./container/services";
import { logger } from "./shared/logger/logger";
import { startSelfPing } from "./services/keepAlive.service";

const PORT = env.PORT;

async function bootstrap() {
  try {
    const result = await initializeRagPipeline();
    logger.info(result, "RAG pipeline initialized");
  } catch (error) {
    logger.error(error, "RAG initialization failed");
  }

  app.listen(PORT, () => {
    console.log(`
================================================
Portfolio AI Backend is running
================================================
Environment : ${env.NODE_ENV}
Port        : ${PORT}
Health      : http://localhost:${PORT}/health
Chat        : http://localhost:${PORT}/api/v1/chat
Ingest      : http://localhost:${PORT}/api/v1/ingest
================================================
`);

    startSelfPing();
  });
}

void bootstrap();
