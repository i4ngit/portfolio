import type { Metadata } from "next";
import { Inter, Merriweather, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-merriweather",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ian Ocampo — Premed Student & Researcher",
    template: "%s | Ian Ocampo",
  },
  description:
    "Portfolio of Ian Ocampo — premed student, clinical research associate, and aspiring physician-scientist.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ian Ocampo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${merriweather.variable} ${playfair.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
