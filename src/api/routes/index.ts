import { Router } from "express";
import healthRoutes from "./health.routes";
import chatRoutes from "./chat.routes";
import ingestRoutes from "./ingest.routes";

const router = Router();

router.use(healthRoutes);
router.use(chatRoutes);
router.use(ingestRoutes);

export default router;
