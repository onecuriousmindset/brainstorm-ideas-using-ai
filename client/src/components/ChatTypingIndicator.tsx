import React from "react";

export default function ChatTypingIndicator() {
    return (
        <div className="flex items-center space-x-1 p-2">
            <div className="text-gray-500">Typing</div>
            <div className="flex space-x-1">
                {[0, 1, 2].map((dot) => (
                    <div
                        key={dot}
                        className={`
              w-2 h-2 bg-gray-400 rounded-full
              animate-bounce
            `}
                        style={{
                            animationDelay: `${dot * 0.2}s`,
                            animationDuration: "1s",
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
}
