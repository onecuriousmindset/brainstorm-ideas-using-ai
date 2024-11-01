import { ReactNode } from "react";

export interface Message {
    role: "user" | "assistant";
    content: Array<{
        type: "text";
        text: string;
    }>;
}

export interface Chat {
    id: string;
    messages: Message[];
    ideas: Idea[];
}

export interface ChatHistoryProps {
    className?: string;
}

export interface ChatInterfaceProps {
    className?: string;
}

export interface IdeasListProps {
    className?: string;
}

export interface Idea {
    id: string;
    content: string;
}

export interface SidebarSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    side: "left" | "right" | "top" | "bottom";
    triggerIcon: ReactNode;
    children: ReactNode;
    className?: string;
}
