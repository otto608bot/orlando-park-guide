import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./blog.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiltersProvider } from "@/context/FiltersContext";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: {
    default: "Plan Your Park | Orlando Theme Park Planning Guide",
    template: "%s | Plan Your Park",
  },
  description: "Your ultimate guide to Orlando theme parks - Disney World, Universal, SeaWorld, LEGOLAND & more!",
  keywords: ["Orlando theme parks", "Disney World", "Universal Orlando", "SeaWorld", "theme park planning", "Orlando vacation"],
  alternates: {
    canonical: "https://planyourpark.com",
  },
  openGraph: {
    title: "Plan Your Park | Orlando Theme Park Planning Guide",
    description: "Your ultimate guide to Orlando theme parks",
    type: "website",
    locale: "en_US",
    url: "https://planyourpark.com",
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32' },
      { url: '/favicon-64x64.png', sizes: '64x64' },
    ],
    apple: '/favicon-180x180.png',
  },
};

function FiltersLoader() {
  return (
    <div style={{ display: 'flex', gap: '2rem', maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ width: '280px', height: '400px', background: 'var(--bg-light)', borderRadius: '12px' }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: '200px', background: 'var(--bg-light)', borderRadius: '12px', marginBottom: '1rem' }} />
        <div style={{ height: '100px', background: 'var(--bg-light)', borderRadius: '12px' }} />
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Suspense fallback={<FiltersLoader />}>
          <FiltersProvider>
            <Header />
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </FiltersProvider>
        </Suspense>
        
        {/* Google Analytics */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-SJHPEWNBLS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SJHPEWNBLS');
          `}
        </Script>
      </body>
    </html>
  );
}
