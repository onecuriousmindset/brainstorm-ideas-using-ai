import type { Metadata } from "next";

import "./globals.css";
import { Albert_Sans } from "next/font/google";

export const metadata: Metadata = {
    title: "Chat App",
    description: "A simple chat app built with Next.js",
};

const albertSans = Albert_Sans({
    subsets: ["latin"],
    variable: "--font-albertSans",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${albertSans.className} antialiased `}>
                {children}
            </body>
        </html>
    );
}
