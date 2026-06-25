import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from '@/lib/config';
import { OG_IMAGE_URL } from '@/lib/images';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EMAS Boutique",
  description: "Vestidos, blusas, pantalones, bolsos y más. Envíos a toda Guatemala.",
  openGraph: {
    title: "EMAS Boutique",
    description: "Vestidos, blusas, pantalones, bolsos y accesorios. Envíos a toda Guatemala.",
    url: SITE_URL,
    siteName: "EMAS Boutique",
    locale: "es_GT",
    type: "website",
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@emasboutique",
    title: "EMAS Boutique",
    description: "Vestidos, blusas, pantalones, bolsos y accesorios. Envíos a toda Guatemala.",
    images: [OG_IMAGE_URL],
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
      <body className="min-h-full flex flex-col bg-white text-black">
        {children}
      </body>
    </html>
  );
}
