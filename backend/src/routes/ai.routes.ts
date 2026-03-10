import { Router } from "express";
import { getDraft } from "../controllers/ai.controller.js";

const router = Router();

router.get("/draft", getDraft)

export default router