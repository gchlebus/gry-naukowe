import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Sklepik Kucyków — liczymy z radością",
  description:
    "Bajkowy sklepik do nauki dodawania, odejmowania, mnożenia i dzielenia. Trzy poziomy, obrazkowe podpowiedzi i karty w pary.",
  icons: { icon: "/favicon.svg" },
};
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
