import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Last Signal — A Cinematic Search for Life Beyond Earth",
  description: "Embark on a cinematic scroll-driven journey through space, tracing humanity's search for signs of life in the silent cosmos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="bg-black text-white min-h-full flex flex-col font-sans select-none">
        <div className="scanlines"></div>
        {children}
      </body>
    </html>
  );
}
