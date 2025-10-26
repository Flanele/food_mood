import type { Metadata } from "next";
import { Quantico, Roboto } from "next/font/google";
import "./globals.css";
import { AppProviders } from "../src/app/app-providers";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const quantico = Quantico({
  variable: "--font-quantico",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Food Mood",
  description: "Nutritional analysis of recipes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link data-rh="true" rel="icon" href="/assets/logo-ico.svg" />
      </head>
      <body className={`${roboto.variable} ${quantico.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
