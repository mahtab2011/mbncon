"use client";

import { ReactNode } from "react";

interface TracingLayoutProps {
  children: ReactNode;
}

export default function TracingLayout({
  children,
}: TracingLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-[1800px] p-6">
        {children}
      </div>
    </main>
  );
}