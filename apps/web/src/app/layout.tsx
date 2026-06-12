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
  title: "Harmony Music School | Elevate Your Musical Journey",
  description: "Unlock your musical potential at Harmony Music School. We offer professional training in Piano, Guitar, Violin, Voice, and Drums. Explore our interactive courses and schedule a lesson today.",
  keywords: "music school, learn music, piano lessons, guitar lessons, violin lessons, singing voice training, drum lessons, music dashboard",
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
      <body className="min-h-full flex flex-col bg-[#0b0e14] text-[#f8fafc]">{children}</body>
    </html>
  );
}
