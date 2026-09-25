import type { Metadata } from "next";
import { Inter, Geist_Mono, Bowlby_One_SC } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

// SF Pro can't be self-hosted, so Apple devices get it via the system font
// stack in globals.css; Inter is the closest match everywhere else.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bowlbyOneSC = Bowlby_One_SC({
  variable: "--font-bowlby-one-sc",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "beTshaped.dev — Become a T-shaped developer",
  description:
    "An interactive Skill map of what to learn to become a developer: the Core every developer needs, one Branch to go deep in, and free resources for every Skill.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${bowlbyOneSC.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
