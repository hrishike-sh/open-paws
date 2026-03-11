import { Request, Response } from "express";
import {
	CampaignBrief,
	DraftCampaign,
	ReturnType,
	EditContent,
} from "../services/openai.js";

export const getDraft = async (req: Request, res: Response) => {
	if (!req.body) {
		return res.status(400).json({
			error: "Missing body",
		});
	}

	const { topic, tone, target_audience, key_stats, cta } =
		req.body as CampaignBrief;

	if (!topic || !tone || !target_audience || !key_stats || !cta) {
		return res.status(400).json({
			error:
				"Missing one or more required fields: topic, tone, target_audience, key_stats, cta",
		});
	}

	let text: ReturnType;

	try {
		text = await DraftCampaign({
			topic,
			tone,
			target_audience,
			key_stats,
			cta,
		});
	} catch (error) {
		return res.status(500).json({
			error: (error as Error).message,
		});
	}

	return res.status(200).json({
		text,
	});
};

export const editContent = async (req: Request, res: Response) => {
	const { text, prompt, brief } = req.body;

	if (!text || !prompt || !brief) {
		return res.status(400).json({
			error: "Missing text, prompt or brief",
		});
	}

	try {
		const result = await EditContent(text, prompt, brief);
		return res.status(200).json({
			text: result,
		});
	} catch (error) {
		return res.status(500).json({
			error: (error as Error).message,
		});
	}
};
