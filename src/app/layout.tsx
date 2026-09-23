import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "Veggie",
  description: "Eat less meat without losing satisfaction.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-paper text-ink antialiased">
        <aside aria-label="Prototype notice" className="bg-rust text-surface text-center py-1 text-[11px] font-mono tracking-wide">
          PROTOTYPE — demo data throughout, except Discover places, which are real (OpenStreetMap)
        </aside>
        {children}
      </body>
    </html>
  );
}
