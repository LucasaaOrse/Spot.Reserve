import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spot Reserve | Frontend Preview",
  description: "Protótipo Next.js baseado no backend Spot Reserve",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
