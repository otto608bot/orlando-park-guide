import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Plan Your Park | Orlando Theme Park Planning Guide",
  description:
    "Your ultimate guide to Orlando theme parks - Disney World, Universal, SeaWorld & more!",
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon/favicon-64x64.png", sizes: "64x64" },
    ],
    apple: "/favicon/favicon-180x180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable}`}>
      <body className="min-h-full flex flex-col antialiased">
        {/* Client components handle all interactivity */}
        <Header />
        <MobileNav />

        {children}

        {/* Site Footer */}
        <footer className="site-footer">
          <p>
            &copy; {new Date().getFullYear()} PlanYourPark.com |{" "}
            <a href="/privacy-policy">Privacy Policy</a> | Affiliate links help
            support our site
          </p>
        </footer>
      </body>
    </html>
  );
}