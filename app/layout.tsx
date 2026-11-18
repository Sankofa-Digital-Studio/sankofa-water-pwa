import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";

/* ── Fonts ──────────────────────────────────────────────────────────────── */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/* ── Metadata ───────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "Sankofa Water",
    template: "%s | Sankofa Water",
  },
  description:
    "Real-time water infrastructure monitoring for the Matjhabeng Local Municipality. Track sensor readings, manage alerts, and respond to outages.",
  keywords: [
    "water",
    "IoT",
    "Matjhabeng",
    "South Africa",
    "infrastructure",
    "monitoring",
    "Sankofa",
  ],
  authors: [{ name: "Senatla Operations" }],
  creator: "Senatla Operations",
  publisher: "Senatla Operations",

  // PWA / icon metadata
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: process.env["NEXT_PUBLIC_APP_URL"] ?? "https://sankofa-water.vercel.app",
    siteName: "Sankofa Water",
    title: "Sankofa Water — Matjhabeng Infrastructure Monitoring",
    description:
      "Real-time water infrastructure monitoring for the Matjhabeng Local Municipality.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sankofa Water Dashboard",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Sankofa Water",
    description:
      "Real-time water infrastructure monitoring for the Matjhabeng Local Municipality.",
    images: ["/og-image.png"],
  },

  // Robots
  robots: {
    index: false, // Internal ops tool — do not index
    follow: false,
  },
};

/* ── Viewport ───────────────────────────────────────────────────────────── */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
    { media: "(prefers-color-scheme: light)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover", // Respect notch / home indicator on iOS
};

/* ── Root Layout ────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-ZA"
      className={`${inter.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        {/* Apple-specific PWA meta */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Sankofa Water" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="min-h-dvh bg-slate-950 font-sans text-slate-100 antialiased">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
