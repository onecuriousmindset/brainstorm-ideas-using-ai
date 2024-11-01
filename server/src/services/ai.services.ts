import OpenAI from "openai";
import { OpenAIMessage } from "../types/types";
import { SYSTEM_PROMPT } from "../prompts/prompt";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getAIResponse(messages: OpenAIMessage[]) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: [
                    {
                        type: "text",
                        text: SYSTEM_PROMPT,
                    },
                ],
            },
            ...messages,
        ],
        temperature: 0.5,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        response_format: {
            type: "text",
        },
    });

    return response.choices[0].message.content;
}
