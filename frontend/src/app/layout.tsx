import type { Metadata } from "next";
import {
  Great_Vibes as GreatVibes,
  Nunito,
  Playfair_Display as PlayfairDisplay,
} from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const playfair = PlayfairDisplay({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const greatVibes = GreatVibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
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
    <html lang="en">
      <body
        className={`${nunito.variable} ${playfair.variable} ${greatVibes.variable} antialiased bg-ivory text-charcoal`}
      >
        {children}
      </body>
    </html>
  );
}
