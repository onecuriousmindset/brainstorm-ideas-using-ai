"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn/button";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import { MessageCircle, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Chat, ChatHistoryProps } from "@/types/types";
import { useChatStorage } from "@/hooks/useChatStorage";

export default function ChatHistory({ className }: ChatHistoryProps) {
    const [chats, setChats] = useState<Chat[]>([]);

    // Load chats from localStorage
    const { loadChats } = useChatStorage();

    useEffect(() => {
        const updateChatsFromStorage = () => {
            setChats(loadChats());
        };
        // Load Chats on component mount
        updateChatsFromStorage();

        // Listen for custom "ChatsUpdated" event
        const handleChatAdded = () => {
            updateChatsFromStorage();
        };

        window.addEventListener("chatAdded", handleChatAdded);

        return () => {
            window.removeEventListener("chatAdded", handleChatAdded);
        };
    }, [loadChats]);  

    // Removes the chatId from the URL
    const onNewChat = () => {
        window.history.replaceState({}, "", "/");
    };

    // Updates the chatId in the URL
    const onChatSelect = (chatId: string) => {
        window.history.replaceState({}, "", `/?chatId=${chatId}`);
    };

    return (
        <div
            className={cn(
                "flex flex-col h-full bg-gray-100 pr-10 lg:pr-0",
                className
            )}
        >
            <Button
                variant="outline"
                className="flex items-center justify-center gap-2 m-4"
                onClick={onNewChat}
            >
                <Plus className="w-4 h-4" />
                New Chat
            </Button>
            <ScrollArea className="flex-grow">
                <div className="space-y-2 px-4">
                    {chats.map((chat) => (
                        <Button
                            key={chat.id}
                            variant="ghost"
                            className="w-full justify-start text-left font-normal"
                            onClick={() => onChatSelect?.(chat.id)}
                        >
                            <MessageCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                                {chat.messages[0].content[0].text}
                            </span>
                        </Button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
