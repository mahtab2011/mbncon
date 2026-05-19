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
      <div className="min-h-screen bg-neutral-100 text-neutral-950">
        <div className="flex min-h-screen overflow-hidden">
          <aside className="shrink-0">
            <Sidebar />
          </aside>

          <div className="flex min-h-screen min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
              <Topbar />
            </header>

            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              <div className="mx-auto w-full max-w-[1920px] px-4 py-6 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
}