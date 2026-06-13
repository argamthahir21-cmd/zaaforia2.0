import type { Metadata } from "next";
import { Playfair_Display, Outfit, Lora, Josefin_Sans, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const cormorant = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const jost = Outfit({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
  weight: ["300", "400", "500"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
  display: "swap",
  weight: ["300"],
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  variable: "--font-pinyon",
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Zaforia — Wear the Future. Own the Moment.",
  description:
    "Discover luxury women's fashion at Zaforia. Curated collections of premium haute couture, designed for the modern woman who embraces elegance.",
  keywords: [
    "luxury fashion", "women's clothing", "premium fashion",
    "boutique", "ethnic wear", "western wear", "Zaforia",
  ],
  openGraph: {
    title: "Zaforia — Wear the Future. Own the Moment.",
    description: "Discover luxury women's fashion at Zaforia. Curated collections of premium haute couture.",
    type: "website",
    locale: "en_IN",
    siteName: "Zaforia",
  },
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} ${lora.variable} ${josefin.variable} ${pinyon.variable}`}
    >
      <body>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}

