import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://jgec-pune-chapter.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default:
      "Alumni Association Jalpaiguri Government Engineering College | Jalpaiguri Government Engineering College",
    template:
      "%s | Alumni Association Jalpaiguri Government Engineering College",
  },
  description:
    "Official website of Alumni Association Jalpaiguri Government Engineering College Pune Chapter. Connect with fellow graduates, attend events, and grow your professional network.",
  keywords: [
    "JGEC",
    "Alumni",
    "Pune",
    "Jalpaiguri Government Engineering College",
    "Engineering",
    "Community",
    "Networking",
  ],
  authors: [
    { name: "Alumni Association Jalpaiguri Government Engineering College" },
  ],
  creator: "Alumni Association Jalpaiguri Government Engineering College",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.jpg",
    apple: "/apple-icon.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title:
      "Alumni Association Jalpaiguri Government Engineering College Pune Chapter",
    description:
      "Official community for Alumni Association Jalpaiguri Government Engineering College alumni in Pune. Join us to network, mentor, and give back.",
    siteName: "Alumni Association Jalpaiguri Government Engineering College",
    images: ["/icon.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alumni Association Jalpaiguri Government Engineering College",
    description:
      "Official community for Alumni Association Jalpaiguri Government Engineering College alumni in Pune.",
    images: ["/icon.jpg"],
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GHPQCVYV38"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GHPQCVYV38');
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          {children}
          <Toaster />
          <Sonner />
        </Providers>
      </body>
    </html>
  );
}
