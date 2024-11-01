"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Message, ChatInterfaceProps } from "@/types/types";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/axios";
import ChatTypingIndicator from "./ChatTypingIndicator";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useChatStorage } from "@/hooks/useChatStorage";

export default function ChatInterface({ className }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    const { loadChat, createChat, updateChat, addIdeasToChat } =
        useChatStorage();

    const router = useRouter();
    const searchParams = useSearchParams();
    const chatId = searchParams.get("chatId");
    const scrollRef = useRef<HTMLDivElement | null>(null);

    // Load chat messages on initial render
    useEffect(() => {
        if (chatId) {
            const messages = loadChat(chatId);
            setMessages(messages);
        } else {
            setMessages([]);
        }
    }, [chatId, loadChat]);

    // Auto-scroll to the bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Handle user message submission
    const handleMessageSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = {
            content: [{ type: "text", text: input.trim() }],
            role: "user",
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput("");

        try {
            const assistantMessage = await fetchAIResponse([
                ...messages,
                userMessage,
            ]);
            setMessages((prevMessages) => [...prevMessages, assistantMessage]);

            if (chatId) {
                updateChat(userMessage, assistantMessage, chatId);
            } else {
                const newChatId = createChat(userMessage, assistantMessage);
                router.push(`/?chatId=${newChatId}`);
            }
        } catch (error) {
            console.error("Error fetching AI response:", error);
        }
    };

    // Fetch AI response
    const fetchAIResponse = useCallback(
        async (messages: Message[]): Promise<Message> => {
            setIsFetching(true);
            try {
                const response = await apiClient.post("/ai/chat", { messages });

                if (response.data.ideas && chatId) {
                    console.log("Adding ideas to chat", response.data.ideas);
                    addIdeasToChat(chatId, response.data.ideas);
                }

                return {
                    content: [{ type: "text", text: response.data.response }],
                    role: "assistant",
                };
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                throw new Error("Failed to fetch AI response");
            } finally {
                setIsFetching(false);
            }
        },
        [addIdeasToChat, chatId]
    );

    return (
        <div
            className={cn(
                className,
                "flex flex-col h-[calc(100vh-2rem)] lg:h-[95vh] px-2 lg:px-8 w-full mx-auto rounded-lg overflow-hidden my-4 lg:m-4"
            )}
        >
            <div
                ref={scrollRef}
                className="flex-grow p-4 space-y-4 pt-10 lg:pt-0 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500"
                style={{ scrollbarWidth: "thin" }}
            >
                {messages.map((message, index) => (
                    <div
                        key={`${message.role}-${index}`}
                        className={`flex my-6 ${
                            message.role === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                                message.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                            }`}
                        >
                            {message.role === "assistant" ? (
                                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                    {message.content[0].text.replace(
                                        /\n/g,
                                        "<br>"
                                    )}
                                </ReactMarkdown>
                            ) : (
                                message.content[0].text
                            )}
                        </div>
                    </div>
                ))}
                {isFetching && <ChatTypingIndicator />}
            </div>
            <form onSubmit={handleMessageSubmit} className="p-4 flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow"
                />
                <Button type="submit" size="icon" disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                </Button>
            </form>
        </div>
    );
}
