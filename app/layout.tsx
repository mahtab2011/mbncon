import type { Metadata } from "next";
import "./globals.css";

import { LanguageProvider } from "@/components/software/LanguageProvider";

export const metadata: Metadata = {
  title: "MBNCON",
  description: "Manufacturing Intelligence Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}