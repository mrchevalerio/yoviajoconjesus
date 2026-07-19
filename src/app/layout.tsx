import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yo Viajo con Jesus | Airport Car Service to JFK",
  description:
    "Reliable airport car service from Washington Heights, Inwood, and the Bronx to JFK. Flight-tracked pickups, flat local rates, booked in a minute.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <LanguageProvider>
          <a href="#main" className="skip-link">
            Skip to main content
          </a>
          <div className="ambient" aria-hidden="true">
            <div className="ambient__orb ambient__orb--1" />
            <div className="ambient__orb ambient__orb--2" />
          </div>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
