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
  title: "Next Stage Music Academy | The Ecosystem of Music",
  description: "Next Stage Music Academy combines world-class technical instruction with professional stage experience. We don't just teach notes. We teach the ecosystem of music, preparing you for the stage and studio.",
  keywords: "music school, learn music, rock band, jam session, next stage music academy, stage music academy, live music lessons, piano lessons, guitar lessons, violin lessons",
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
        {children}
      </body>
    </html>
  );
}
