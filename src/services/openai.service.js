import fs from "fs/promises";
import path from "path";
import OpenAI from "openai";
import { ApiError } from "../utils/ApiError.js";

const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const PROMPT_TEMPLATE_PATH = path.resolve(process.cwd(), "prompt.md");

let cachedClient = null;
let cachedPromptTemplate = null;

const getOpenAIClient = async () => {
    if (cachedClient) {
        return cachedClient;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new ApiError(500, "Missing OPENAI_API_KEY in environment variables");
    }

    cachedClient = new OpenAI({ apiKey });
    return cachedClient;
};

const getPromptTemplate = async () => {
    if (cachedPromptTemplate) {
        return cachedPromptTemplate;
    }

    try {
        cachedPromptTemplate = await fs.readFile(PROMPT_TEMPLATE_PATH, "utf8");
    } catch {
        throw new ApiError(500, "Unable to load prompt.md template for OpenAI service");
    }

    return cachedPromptTemplate;
};

const buildPrompt = (template, captionText) => {
    return template.replace("{{INSERT_CAPTION_HERE}}", captionText.trim());
};

const extractTextFromResponse = (response) => {
    if (typeof response?.output_text === "string" && response.output_text.trim()) {
        return response.output_text.trim();
    }

    const text =
        response?.output
            ?.flatMap((item) => item?.content || [])
            ?.find((content) => content?.type === "output_text")?.text ||
        "";

    return text.trim();
};

const parseModelJson = (rawText) => {
    const cleaned = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();

    try {
        return JSON.parse(cleaned);
    } catch {
        throw new ApiError(502, "OpenAI returned invalid JSON");
    }
};

const normalizeRecipeResponse = (payload) => {
    if (!payload || typeof payload !== "object") {
        throw new ApiError(502, "OpenAI returned an empty payload");
    }

    return payload;
};

const extractRecipeFromCaption = async (captionText) => {
    if (!captionText || typeof captionText !== "string") {
        throw new ApiError(400, "captionText must be a non-empty string");
    }

    const client = await getOpenAIClient();
    const template = await getPromptTemplate();
    const prompt = buildPrompt(template, captionText);

    let response;
    try {
        response = await client.responses.create({
            model: DEFAULT_OPENAI_MODEL,
            input: prompt,
            max_output_tokens: 1800,
        });
    } catch {
        throw new ApiError(502, "Failed to get response from OpenAI");
    }

    const rawText = extractTextFromResponse(response);
    if (!rawText) {
        throw new ApiError(502, "OpenAI returned an empty response");
    }

    const parsed = parseModelJson(rawText);
    return normalizeRecipeResponse(parsed);
};

export const openAiService = {
    extractRecipeFromCaption,
};
