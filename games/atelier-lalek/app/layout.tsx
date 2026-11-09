import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atelier Lalek — Twoja lalka, Twoje pomysły",
  description:
    "Kreatywny salon lalek: fryzury, kolorowe włosy, makijaż, paznokcie, ubrania i własny album stylizacji.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
