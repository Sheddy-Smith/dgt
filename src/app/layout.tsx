import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DamagThings - India's Token-Based Marketplace for Damaged Items",
  description: "Buy and sell damaged, used, and repairable items on India's first token-based marketplace. Connect with genuine buyers and sellers securely.",
  keywords: ["DamagThings", "damaged items", "used goods", "repairable", "marketplace", "India", "token-based", "OLX alternative"],
  authors: [{ name: "DamagThings Team" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
  },
  openGraph: {
    title: "DamagThings - Token-Based Marketplace",
    description: "India's first token-based marketplace for damaged, used, and repairable items",
    url: "https://damagthings.com",
    siteName: "DamagThings",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DamagThings - Token-Based Marketplace",
    description: "Buy and sell damaged items securely with tokens",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
