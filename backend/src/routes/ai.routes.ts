import { Router } from "express";
import { getDraft, editContent } from "../controllers/ai.controller.js";

const router = Router();

/**
 * @swagger
 * /ai/draft:
 *   post:
 *     summary: Generate AI-driven campaign content drafts
 *     description: Receives a campaign brief and generates multiple platform-specific content variants using AI.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - tone
 *               - target_audience
 *               - key_stats
 *               - cta
 *             properties:
 *               topic:
 *                 type: string
 *                 example: "Raising awareness about plastic pollution in oceans"
 *               tone:
 *                 type: string
 *                 example: "Urgent yet hopeful"
 *               target_audience:
 *                 type: string
 *                 example: "Young adults aged 18-30"
 *               key_stats:
 *                 type: string
 *                 example: "8 million tons of plastic enter the ocean every year"
 *               cta:
 *                 type: string
 *                 example: "Sign the petition to ban single-use plastics"
 *     responses:
 *       200:
 *         description: Successfully generated campaign drafts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                     data:
 *                       type: object
 *                     message:
 *                       type: string
 *       400:
 *         description: Bad Request - Missing one or more required fields.
 *       401:
 *         description: Unauthorized - No bearer token provided or token is invalid.
 *       403:
 *         description: Forbidden - Invalid bearer token.
 *       500:
 *         description: Internal Server Error.
 */
router.post("/draft", getDraft);

/**
 * @swagger
 * /ai/edit:
 *   post:
 *     summary: Edit content with AI
 *     description: Takes original text and a prompt to rephrase the text.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - prompt
 *               - brief
 *             properties:
 *               text:
 *                 type: string
 *               prompt:
 *                 type: string
 *               brief:
 *                 type: object
 *     responses:
 *       200:
 *         description: Successfully edited content.
 *       400:
 *         description: Bad Request.
 *       500:
 *         description: Internal Server Error.
 */
router.post("/edit", editContent);

export default router;
