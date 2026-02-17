import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jgec-pune-chapter.onrender.com"),
  title: {
    default: "JGEC Alumni Association Pune | Jalpaiguri Government Engineering College",
    template: "%s | JGEC Alumni Pune",
  },
  description: "Official website of JGEC Alumni Association Pune Chapter. Connect with fellow graduates, attend events, and grow your professional network.",
  keywords: ["JGEC", "Alumni", "Pune", "Jalpaiguri Government Engineering College", "Engineering", "Community", "Networking"],
  authors: [{ name: "JGEC Alumni Association Pune" }],
  creator: "JGEC Alumni Association Pune",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jgec-pune-chapter.onrender.com",
    title: "JGEC Alumni Association Pune Chapter",
    description: "Official community for JGEC alumni in Pune. Join us to network, mentor, and give back.",
    siteName: "JGEC Alumni Pune",
  },
  twitter: {
    card: "summary_large_image",
    title: "JGEC Alumni Association Pune",
    description: "Official community for JGEC alumni in Pune.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Providers>
          {children}
          <Toaster />
          <Sonner />
        </Providers>
      </body>
    </html>
  );
}
