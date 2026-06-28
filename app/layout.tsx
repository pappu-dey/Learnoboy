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
import Script from "next/script";
import { cookies } from "next/headers";

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
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-DVZ3QSS5YW";

  const cookieStore = await cookies();
  const consentCookie = cookieStore.get("lb_cookie_consent");
  let analyticsAllowed = false;
  let marketingAllowed = false;
  if (consentCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(consentCookie.value));
      analyticsAllowed = !!parsed.analytics;
      marketingAllowed = !!parsed.marketing;
    } catch (e) {
      // ignore
    }
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {}
        <ThemeScript />

        {}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'analytics_storage': '${analyticsAllowed ? "granted" : "denied"}',
                'ad_storage': '${marketingAllowed ? "granted" : "denied"}',
                'ad_user_data': '${marketingAllowed ? "granted" : "denied"}',
                'ad_personalization': '${marketingAllowed ? "granted" : "denied"}'
              });
            `,
          }}
        />

        {}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
        </Script>
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

