import type { Metadata } from "next";
import { Archivo, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeScript } from "@/components/ThemeScript";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gcis.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GCIS — An index of what you're actually eligible for",
    template: "%s · GCIS",
  },
  description:
    "A verified index of research, volunteering, internships and sponsorship-friendly roles for international students in the U.S. on H4 and F1 status.",
  openGraph: {
    title: "GCIS — An index of what you're actually eligible for",
    description:
      "Opportunities filtered by what your visa actually permits. Built for H4 and F1 students.",
    type: "website",
    siteName: "GCIS",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${archivo.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeScript />
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
