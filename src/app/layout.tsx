import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "A2Z Bakerie | Handcrafted Baked Goods in Cincinnati",
  description:
    "A2Z Bakerie — handcrafted, made-to-order baked goods in Cincinnati, OH. Bagels, mini cheesecakes, cookies, cinnamon rolls and more. Baked fresh with love by Ann.",
  keywords:
    "A2Z Bakerie, Cincinnati bakery, homemade baked goods, made to order bakery, bagels Cincinnati, cheesecakes, cinnamon rolls, cupcakes, cookie cake, custom cakes, home bakery Cincinnati",
  authors: [{ name: "A2Z Bakerie" }],
  robots: "index, follow",
  metadataBase: new URL("https://a2zbakerie.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://a2zbakerie.com/",
    title: "A2Z Bakerie | Handcrafted Baked Goods in Cincinnati",
    description:
      "Handcrafted, made-to-order baked goods in Cincinnati. Bagels, cheesecakes, cinnamon rolls, cookies & more — baked fresh with love by Ann.",
    images: [
      {
        url: "https://a2zbakerie.com/images/og-share.png",
        width: 1200,
        height: 630,
        alt: "A2Z Bakerie — Where Science Meets Soul — Handcrafted baked goods in Cincinnati",
      },
    ],
    locale: "en_US",
    siteName: "A2Z Bakerie",
  },
  twitter: {
    card: "summary_large_image",
    title: "A2Z Bakerie | Handcrafted Baked Goods in Cincinnati",
    description:
      "Handcrafted, made-to-order baked goods in Cincinnati. Bagels, cheesecakes, cinnamon rolls, cookies & more — baked fresh with love.",
    images: [
      {
        url: "https://a2zbakerie.com/images/og-share.png",
        alt: "A2Z Bakerie — Where Science Meets Soul — Handcrafted baked goods in Cincinnati",
      },
    ],
  },
  icons: {
    icon: "/images/logo.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "A2Z Bakerie",
  description: "Handcrafted, made-to-order baked goods in Cincinnati.",
  url: "https://a2zbakerie.com",
  logo: "https://a2zbakerie.com/images/logo.png",
  image: "https://a2zbakerie.com/images/og-share.png",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cincinnati",
    addressRegion: "OH",
    addressCountry: "US",
  },
  areaServed: { "@type": "City", name: "Cincinnati" },
  priceRange: "$",
  servesCuisine: "Baked Goods",
  sameAs: ["https://www.instagram.com/a2z_baker.ie/"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${cormorantGaramond.variable} ${outfit.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
