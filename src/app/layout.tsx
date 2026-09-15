import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/seo";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Orion Education - Your Scholarship, Assured",
  description: "Orion Education turns intent into admissions. Check your assured scholarship, compare ROI, and let a counsellor do the rest.",
  keywords: ["orion education", "scholarship checker", "college admissions", "mba colleges bangalore", "pgdm india", "roi calculator", "education counselling"],
  authors: [{ name: "Orion Education" }],
  creator: "Orion Education",
  publisher: "Orion Education",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    title: "Orion Education - Your Scholarship, Assured",
    description: "Check your assured scholarship and let Orion's counsellors get you admitted.",
    siteName: "Orion Education",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Orion Education",
  url: SITE_URL,
  description:
    "Orion Education helps students find, compare and get admitted to MBA, PGDM, B.Tech and BBA colleges in India, with scholarships up to ₹30,000 at partner colleges.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Orion Education",
  url: SITE_URL,
  description:
    "College finder, scholarship checker and admission guides for MBA and PGDM students in India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface-50 text-surface-900 font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
