"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/shadcn/button";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import { Lightbulb, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Idea, IdeasListProps } from "@/types/types";
import { useChatStorage } from "@/hooks/useChatStorage";
import { useSearchParams } from "next/navigation";

export default function IdeasList({ className }: IdeasListProps) {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const searchParams = useSearchParams();
    const chatId = searchParams.get("chatId");

    const { removeIdeaById, loadIdeas } = useChatStorage();

    useEffect(() => {
        const updateIdeasFromStorage = () => {
            if (chatId) {
                setIdeas(loadIdeas(chatId));
            } else {
                setIdeas([]);
            }
        };
        // Load ideas on component mount
        updateIdeasFromStorage();

        // Listen for custom "ideasUpdated" event
        const handleIdeasUpdated = () => {
            updateIdeasFromStorage();
        };

        window.addEventListener("ideasUpdated", handleIdeasUpdated);

        return () => {
            window.removeEventListener("ideasUpdated", handleIdeasUpdated);
        };
    }, [loadIdeas, chatId]);

    const handleIdeaDelete = (id: string) => {
        if (chatId) {
            const updatedIdeas = ideas.filter((idea) => idea.id !== id);
            setIdeas(updatedIdeas);
            removeIdeaById(chatId, id);
        }
    };

    return (
        <div
            className={cn(
                className,
                "w-full mx-auto p-4 bg-background border rounded-lg shadow-sm"
            )}
        >
            <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-8 flex items-center">
                <Lightbulb className="mr-2" />
                Saved Ideas
            </h2>
            <ScrollArea className="pr-4 h-[calc(100vh-10rem)] lg:h-[85vh]">
                {ideas.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                        No ideas saved yet. Start adding some!
                    </p>
                ) : (
                    <ul className="space-y-4">
                        {ideas.map((idea) => (
                            <li
                                key={idea.id}
                                className="flex items-center gap-2 bg-muted p-4 rounded-xl"
                            >
                                <span className="flex-grow">
                                    {idea.content}
                                </span>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleIdeaDelete(idea.id)}
                                    aria-label={`Delete idea: ${idea.content}`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </ScrollArea>
        </div>
    );
}
