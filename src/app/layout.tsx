import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const robotoMono = localFont({
  src: "./fonts/Roboto_Mono/RobotoMono-VariableFont_wght.ttf",
  variable: "--font-roboto-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BudgetByte",
  description: "The Next Big Thing: BudgetByte!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${robotoMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
