import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./blog.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: {
    default: "Plan Your Park | Orlando Theme Park Planning Guide",
    template: "%s | Plan Your Park",
  },
  description: "Your ultimate guide to Orlando theme parks - Disney World, Universal, SeaWorld, LEGOLAND & more!",
  keywords: ["Orlando theme parks", "Disney World", "Universal Orlando", "SeaWorld", "theme park planning", "Orlando vacation"],
  openGraph: {
    title: "Plan Your Park | Orlando Theme Park Planning Guide",
    description: "Your ultimate guide to Orlando theme parks",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <Header />
        <main className="main-content">
          {children}
        </main>
        <Footer />
        
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
