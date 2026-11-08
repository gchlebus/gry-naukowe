import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Kaczy Kod — małe kroki, wielkie odkrycia",
  description:
    "Pierwsze programy, wspólne przygody i Microduck. Polska pracownia programowania dla dzieci od 7 lat.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
