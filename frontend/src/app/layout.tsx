

import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  title: "Spot Reserve | Frontend Preview",
  description: "Protótipo Next.js baseado no backend Spot Reserve",
};

export default function RootLayout({ children } : { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <Providers >
          {children}
        </Providers >
      </body>
    </html>
  )
}
