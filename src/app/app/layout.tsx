import type { ReactNode } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { BottomNav } from "@/components/ui/BottomNav";
import { Sidebar } from "@/components/ui/Sidebar";

// Phone/tablet: top header + bottom tab bar. Desktop (lg): persistent sidebar.
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-16">
        <AppHeader />
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
