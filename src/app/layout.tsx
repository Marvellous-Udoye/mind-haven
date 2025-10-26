import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "MindHaven | Mental Wellness Companion",
    template: "%s | MindHaven",
  },
  description:
    "MindHaven helps care seekers and providers connect, schedule sessions, and manage mental wellness journeys through a refined mobile experience.",
  keywords: [
    "MindHaven",
    "mental health",
    "therapy",
    "care seeker",
    "care provider",
    "appointments",
    "wellness",
    "counseling",
    "mobile health app",
  ],
  authors: [{ name: "MindHaven Team" }],
  creator: "MindHaven",
  publisher: "MindHaven",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  applicationName: "MindHaven",
  category: "Health & Wellness",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mind-haven.app/",
    siteName: "MindHaven",
    title: "MindHaven | Mental Wellness Companion",
    description:
      "MindHaven connects care seekers to trusted providers, simplifying onboarding, messaging, and appointment management.",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
