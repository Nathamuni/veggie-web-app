import type { ReactNode } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { BottomNav } from "@/components/ui/BottomNav";
import { Sidebar } from "@/components/ui/Sidebar";
import { Toaster } from "@/components/ui/Toast";
import { PreviewPathNotice } from "@/components/ui/PreviewPathNotice";
import { requireOnboardedUser } from "@/lib/auth/session";

// Phone/tablet: top header + bottom tab bar. Desktop (lg): persistent sidebar.
export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireOnboardedUser();
  const name = user.displayName ?? user.email.split("@")[0];
  const { area, dietMode } = user.profile;
  return (
    <div className="flex flex-1 flex-col lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <Sidebar name={name} area={area} dietMode={dietMode} />
      <div className="flex min-w-0 flex-1 flex-col pb-24 lg:pb-16">
        <PreviewPathNotice />
        <AppHeader name={name} area={area} dietMode={dietMode} />
        {children}
      </div>
      <BottomNav />
      <Toaster />
    </div>
  );
}
