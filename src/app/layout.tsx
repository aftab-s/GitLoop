import type { Metadata } from "next";
import { Inter, Space_Grotesk, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CommitFM — Procedural GitHub Music Generator",
  description: "Transform your GitHub contributions, programming languages, and repositories into a beautiful, personalized procedural soundtrack and visualizer.",
  keywords: ["GitHub", "Spotify Wrapped", "Music Generator", "Creative Coding", "Synthwave", "Procedural Music", "Web Audio API"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${lora.variable} h-full antialiased`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-full flex flex-col bg-[#0c0714] text-[#f8f6fc] antialiased bg-grid">
        {children}
      </body>
    </html>
  );
}
