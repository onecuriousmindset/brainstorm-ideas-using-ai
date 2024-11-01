export interface OpenAIMessage {
    role: "system" | "user" | "assistant";
    content: [
        {
            type: "text";
            text: string;
        }
    ];
}
