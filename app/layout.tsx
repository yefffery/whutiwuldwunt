import {businessDigest} from '@/lib/quoted-config';
import {themeInitializationScript} from "@/lib/theme-preference";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getPublishedContent } from "@/lib/content-server";
import { themeStyle } from "@/lib/site-content";
import { SiteTextProvider } from "./site-text";
import { Header, Footer } from "./site-shell";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#141615",
};

export const metadata: Metadata = {
  title: { default: "Whut I Wuld Wunt | San Francisco", template: "%s | WIWW" },
  description: "Whut i wuld wunt: care expressed through action. Explore our work and our standard, starting with mobile vehicle care in San Francisco and the Bay Area.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content=await getPublishedContent();
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html:themeInitializationScript}}/></head>

      <body className="antialiased" style={themeStyle(content)}><SiteTextProvider content={content} businessVersion={await businessDigest(content.business)}><a href="#main" className="skip">Skip to content</a><Header copy={content.copy} logoId={content.images.logoId}/><main id="main">{children}</main><Footer copy={content.copy}/></SiteTextProvider></body>
    </html>
  );
}
