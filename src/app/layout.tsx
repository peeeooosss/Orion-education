import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Orion Education - Your Scholarship, Assured",
  description: "Orion Education turns intent into admissions. Check your assured scholarship, compare ROI, and let a counsellor do the rest.",
  keywords: ["orion education", "scholarship checker", "college admissions", "ROI calculator", "education counselling"],
  authors: [{ name: "Orion Education" }],
  creator: "Orion Education",
  publisher: "Orion Education",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Orion Education - Your Scholarship, Assured",
    description: "Check your assured scholarship and let Orion's counsellors get you admitted.",
    siteName: "Orion Education",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface-50 text-surface-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
