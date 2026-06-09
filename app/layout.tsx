import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/contexts/i18n";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CIELO — The Space Completed",
  description:
    "CIELO is a luxury maison. We do not sell art. We complete spaces — through large-scale works of extraordinary presence, each produced in an edition of three.",
  openGraph: {
    title: "CIELO",
    description: "The space completed.",
    type: "website",
    locale: "ja_JP",
  },
  robots: { index: true, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${cormorant.variable} ${inter.variable}`}>
      <body
        style={{ backgroundColor: "var(--cielo-dark-1)", color: "var(--cielo-white)" }}
        className="antialiased min-h-screen"
      >
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
