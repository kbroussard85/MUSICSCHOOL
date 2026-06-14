import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stage Music Academy | The Future of Live Jam Telemetry",
  description: "Stage Music Academy fuses retro-futuristic live performance coaching with next-gen regional jam capabilities. Plug into professional backlines, join a real rock band, and perform live on stage.",
  keywords: "music school, learn music, rock band, jam session, stage music academy, cyber music, live music lessons, piano lessons, guitar lessons, violin lessons",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        {/* FontAwesome for Icons */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0b0e14] text-[#f8fafc]">
        <div className="cyber-scanlines" />
        {children}
      </body>
    </html>
  );
}
