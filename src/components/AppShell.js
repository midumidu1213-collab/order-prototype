"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isCatalogue = pathname?.startsWith("/catalogue");

  if (isCatalogue) {
    return (
      <div className="w-full min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f4f7f6]">
          {children}
        </main>
      </div>
    </div>
  );
}
