import { Router } from "express";

import { ingestKnowledge } from "../controllers/ingest.controller";

const router = Router();

router.post("/ingest", ingestKnowledge);

export default router;
