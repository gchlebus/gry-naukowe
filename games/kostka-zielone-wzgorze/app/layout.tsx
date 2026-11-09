import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kostka z Zielonego Wzgórza",
  description:
    "Ułóż swoją prawdziwą kostkę 3×3 z Anią. Osiem małych kroków, animowane ruchy i ogród cierpliwości.",
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
