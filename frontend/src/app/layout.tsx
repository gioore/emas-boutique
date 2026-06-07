import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = 'https://emasboutique.com';

export const metadata: Metadata = {
  title: "EMAS Boutique - Mercadería importada 100% original",
  description: "Descubre nuestra colección importada. Vestidos, blusas, pantalones, bolsos y más. Envíos a toda Guatemala.",
  openGraph: {
    title: "EMAS Boutique - Mercadería importada 100% original",
    description: "Vestidos, blusas, pantalones, bolsos y accesorios importados. Envíos a toda Guatemala.",
    url: BASE_URL,
    siteName: "EMAS Boutique",
    locale: "es_GT",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#faf7f2] text-[#1c1917]">
        {children}
      </body>
    </html>
  );
}
