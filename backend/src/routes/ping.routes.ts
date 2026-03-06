import { Router } from "express";
import { Ping } from "../controllers/ping.controller.js";

const router = Router();

router.get("/", Ping)

export default router