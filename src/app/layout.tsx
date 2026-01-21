import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "SubGuard | The Agentic Subscription Guard",
    description: "Autonomous USDC treasury management on Arc L1.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" style={{ backgroundColor: '#030305' }}>
            <body className={`${inter.className} bg-[#030305] text-white antialiased`}>
                <Providers>
                    <div className="bg-mesh" />
                    <main className="relative z-10">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
