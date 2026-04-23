import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillSwap — Teach What You Know. Learn What You Want.",
  description:
    "SkillSwap is a skill-barter learning platform where users can teach skills they know and learn skills they want from others using Skill Points (SP).",
  keywords: ["SkillSwap", "skill exchange", "learning", "teaching", "SP", "skill points"],
  authors: [{ name: "SkillSwap Team" }],
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "SkillSwap — Teach What You Know. Learn What You Want.",
    description: "Swap skills with real people. Your knowledge is your currency.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#4F46E5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SkillSwap" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
