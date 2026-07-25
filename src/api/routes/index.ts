import { Router } from "express";
import healthRoutes from "./health.routes";
import chatRoutes from "./chat.routes";
import ingestRoutes from "./ingest.routes";
import contactRoutes from "./contact.routes";
import blogRoutes from "./blog.routes";

const router = Router();

router.use(healthRoutes);
router.use(chatRoutes);
router.use(ingestRoutes);
router.use(contactRoutes);
router.use(blogRoutes);

export default router;
