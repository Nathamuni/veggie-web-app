"use client";

import { usePathname } from "next/navigation";
import { PreviewNotice } from "./PreviewNotice";

// App screens that still run on sample data. Remove a prefix once its screen is live.
const PREVIEW_PREFIXES = [
  "/app/transition",
  "/app/meal-plan",
  "/app/pantry",
  "/app/shopping-list",
  "/app/learn",
  "/app/assistant",
  "/app/impact",
  "/app/nutrition",
  "/app/complete-meal",
  "/app/combos",
  "/app/dishes",
  "/app/restaurants",
];

export function PreviewPathNotice() {
  const pathname = usePathname() ?? "";
  return PREVIEW_PREFIXES.some((p) => pathname.startsWith(p)) ? <PreviewNotice /> : null;
}
