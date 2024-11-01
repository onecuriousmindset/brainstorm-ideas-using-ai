// useChatStorage.ts
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Chat, Idea, Message } from "@/types/types";

const STORAGE_KEY = "chats";

export function useChatStorage() {
    //  function to load all chats
    const loadChats = useCallback((): Chat[] => {
        try {
            const chats = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return chats;
        } catch (error) {
            console.error("Failed to load chats from localStorage:", error);
            return [];
        }
    }, []);

    //  function to load a specific chat by ID
    const loadChat = useCallback(
        (chatId: string): Message[] => {
            const storedChats = loadChats();
            const chat = storedChats.find((chat) => chat.id === chatId);
            return chat ? chat.messages : [];
        },
        [loadChats]
    );

    //  function to save all chats
    const saveChats = useCallback((updatedChats: Chat[]) => {
        try {
            console.log("updatedChatsinSave", updatedChats);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedChats));
        } catch (error) {
            console.error("Failed to save chats to localStorage:", error);
        }
    }, []);

    // Create a new chat with initial messages
    const createChat = useCallback(
        (userMessage: Message, assistantMessage: Message): string => {
            const newChat: Chat = {
                id: uuidv4(),
                messages: [userMessage, assistantMessage],
                ideas: [],
            };
            const storedChats = loadChats();
            const updatedChats = [newChat, ...storedChats];
            saveChats(updatedChats);
            window.dispatchEvent(new Event("chatAdded"));
            return newChat.id;
        },
        [loadChats, saveChats]
    );

    // Update a chat by adding new messages
    const updateChat = useCallback(
        (userMessage: Message, assistantMessage: Message, chatId: string) => {
            const storedChats = loadChats();
            const updatedChats = storedChats.map((chat) =>
                chat.id === chatId
                    ? {
                          ...chat,
                          messages: [
                              ...chat.messages,
                              userMessage,
                              assistantMessage,
                          ],
                      }
                    : chat
            );
            saveChats(updatedChats);
        },
        [loadChats, saveChats]
    );

    // Load ideas for the specific chat
    const loadIdeas = useCallback(
        (chatId: string): Idea[] => {
            const storedChats = loadChats();
            const chat = storedChats.find((chat) => chat.id === chatId);

            return chat ? chat.ideas : [];
        },
        [loadChats]
    );

    // Add a new idea to a specific chat
    const addIdeasToChat = useCallback(
        (chatId: string, ideas: string[]): void => {
            const newIdeas = ideas.map((idea) => ({
                id: uuidv4(),
                content: idea,
            }));
            const storedChats = loadChats();
            // Remove duplicates by filtering them based on content
            const uniqueIdeas = newIdeas.filter(
                (idea) =>
                    !storedChats
                        .map((chat) => chat.ideas)
                        .flat()
                        .map((idea) => idea.content)
                        .includes(idea.content)
            );
            const updatedChats = storedChats.map((chat) =>
                chat.id === chatId
                    ? {
                          ...chat,
                          ideas: [...chat.ideas, ...uniqueIdeas],
                      }
                    : chat
            );
            console.log("updatedChats", updatedChats);
            saveChats(updatedChats);

            // Trigger an event to notify other components of the change
            window.dispatchEvent(new Event("ideasUpdated"));
        },
        [loadChats, saveChats]
    );

    // Remove an idea by its ID from a specific chat
    const removeIdeaById = useCallback(
        (chatId: string, ideaId: string): void => {
            const storedChats = loadChats();
            const updatedChats = storedChats.map((chat) =>
                chat.id === chatId
                    ? {
                          ...chat,
                          ideas: chat.ideas.filter(
                              (idea) => idea.id !== ideaId
                          ),
                      }
                    : chat
            );
            saveChats(updatedChats);
        },
        [loadChats, saveChats]
    );

    // Delete an entire chat
    const deleteChat = useCallback(
        (chatId: string): void => {
            const storedChats = loadChats();
            const updatedChats = storedChats.filter(
                (chat) => chat.id !== chatId
            );
            saveChats(updatedChats);
        },
        [loadChats, saveChats]
    );

    return {
        loadChats,
        loadChat,
        createChat,
        updateChat,
        loadIdeas,
        addIdeasToChat,
        removeIdeaById,
        deleteChat,
    };
}
