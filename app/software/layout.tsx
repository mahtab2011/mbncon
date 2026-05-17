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
      <div className="min-h-screen bg-neutral-50">
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex min-h-screen min-w-0 flex-1 flex-col">
            <Topbar />

            <main className="flex-1 overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
}