export const nutrition = {
  dataQuality: "partial" as const,
  // Illustrative rollup only — not a new nutrient list. See `nutritionHistory` below
  // for the day-by-day protein figures this average is derived from.
  weeklyAverageProteinG: 45,
  today: [
    { nutrient: "Protein", value: "48g", status: "on-track" as const, source: "USDA FDC" },
    { nutrient: "Fibre", value: "22g", status: "on-track" as const, source: "USDA FDC" },
    { nutrient: "Iron", value: null, status: "low" as const, source: "USDA FDC" },
    { nutrient: "Calcium", value: "610mg", status: "on-track" as const, source: "USDA FDC" },
    { nutrient: "Vitamin B12", value: null, status: "unavailable" as const, source: null },
    { nutrient: "Vitamin D", value: null, status: "unavailable" as const, source: null },
    { nutrient: "Zinc", value: "6.1mg", status: "low" as const, source: "USDA FDC" },
    { nutrient: "Omega-3", value: null, status: "unavailable" as const, source: null },
    { nutrient: "Iodine", value: null, status: "unavailable" as const, source: null },
  ],
};

// Synthetic demo data — for a future weekly-trend screen. Not wired into any
// page yet; `nutrition.today` above remains the source of truth for the
// current nutrition screen and is left untouched.
export type NutritionDay = {
  date: string; // "YYYY-MM-DD"
  entries: {
    nutrient: string;
    value: string | null;
    status: "on-track" | "low" | "unavailable";
    source: string | null;
  }[];
};

export const nutritionHistory: NutritionDay[] = [
  {
    date: "2026-09-16",
    entries: [
      { nutrient: "Protein", value: "39g", status: "low", source: "USDA FDC" },
      { nutrient: "Fibre", value: "19g", status: "on-track", source: "USDA FDC" },
      { nutrient: "Iron", value: null, status: "low", source: "USDA FDC" },
      { nutrient: "Calcium", value: "470mg", status: "low", source: "USDA FDC" },
      { nutrient: "Vitamin B12", value: null, status: "unavailable", source: null },
      { nutrient: "Vitamin D", value: null, status: "unavailable", source: null },
      { nutrient: "Zinc", value: "5.9mg", status: "low", source: "USDA FDC" },
      { nutrient: "Omega-3", value: null, status: "unavailable", source: null },
      { nutrient: "Iodine", value: null, status: "unavailable", source: null },
    ],
  },
  {
    date: "2026-09-17",
    entries: [
      { nutrient: "Protein", value: "50g", status: "on-track", source: "USDA FDC" },
      { nutrient: "Fibre", value: "15g", status: "low", source: "USDA FDC" },
      { nutrient: "Iron", value: null, status: "low", source: "USDA FDC" },
      { nutrient: "Calcium", value: "600mg", status: "on-track", source: "USDA FDC" },
      { nutrient: "Vitamin B12", value: null, status: "unavailable", source: null },
      { nutrient: "Vitamin D", value: null, status: "unavailable", source: null },
      { nutrient: "Zinc", value: "7.0mg", status: "on-track", source: "USDA FDC" },
      // Flaxseed logged this day — plant ALA omega-3 is one of the rare cases
      // USDA FDC can actually compute from a vegetarian log.
      { nutrient: "Omega-3", value: "1.1g", status: "on-track", source: "USDA FDC" },
      { nutrient: "Iodine", value: null, status: "unavailable", source: null },
    ],
  },
  {
    date: "2026-09-18",
    entries: [
      { nutrient: "Protein", value: "41g", status: "low", source: "USDA FDC" },
      { nutrient: "Fibre", value: "20g", status: "on-track", source: "USDA FDC" },
      { nutrient: "Iron", value: "9mg", status: "on-track", source: "USDA FDC" },
      { nutrient: "Calcium", value: "540mg", status: "on-track", source: "USDA FDC" },
      { nutrient: "Vitamin B12", value: null, status: "unavailable", source: null },
      { nutrient: "Vitamin D", value: null, status: "unavailable", source: null },
      { nutrient: "Zinc", value: null, status: "low", source: "USDA FDC" },
      { nutrient: "Omega-3", value: null, status: "unavailable", source: null },
      { nutrient: "Iodine", value: null, status: "unavailable", source: null },
    ],
  },
  {
    date: "2026-09-19",
    entries: [
      // Paneer Bhurji Wrap logged for lunch — dairy pushes calcium on-track.
      { nutrient: "Protein", value: "44g", status: "on-track", source: "USDA FDC" },
      { nutrient: "Fibre", value: "17g", status: "on-track", source: "USDA FDC" },
      { nutrient: "Iron", value: null, status: "low", source: "USDA FDC" },
      { nutrient: "Calcium", value: "580mg", status: "on-track", source: "USDA FDC" },
      { nutrient: "Vitamin B12", value: null, status: "unavailable", source: null },
      { nutrient: "Vitamin D", value: null, status: "unavailable", source: null },
      { nutrient: "Zinc", value: "6.8mg", status: "low", source: "USDA FDC" },
      { nutrient: "Omega-3", value: null, status: "unavailable", source: null },
      // Iodised salt on a packaged item logged this day.
      { nutrient: "Iodine", value: "90mcg", status: "on-track", source: "USDA FDC" },
    ],
  },
  {
    date: "2026-09-20",
    entries: [
      // Vegan day (Millet Sambar Combo) — no dairy logged, calcium and
      // protein both dip.
      { nutrient: "Protein", value: "38g", status: "low", source: "USDA FDC" },
      { nutrient: "Fibre", value: "25g", status: "on-track", source: "USDA FDC" },
      { nutrient: "Iron", value: null, status: "low", source: "USDA FDC" },
      { nutrient: "Calcium", value: null, status: "low", source: "USDA FDC" },
      { nutrient: "Vitamin B12", value: null, status: "unavailable", source: null },
      { nutrient: "Vitamin D", value: null, status: "unavailable", source: null },
      { nutrient: "Zinc", value: "5.4mg", status: "low", source: "USDA FDC" },
      { nutrient: "Omega-3", value: null, status: "unavailable", source: null },
      { nutrient: "Iodine", value: null, status: "unavailable", source: null },
    ],
  },
  {
    date: "2026-09-21",
    entries: [
      // Chicken curry at a family lunch (logged as a barrier, not a choice)
      // plus a soya dinner — the meat brings iron/zinc/B12 into range for
      // once, which USDA FDC can actually compute from animal-source data.
      { nutrient: "Protein", value: "55g", status: "on-track", source: "USDA FDC" },
      { nutrient: "Fibre", value: "18g", status: "on-track", source: "USDA FDC" },
      { nutrient: "Iron", value: "14mg", status: "on-track", source: "USDA FDC" },
      { nutrient: "Calcium", value: "420mg", status: "low", source: "USDA FDC" },
      { nutrient: "Vitamin B12", value: "1.8mcg", status: "on-track", source: "USDA FDC" },
      { nutrient: "Vitamin D", value: null, status: "unavailable", source: null },
      { nutrient: "Zinc", value: "8.2mg", status: "on-track", source: "USDA FDC" },
      { nutrient: "Omega-3", value: null, status: "unavailable", source: null },
      { nutrient: "Iodine", value: null, status: "unavailable", source: null },
    ],
  },
  {
    // Most recent day — mirrors `nutrition.today` exactly for consistency.
    date: "2026-09-22",
    entries: [
      { nutrient: "Protein", value: "48g", status: "on-track", source: "USDA FDC" },
      { nutrient: "Fibre", value: "22g", status: "on-track", source: "USDA FDC" },
      { nutrient: "Iron", value: null, status: "low", source: "USDA FDC" },
      { nutrient: "Calcium", value: "610mg", status: "on-track", source: "USDA FDC" },
      { nutrient: "Vitamin B12", value: null, status: "unavailable", source: null },
      { nutrient: "Vitamin D", value: null, status: "unavailable", source: null },
      { nutrient: "Zinc", value: "6.1mg", status: "low", source: "USDA FDC" },
      { nutrient: "Omega-3", value: null, status: "unavailable", source: null },
      { nutrient: "Iodine", value: null, status: "unavailable", source: null },
    ],
  },
];
