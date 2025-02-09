import "@styles/global.css";
import React from "react";
import Provider from "@components/Provider";
import { ThemeProvider } from "@components/ThemeProvider";
import Nav from "@components/Nav";
import ErrorBoundary from "@components/ErrorBoundary";

export const metadata = {
  title: {
    default: "Prompt Central - Share AI Prompts",
    template: "%s | Prompt Central"
  },
  description: "Discover and share powerful AI prompts with a global community. Find inspiration, collaborate, and enhance your AI interactions.",
  keywords: ["AI prompts", "artificial intelligence", "prompt engineering", "AI community", "prompt sharing"],
  authors: [{ name: "Sebastian Molina" }],
  creator: "Sebastian Molina",
  publisher: "Prompt Central",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://promptcentral.vercel.app",
    siteName: "Prompt Central",
    title: "Prompt Central - Share AI Prompts",
    description: "Discover and share powerful AI prompts with a global community",
    images: [
      {
        url: "/assets/img/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Prompt Central - AI Prompt Sharing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Central - Share AI Prompts",
    description: "Discover and share powerful AI prompts with a global community",
    images: ["/assets/img/og-image.jpg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Provider>
            <div className="main">
              <div className="gradient" />
            </div>
            <main className="app">
              <Nav />
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
