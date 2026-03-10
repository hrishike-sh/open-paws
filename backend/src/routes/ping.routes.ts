import { Router } from "express";
import { Ping } from "../controllers/ping.controller.js";

const router = Router();

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Ping the server
 *     description: Check if the server is running.
 *     responses:
 *       200:
 *         description: Server is running.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: pong
 */
router.get("/", Ping)

export default router