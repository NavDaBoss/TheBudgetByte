import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

// const robotoMono = localFont({
//   src: './fonts/Roboto_Mono/RobotoMono-VariableFont_wght.ttf',
//   variable: '--font-roboto-mono',
//   weight: '100 900',
// });

export const metadata: Metadata = {
  title: 'BudgetByte',
  description: 'The Next Big Thing: BudgetByte!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
