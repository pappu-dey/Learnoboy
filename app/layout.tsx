import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getDefaultMetadata } from "@/lib/utils/seo";
import { getSession } from "@/lib/auth/session";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = getDefaultMetadata();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Theme init — runs before paint to prevent dark/light flash */}
        <ThemeScript />
      </head>
      <body style={{ fontFamily: "var(--font-inter, var(--font-sans))" }} suppressHydrationWarning>
        <Header session={session} />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}

