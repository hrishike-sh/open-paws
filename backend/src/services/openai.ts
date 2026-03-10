import { configDotenv } from "dotenv";
import OpenAI from "openai";

configDotenv()

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export type CampaignBrief = {
    topic: string;
    tone: string;
    target_audience: string;
    key_stats: string;
    cta: string;
}

export type ReturnType = {
    success: boolean;
    data?: any;
    message?: string;
}

const PROMPT = `You are an expert campaign copywriter and digital strategist for an advocacy organization. Your task is to take a core campaign brief and generate highly optimized, platform-specific content variants for A/B testing.

Return the output STRICTLY as a JSON object matching this exact schema:
{
  "twitter": { 
    "variant_a": "", 
    "variant_b": "" 
  },
  "instagram": {
    "variant_a": { "visual_concept": "", "caption": "" },
    "variant_b": { "visual_concept": "", "caption": "" }
  },
  "email": {
    "variant_a": { "subject": "", "preview": "", "body": "" },
    "variant_b": { "subject": "", "preview": "", "body": "" }
  },
  "blog": {
    "variant_a": { "title": "", "excerpt": "" },
    "variant_b": { "title": "", "excerpt": "" }
  },
  "press_release": {
    "variant_a": { "headline": "", "opening_paragraph": "" },
    "variant_b": { "headline": "", "opening_paragraph": "" }
  }
}`;

export const DraftCampaign = async (brief: CampaignBrief): Promise<ReturnType> => {
    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: PROMPT },
                { role: "user", content: JSON.stringify(brief) }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;

        if (!content) {
            return {
                success: false,
                message: "Empty response from API"
            };
        }

        return {
            success: true,
            data: JSON.parse(content)
        };
    } catch (error) {
        return {
            success: false,
            message: (error as Error).message
        };
    }
}