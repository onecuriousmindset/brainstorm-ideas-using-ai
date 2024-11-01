import { Request, Response, NextFunction } from "express";
import { getAIResponse } from "../services/ai.services";
import { OpenAIMessage } from "../types/types";
import logger from "../services/logger.services";
import Joi from "joi";

export async function sendMessageToAI(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { messages } = req.body as { messages: OpenAIMessage[] };
        const response = await getAIResponse(messages);

        if (!response) {
            logger.error("AI response is undefined or null.");
            res.status(500).json({
                error: "Failed to get a response from AI.",
            });
            return;
        }

        // Regex pattern to extract ideas from response
        const ideasRegex = /```ideas\s*([\s\S]*?)\s*```/i;
        const ideasMatch = response.match(ideasRegex);

        if (ideasMatch) {
            try {
                const parsedIdeas = JSON.parse(ideasMatch[1].trim());
                if (!Array.isArray(parsedIdeas)) {
                    throw new Error("Parsed ideas is not an array.");
                }

                // Format ideas as a numbered list 
                const formattedIdeas = parsedIdeas
                    .map(
                        (idea: string, index: number) =>
                            `**${index + 1}.** ${idea}`
                    )
                    .join("\n\n");
                
                const formattedResponse = response.replace(
                    ideasRegex,
                    formattedIdeas
                );

                res.status(200).json({
                    ideas: parsedIdeas,
                    response: formattedResponse,
                });
                return;
            } catch (parseError) {
                logger.error("Failed to parse ideas JSON.", parseError);
                res.status(500).json({
                    error: "Failed to process AI ideas response.",
                });
                return;
            }
        }

        res.status(200).json({ response });
        return;
    } catch (err) {
        logger.error("An unexpected error occurred in sendMessageToAI.", err);
        next(err);
    }
}

// Schema for input validation
const aiMessageSchema = Joi.object({
    messages: Joi.array()
        .items(
            Joi.object({
                role: Joi.string().valid("user", "assistant").required(),
                content: Joi.array()
                    .items(
                        Joi.object({
                            type: Joi.string().required(),
                            text: Joi.string().required(),
                        })
                    )
                    .required(),
            }).required()
        )
        .required(),
});

// Middleware for input validation
export function validateInputForAI(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { messages } = req.body;

    if (!messages) {
        logger.warn("Validation failed: Messages are required.");
        res.status(400).json({ error: "Messages are required." });
        return;
    }

    const { error } = aiMessageSchema.validate({ messages });

    if (error) {
        logger.warn(`Validation failed: ${error.details[0].message}`);
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    next();
}
