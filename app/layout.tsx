import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/layout/NavigationWrapper";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "EcoEats - Reducing Hunger Through Technology",
  description: "EcoEats reduces hunger by connecting people who need food, food sources, and support partners through a transparent, accountable system. Supporting SDG 2: Zero Hunger.",
  keywords: "hunger, food security, SDG 2, zero hunger, food donation, meal vouchers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
