import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const commitMono = localFont({
  src: [
    {
      path: "./../../public/fonts/commit-mono-latin-200-normal.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./../../public/fonts/commit-mono-latin-200-italic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "./../../public/fonts/commit-mono-latin-300-normal.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./../../public/fonts/commit-mono-latin-300-italic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "./../../public/fonts/commit-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./../../public/fonts/commit-mono-latin-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./../../public/fonts/commit-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./../../public/fonts/commit-mono-latin-500-italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./../../public/fonts/commit-mono-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./../../public/fonts/commit-mono-latin-600-italic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "./../../public/fonts/commit-mono-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./../../public/fonts/commit-mono-latin-700-italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-commit-mono",
});

export const metadata: Metadata = {
  title: "EmiStla",
  description: "Welcome to this world. Enjoy your stay.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${commitMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
