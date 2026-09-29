import type { Metadata } from "next";
import "./globals.css";
import { getSettings, googleFontsUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Moka Joy — Fidélité",
  description: "Programme de fidélité Moka Joy, Agadir. Scannez, collectionnez, savourez.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();
  const fontsHref = googleFontsUrl(settings.displayFont, settings.bodyFont);

  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontsHref} rel="stylesheet" />
      </head>
      <body
        style={
          {
            ["--primary" as string]: settings.primaryColor,
            ["--accent" as string]: settings.accentColor,
            ["--display" as string]: `"${settings.displayFont}", Georgia, serif`,
            ["--body" as string]: `"${settings.bodyFont}", system-ui, sans-serif`,
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
