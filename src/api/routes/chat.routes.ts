import { Router } from "express";
import { ask } from "../controllers/chat.controller";

const router = Router();

router.post("/chat", ask);

export default router;
