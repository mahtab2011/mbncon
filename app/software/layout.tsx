import type { ReactNode } from "react";
import Sidebar from "@/components/software/Sidebar";
import Topbar from "@/components/software/Topbar";
import { LanguageProvider } from "@/components/software/LanguageProvider";

export default function SoftwareLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
  <LanguageProvider>
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />

        <div className="flex-1">{children}</div>
      </div>
        </div>
  </LanguageProvider>
  );
}