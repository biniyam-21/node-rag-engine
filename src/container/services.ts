import { createContainer, AppContainer } from "./container";
import { ContainerTypes } from "./types";
import { ChatService } from "../rag/chat/ChatService";
import { IngestionService } from "../rag/ingestion/IngestionService";

let appServices: AppContainer | null = null;

export async function getAppServices(refresh = false): Promise<AppContainer> {
  if (!appServices || refresh) {
    appServices = await createContainer();
  }

  return appServices;
}

export async function getChatService(): Promise<ChatService> {
  const services = await getAppServices();
  return services[ContainerTypes.ChatService] as ChatService;
}

export async function getIngestionService(): Promise<IngestionService> {
  const services = await getAppServices();
  return services[ContainerTypes.IngestionService] as IngestionService;
}

export async function initializeRagPipeline(force = false) {
  const ingestionService = await getIngestionService();
  return ingestionService.ingest(force);
}
