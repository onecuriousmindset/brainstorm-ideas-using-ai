"use client";

import React, { useState, Suspense } from "react";
import ChatHistory from "@/components/ChatHistory";
import ChatInterface from "@/components/ChatInterface";
import IdeasList from "@/components/IdeasList";
import { Lightbulb, Menu } from "lucide-react";
import SidebarSheet from "@/components/SidebarSheet";

export default function Home() {
    const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
    const [isIdeasListOpen, setIsIdeasListOpen] = useState(false);

    return (
        <div className="h-screen flex flex-col lg:grid lg:grid-cols-12 bg-gray-50">
            {/* Mobile navigation - For Screen Size Smaller Than 1024px */}
            <SidebarSheet
                open={isChatHistoryOpen}
                onOpenChange={setIsChatHistoryOpen}
                side="left"
                triggerIcon={<Menu className="h-4 w-4" />}
                className="left-4"
            >
                <ChatHistory className="h-full" />
            </SidebarSheet>

            <SidebarSheet
                open={isIdeasListOpen}
                onOpenChange={setIsIdeasListOpen}
                side="right"
                triggerIcon={<Lightbulb className="h-4 w-4" />}
                className="right-4"
            >
                <Suspense fallback={<IdeasListFallback />}>
                    <IdeasList className="h-full" />
                </Suspense>
            </SidebarSheet>

            {/* Main Content */}
            <ChatHistory className="hidden lg:block lg:col-span-2" />

            {/* Wrap ChatInterface and IdeasList with Suspense as they use useSearchParams */}
            <Suspense fallback={<ChatInterfaceFallback />}>
                <ChatInterface className="flex-grow lg:col-span-7" />
            </Suspense>

            <Suspense fallback={<IdeasListFallback />}>
                <IdeasList className="hidden lg:block lg:col-span-3" />
            </Suspense>
        </div>
    );
}

const ChatInterfaceFallback = () => (
    <div className="flex-grow lg:col-span-7 flex items-center justify-center">
        Loading chat...
    </div>
);

const IdeasListFallback = () => (
    <div className="hidden lg:block lg:col-span-3 items-center justify-center">
        Loading ideas...
    </div>
);
