import type { Metadata } from "next";
import {
  Great_Vibes as GreatVibes,
  Nunito,
  Playfair_Display as PlayfairDisplay,
} from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const playfair = PlayfairDisplay({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const greatVibes = GreatVibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Taylor-Made Baby Co.",
  description: "Role-based mentorship platform for growing families.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${playfair.variable} ${greatVibes.variable}`}>
      <body className="bg-ivory text-charcoal antialiased">
        <Navbar />
        <main className="mx-auto min-h-[calc(100vh-80px)] max-w-6xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
