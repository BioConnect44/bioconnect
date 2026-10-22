import StructuredData from '@/components/StructuredData';
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ToastProvider } from "@/components/ToastProvider";
import CookieConsent from "@/components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bio-connect-lake.vercel.app";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "BioConnect — India's Biotech Academic Platform",
    template: "%s | BioConnect",
  },
  description: "Connect with biotech students, educators, and researchers. Access 250+ pages of curriculum study notes, PubMed research papers, and biotech jobs across India.",
  keywords: ["biotech", "biotechnology", "students", "India", "research papers", "learning", "education", "bioconnect", "bioinformatics", "genomics"],
  authors: [{ name: "BioConnect Team" }],
  creator: "BioConnect",
  publisher: "BioConnect",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BioConnect — India's Premier Biotech Academic Platform",
    description: "Curated biotechnology study notes, PubMed literature exploration, challenges, and career opportunities.",
    url: BASE_URL,
    siteName: "BioConnect",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BioConnect — India's Biotech Academic Platform",
    description: "Curated biotechnology study notes, PubMed literature exploration, challenges, and career opportunities.",
    creator: "@bioconnect",
  },
  verification: {
    google: "Y3o-21u1yXCA2Z1Le9k_aVWaaTebhOt_XrCIYww4-vo",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>
        <StructuredData />
        <ToastProvider>
          {children}
          <CookieConsent />
        </ToastProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
