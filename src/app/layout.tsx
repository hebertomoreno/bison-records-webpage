import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "../styles/globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bison Records",
  description: "Independent record label",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cormorant.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
