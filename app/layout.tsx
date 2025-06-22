import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { fontSans, fontDroog } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <link href="https://use.typekit.net/ptt5ipe.css" rel="stylesheet" />
      </head>
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
          fontDroog.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col min-h-screen">
            <div
              className="flex-1"
              style={{
                backgroundImage: "url('/Green-plastic-background.png')",
                backgroundSize: "100% 400px",
                backgroundPosition: "top",
                backgroundRepeat: "no-repeat",
              }}
            >
              <Navbar />
              <main className="container mx-auto max-w-7xl pt-16 px-6">
                {children}
              </main>
            </div>
            <footer className="w-full flex items-center justify-center py-3 mt-auto">
              <p className="text-primary">besteman</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
