import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GCIS — Opportunities that fit your visa",
  description:
    "Research, volunteering, internships and sponsorship-friendly roles matched to international students on H4 and F1 status.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="aurora" aria-hidden="true">
          <div className="aurora-ember" />
        </div>
        <div className="grain" aria-hidden="true" />
        <SiteNav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/5 mt-32">
          <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <p className="text-xs text-faint">
              GCIS — Global Career Insight System
            </p>
            <p className="text-xs text-faint max-w-md sm:text-right">
              Informational only. Not legal or immigration advice — confirm your
              work eligibility with your DSO or an immigration attorney.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
