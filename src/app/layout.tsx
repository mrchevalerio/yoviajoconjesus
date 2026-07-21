import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  title: "Yo Viajo con Jesus | Servicio de Transporte al Aeropuerto JFK",
  description:
    "Servicio confiable de transporte al aeropuerto desde Washington Heights, Inwood y el Bronx hasta el JFK. Recogidas con seguimiento de vuelo, tarifas fijas, reservado en un minuto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable} h-full antialiased`}>
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
        <Analytics />
      </body>
    </html>
  );
}
