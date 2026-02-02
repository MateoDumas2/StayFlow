import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { ChatWidget } from "@/components/ui/ChatWidget";
import GlobalSpotifyPlayer from "@/components/features/GlobalSpotifyPlayer";
import I18nInit from "@/components/I18nInit";

import ThemeProvider from "@/components/providers/ThemeProvider";
import { AccessibilityProvider } from "@/components/providers/AccessibilityProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StayFlow - Reservas tipo Airbnb",
  description: "Encuentra tu próximo destino con StayFlow",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-canvas text-ink min-h-screen flex flex-col`}
      >
        <AccessibilityProvider>
        <ThemeProvider>
        <ApolloWrapper>
          <I18nInit />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <ChatWidget />
          {/* <GlobalSpotifyPlayer /> */}
        </ApolloWrapper>
        </ThemeProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
