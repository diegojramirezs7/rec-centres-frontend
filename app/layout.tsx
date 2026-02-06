import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { NavigationHeader } from "./components/NavigationHeader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Community Centres | Third Places Vancouver",
    template: "%s | Third Places Vancouver",
  },
  description:
    "Discover activities and programs across Vancouver's community centres.",
  keywords: [
    "Vancouver",
    "community centres",
    "recreation",
    "activities",
    "programs",
    "third places",
    "soccer",
    "basketball",
    "swimming",
    "fitness",
    "yoga",
    "tennis",
    "arts and crafts",
    "dance",
  ],
  authors: [{ name: "Third Places Vancouver" }],
  creator: "Third Places Vancouver",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Third Places Vancouver",
    title: "Community Centres | Third Places Vancouver",
    description:
      "Discover activities and programs across Vancouver's community centres.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Centres | Third Places Vancouver",
    description:
      "Discover activities and programs across Vancouver's community centres.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${geistMono.variable} antialiased`}
      >
        <NavigationHeader />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
