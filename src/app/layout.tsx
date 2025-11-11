import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CrowdStaking | Decentralized Venture Studio",
  description: "Launch your startup without capital. Transform creative initiative into liquid equity from day 1. CrowdStaking connects visionaries with global co-founders.",
  keywords: ["crowdstaking", "decentralized venture studio", "liquid equity", "startup funding", "web3", "blockchain", "co-founders", "tokenization"],
  authors: [{ name: "CrowdStaking Foundation" }],
  creator: "CrowdStaking Foundation",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://crowdstaking.com",
    title: "CrowdStaking | Decentralized Venture Studio",
    description: "Launch your startup without capital. Transform creative initiative into liquid equity from day 1.",
    siteName: "CrowdStaking",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrowdStaking | Decentralized Venture Studio",
    description: "Launch your startup without capital. Transform creative initiative into liquid equity from day 1.",
    creator: "@crowdstaking",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of unstyled content for dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && systemDark)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "CrowdStaking",
              "description": "Decentralized venture studio transforming creative initiative into liquid equity",
              "url": "https://crowdstaking.com",
              "logo": "https://crowdstaking.com/logo.png",
              "foundingDate": "2025",
              "founders": [
                {
                  "@type": "Organization",
                  "name": "CrowdStaking Foundation"
                }
              ],
              "sameAs": [
                "https://twitter.com/crowdstaking",
                "https://discord.gg/crowdstaking"
              ]
            }),
          }}
        />
        {/* Favicons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/svg+xml" href="/icon-crowdstaking.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
