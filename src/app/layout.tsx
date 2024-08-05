import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "~/components/Header";
import { Container } from "~/components/primitives/container";
import { ProgressBar } from "~/components/primitives/ProgressBar";
import { ReduxProvider } from "~/store/provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SolarPunk Help Center",
  description:
    "Get answers to all your solar energy questions with SolarPunk's AI-powered Help Center.",
  openGraph: {
    title: "SolarPunk Help Center - Your Solar Questions Answered",
    description:
      "Explore solar energy solutions and get expert answers with SolarPunk's AI-powered Help Center.",
    siteName: "SolarPunk",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SolarPunk Help Center - Your Solar Questions Answered",
    description:
      "Explore solar energy solutions and get expert answers with SolarPunk's AI-powered Help Center.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReduxProvider>
        <body className={inter.className}>
          <Container className="min-h-screen">
            <Header />
            {children}
          </Container>
          <ProgressBar />
        </body>
      </ReduxProvider>
    </html>
  );
}
