import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Kucykowa Poczta — małe palce, wielkie listy",
  description:
    "Nauka pisania na klawiaturze z kucykami. Kolorowe palce, krótkie trasy, dokładność i Twój własny rytm.",
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
