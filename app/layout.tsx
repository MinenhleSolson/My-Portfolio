import type { Metadata } from "next";
import { Raleway } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "./provider";

const raleway = Raleway({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "Minenhle's Portfolio",
  description: "Modern & Minimal Portfolio - Full-Stack Developer based in South Africa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
      </head>
      <body className={`${raleway.className} ${raleway.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
