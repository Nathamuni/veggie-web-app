/**
 * Synthetic demo data for the operator-facing (partner + admin) prototype
 * screens only. Nothing here is real — see PRODUCT.md: "Everything shown in
 * the current prototype is placeholder content and must be labelled as
 * such." Not re-exported from ./index.ts; import directly from
 * "@/lib/fixtures/operations" until the barrel is wired up.
 *
 * Rules for this file:
 * - Listings use generic "Sample …" names, never a real business or brand.
 * - People are referred to only by synthetic ids (e.g. "user-7f3a"), never
 *   by a name or email.
 * - Every number is a placeholder. Nutrition values are synthetic and
 *   labelled; missing values are `null` and render as "data unavailable".
 * - No animal-impact reference factor numbers exist — they are pending
 *   legal review and must never be invented here.
 */

import type { DietMode } from "./types";

/* ------------------------------------------------------------------ */
/* Listings (places)                                                   */
/* ------------------------------------------------------------------ */

export type ListingClassification = "pure_veg" | "vegan" | "veg_friendly" | "mixed" | "unverified";

export const classificationLabels: Record<ListingClassification, string> = {
  pure_veg: "Pure veg",
  vegan: "Vegan",
  veg_friendly: "Veg friendly",
  mixed: "Mixed",
  unverified: "Unverified",
};

export type OpsListing = {
  id: string;
  name: string;
  area: string;
  classification: ListingClassification;
  status: "live" | "pending_review" | "suspended" | "merged";
  source: "partner-claimed" | "osm-import" | "user-submitted";
  /** Set when the system suspects this listing duplicates another. */
  duplicateOfId?: string;
};

export const opsListings: OpsListing[] = [
  {
    id: "ops-l-01",
    name: "Sample Tiffin Room",
    area: "T. Nagar",
    // Serves one egg dish (see partnerMenu), so not pure_veg.
    classification: "veg_friendly",
    status: "live",
    source: "partner-claimed",
  },
  {
    id: "ops-l-02",
    name: "Sample Chettinad Mess",
    area: "T. Nagar",
    classification: "mixed",
    status: "live",
    source: "osm-import",
  },
  {
    id: "ops-l-03",
    name: "Sample Kerala Kitchen",
    area: "Alwarpet",
    classification: "veg_friendly",
    status: "live",
    source: "osm-import",
  },
  {
    id: "ops-l-04",
    name: "Sample Andhra Meals Hall",
    area: "Adyar",
    classification: "unverified",
    status: "pending_review",
    source: "user-submitted",
  },
  {
    id: "ops-l-05",
    name: "Sample Plant Bowl Counter",
    area: "Besant Nagar",
    classification: "vegan",
    status: "live",
    source: "osm-import",
  },
  {
    id: "ops-l-06",
    name: "Sample Tiffin Room (T Nagar)",
    area: "T. Nagar",
    classification: "unverified",
    status: "pending_review",
    source: "user-submitted",
    duplicateOfId: "ops-l-01",
  },
];

/* ------------------------------------------------------------------ */
/* Partner claims                                                      */
/* ------------------------------------------------------------------ */

export type ClaimStatus = "submitted" | "under_review" | "verified" | "rejected";

export type PartnerClaim = {
  id: string;
  listingId: string;
  /** Synthetic partner account id — never a person's name. */
  claimantId: string;
  status: ClaimStatus;
  submittedAt: string;
  proof: string;
};

/** The demo partner signed in to /partner. */
export const demoPartnerId = "partner-u-0142";

export const partnerClaims: PartnerClaim[] = [
  {
    id: "claim-0091",
    listingId: "ops-l-01",
    claimantId: demoPartnerId,
    status: "verified",
    submittedAt: "2026-08-02",
    proof: "Trade licence (placeholder document)",
  },
  {
    id: "claim-0104",
    listingId: "ops-l-02",
    claimantId: "partner-u-0187",
    status: "under_review",
    submittedAt: "2026-09-10",
    proof: "Utility bill (placeholder document)",
  },
  {
    id: "claim-0112",
    listingId: "ops-l-04",
    claimantId: "partner-u-0203",
    status: "submitted",
    submittedAt: "2026-09-18",
    proof: "Food safety registration (placeholder document)",
  },
  {
    id: "claim-0097",
    listingId: "ops-l-03",
    claimantId: "partner-u-0161",
    status: "rejected",
    submittedAt: "2026-08-28",
    proof: "Document did not match listing address (placeholder)",
  },
];

/* ------------------------------------------------------------------ */
/* Partner menu                                                        */
/* ------------------------------------------------------------------ */

/**
 * The declared diet base of a dish. Vegan and vegetarian are separate
 * values — never merged. "egg" means the dish contains egg (so it is
 * neither vegan nor, for most users, vegetarian).
 */
export type DishDietBase = "vegan" | "vegetarian" | "egg";

export type PartnerMenuItem = {
  id: string;
  listingId: string;
  name: string;
  /** Synthetic placeholder price; null when the owner has not declared one. */
  priceRupees: number | null;
  dietBase: DishDietBase;
  containsDairy: boolean;
  jainAvailable: boolean;
  photoCount: number;
};

export const partnerMenu: PartnerMenuItem[] = [
  {
    id: "pm-01",
    listingId: "ops-l-01",
    name: "Ven Pongal with gothsu",
    priceRupees: 90,
    dietBase: "vegetarian",
    containsDairy: true,
    jainAvailable: false,
    photoCount: 0,
  },
  {
    id: "pm-02",
    listingId: "ops-l-01",
    name: "Idiyappam with vegetable stew",
    priceRupees: 110,
    dietBase: "vegan",
    containsDairy: false,
    jainAvailable: false,
    photoCount: 1,
  },
  {
    id: "pm-03",
    listingId: "ops-l-01",
    name: "Plain dosa with sambar",
    priceRupees: 70,
    dietBase: "vegan",
    containsDairy: false,
    jainAvailable: true,
    photoCount: 0,
  },
  {
    id: "pm-04",
    listingId: "ops-l-01",
    name: "Paneer butter masala",
    priceRupees: null,
    dietBase: "vegetarian",
    containsDairy: true,
    jainAvailable: true,
    photoCount: 0,
  },
  {
    id: "pm-05",
    listingId: "ops-l-01",
    name: "Egg kothu parotta",
    priceRupees: 130,
    dietBase: "egg",
    containsDairy: false,
    jainAvailable: false,
    photoCount: 0,
  },
];

export type KitchenDeclarations = {
  separateUtensils: boolean;
  sharedFryer: boolean;
  jainKitchenAvailable: boolean;
};

export const partnerKitchen: KitchenDeclarations = {
  separateUtensils: true,
  sharedFryer: false,
  jainKitchenAvailable: true,
};

/* ------------------------------------------------------------------ */
/* Correction requests, ratings, analytics (partner-facing)            */
/* ------------------------------------------------------------------ */

export type CorrectionRequest = {
  id: string;
  listingId: string;
  subject: string;
  /** Synthetic reporter id — never a person's name. */
  reporterId: string;
  message: string;
  receivedAt: string;
};

export const correctionRequests: CorrectionRequest[] = [
  {
    id: "corr-0311",
    listingId: "ops-l-01",
    subject: "Idiyappam with vegetable stew",
    reporterId: "user-7f3a",
    message: "Listed as vegan, but the stew tasted of ghee. Can you confirm the oil used?",
    receivedAt: "2026-09-20",
  },
  {
    id: "corr-0318",
    listingId: "ops-l-01",
    subject: "Opening hours",
    reporterId: "user-2c91",
    message: "Closed at 3pm on a weekday; listing says open all day.",
    receivedAt: "2026-09-22",
  },
];

export type UserRating = {
  id: string;
  listingId: string;
  userId: string;
  dishName: string;
  /** 1–5, synthetic. */
  score: number;
  text: string;
  date: string;
  verification: "verified-visit" | "unverified";
};

export const partnerRatings: UserRating[] = [
  {
    id: "rt-501",
    listingId: "ops-l-01",
    userId: "user-7f3a",
    dishName: "Ven Pongal with gothsu",
    score: 5,
    text: "Filling, not too heavy. Would order again.",
    date: "2026-09-19",
    verification: "verified-visit",
  },
  {
    id: "rt-502",
    listingId: "ops-l-01",
    userId: "user-a410",
    dishName: "Plain dosa with sambar",
    score: 3,
    text: "Sambar was good, dosa arrived cold.",
    date: "2026-09-16",
    verification: "unverified",
  },
  {
    id: "rt-503",
    listingId: "ops-l-01",
    userId: "user-5be2",
    dishName: "Idiyappam with vegetable stew",
    score: 4,
    text: "Good vegan option for a mixed group.",
    date: "2026-09-12",
    verification: "verified-visit",
  },
];

export type VerificationEvent = {
  id: string;
  date: string;
  event: string;
  actorRole: "admin" | "system" | "partner";
};

export const partnerVerificationHistory: VerificationEvent[] = [
  { id: "vh-1", date: "2026-08-02", event: "Claim submitted", actorRole: "partner" },
  { id: "vh-2", date: "2026-08-05", event: "Ownership proof reviewed", actorRole: "admin" },
  { id: "vh-3", date: "2026-08-06", event: "Claim verified", actorRole: "admin" },
  { id: "vh-4", date: "2026-09-01", event: "Classification confirmed: Veg friendly", actorRole: "admin" },
];

/** Synthetic placeholder numbers only — not measured traffic. */
export const partnerAnalytics = {
  period: "last 30 days",
  views: 1240,
  saves: 186,
  directionTaps: 97,
};

/* ------------------------------------------------------------------ */
/* Admin: moderation (ratings + correction reports)                    */
/* ------------------------------------------------------------------ */

export type ModerationStatus = "open" | "approved" | "removed" | "escalated";

export type ModerationCase = {
  id: string;
  kind: "flagged_review" | "correction_report";
  target: string;
  reason: string;
  reporterId: string;
  status: ModerationStatus;
};

export const moderationCases: ModerationCase[] = [
  {
    id: "mod-1",
    kind: "correction_report",
    target: "Idiyappam with vegetable stew — Sample Tiffin Room",
    reason: "Reported ghee in a dish declared vegan",
    reporterId: "user-7f3a",
    status: "open",
  },
  {
    id: "mod-2",
    kind: "flagged_review",
    target: "Rating burst — Sample Chettinad Mess",
    reason: "Unusual rating velocity from new accounts (system flag)",
    reporterId: "system",
    status: "open",
  },
  {
    id: "mod-3",
    kind: "flagged_review",
    target: "1-star review — Sample Kerala Kitchen",
    reason: "Review text unrelated to food, possible spam",
    reporterId: "user-d09c",
    status: "open",
  },
  {
    id: "mod-4",
    kind: "correction_report",
    target: "Sample Plant Bowl Counter",
    reason: "Listing marked vegan; user saw curd on the counter",
    reporterId: "user-41e7",
    status: "escalated",
  },
  {
    id: "mod-5",
    kind: "flagged_review",
    target: "Review — Sample Andhra Meals Hall",
    reason: "Contains a phone number",
    reporterId: "system",
    status: "removed",
  },
];

/* ------------------------------------------------------------------ */
/* Admin: recipe/combo review state                                    */
/* ------------------------------------------------------------------ */

export type ContentReviewStatus = "draft" | "published" | "needs_correction";

/** Overrides keyed by recipe/combo id; anything absent is published v1. */
export const contentReviewStates: Record<string, { status: ContentReviewStatus; version: number }> = {
  "chettinad-soya-curry": { status: "published", version: 3 },
  "gujarati-undhiyu": { status: "draft", version: 1 },
  "kerala-puttu-kadala": { status: "needs_correction", version: 2 },
  "andhra-full-meals": { status: "draft", version: 1 },
};

/* ------------------------------------------------------------------ */
/* Admin: food nutrition provenance                                    */
/* ------------------------------------------------------------------ */

export type NutritionSourceType = "usda_fdc" | "ifct_nin" | "partner_declared" | "calculated";

export type DataSourceStatus = {
  sourceType: NutritionSourceType;
  label: string;
  status: "active" | "dormant";
  note: string;
};

export const nutritionSources: DataSourceStatus[] = [
  {
    sourceType: "usda_fdc",
    label: "USDA FoodData Central",
    status: "active",
    note: "Prototype snapshot; values below are synthetic stand-ins, not imported figures.",
  },
  {
    sourceType: "ifct_nin",
    label: "ICMR-NIN food composition",
    status: "dormant",
    note: "Not licensed — pipeline dormant. No NIN values are stored or shown.",
  },
  {
    sourceType: "partner_declared",
    label: "Partner declared",
    status: "active",
    note: "Owner-submitted; enters the admin review queue before going live.",
  },
  {
    sourceType: "calculated",
    label: "Calculated from recipe",
    status: "active",
    note: "Derived from ingredient rows; inherits the lowest input confidence.",
  },
];

export type FoodProvenance = {
  id: string;
  name: string;
  dietMode: DietMode;
  sourceType: NutritionSourceType;
  datasetVersion: string | null;
  confidence: "high" | "medium" | "low" | null;
  /** Per 100 g. Synthetic placeholder values; null means data unavailable. */
  nutrients: {
    proteinG: number | null;
    fibreG: number | null;
    ironMg: number | null;
    b12Ug: number | null;
  };
};

export const opsFoods: FoodProvenance[] = [
  {
    id: "food-001",
    name: "Chickpeas, boiled",
    dietMode: "vegan",
    sourceType: "usda_fdc",
    datasetVersion: "fdc-snapshot-synthetic-01",
    confidence: "high",
    nutrients: { proteinG: 8.5, fibreG: 7.2, ironMg: 2.6, b12Ug: null },
  },
  {
    id: "food-002",
    name: "Paneer",
    dietMode: "vegetarian",
    sourceType: "usda_fdc",
    datasetVersion: "fdc-snapshot-synthetic-01",
    confidence: "medium",
    nutrients: { proteinG: 17.8, fibreG: null, ironMg: null, b12Ug: 0.7 },
  },
  {
    id: "food-003",
    name: "Ragi flour",
    dietMode: "vegan",
    sourceType: "ifct_nin",
    datasetVersion: null,
    confidence: null,
    nutrients: { proteinG: null, fibreG: null, ironMg: null, b12Ug: null },
  },
  {
    id: "food-004",
    name: "Soya chunks, dry",
    dietMode: "vegan",
    sourceType: "partner_declared",
    datasetVersion: "partner-decl-2026-09",
    confidence: "low",
    nutrients: { proteinG: 50.1, fibreG: null, ironMg: null, b12Ug: null },
  },
  {
    id: "food-005",
    name: "Sambar (home recipe)",
    dietMode: "vegan",
    sourceType: "calculated",
    datasetVersion: "calc-engine-v0.2",
    confidence: "medium",
    nutrients: { proteinG: 3.1, fibreG: 2.4, ironMg: null, b12Ug: null },
  },
];

/* ------------------------------------------------------------------ */
/* Admin: impact reference factors                                     */
/* ------------------------------------------------------------------ */

export type ImpactFactorVersion = {
  version: string;
  status: "pending_legal_review" | "published" | "retired";
  createdAt: string;
  publishedAt: string | null;
  note: string;
};

export const impactFactorVersions: ImpactFactorVersion[] = [
  {
    version: "impact-factors-v0-draft",
    status: "pending_legal_review",
    createdAt: "2026-09-01",
    publishedAt: null,
    note: "Method draft only. Factor values have not been published and are not shown anywhere.",
  },
];

/** Categories the factor set will cover. Values deliberately absent. */
export const impactFactorCategories = ["Chicken", "Mutton / goat", "Fish & seafood", "Egg", "Beef / buffalo"];

/* ------------------------------------------------------------------ */
/* Admin: cuisine taxonomy governance                                  */
/* ------------------------------------------------------------------ */

export type CuisineTaxon = {
  id: string;
  name: string;
  parent: string | null;
  status: "approved" | "proposed" | "rejected";
  proposedBy: string;
};

export const cuisineTaxonomy: CuisineTaxon[] = [
  { id: "cx-south-indian", name: "South Indian", parent: null, status: "approved", proposedBy: "system" },
  { id: "cx-tamil", name: "Tamil", parent: "South Indian", status: "approved", proposedBy: "system" },
  { id: "cx-chettinad", name: "Chettinad", parent: "Tamil", status: "approved", proposedBy: "system" },
  { id: "cx-kerala", name: "Kerala", parent: "South Indian", status: "approved", proposedBy: "system" },
  { id: "cx-kongunadu", name: "Kongunadu", parent: "Tamil", status: "proposed", proposedBy: "admin-ops-07" },
  { id: "cx-udupi", name: "Udupi", parent: "South Indian", status: "proposed", proposedBy: "partner-u-0187" },
];

/* ------------------------------------------------------------------ */
/* Audit log                                                           */
/* ------------------------------------------------------------------ */

export type AuditLogEntry = {
  id: string;
  actorId: string;
  actorRole: "admin" | "partner" | "system";
  action: string;
  entityLabel: string;
  timestamp: string;
};

/** The demo admin signed in to /admin. */
export const demoAdminId = "admin-ops-03";

export const auditLog: AuditLogEntry[] = [
  {
    id: "audit-1",
    actorId: "admin-ops-07",
    actorRole: "admin",
    action: "published recipe",
    entityLabel: "Chettinad soya curry v3",
    timestamp: "2026-09-21 18:42",
  },
  {
    id: "audit-2",
    actorId: demoPartnerId,
    actorRole: "partner",
    action: "submitted menu edit",
    entityLabel: "Sample Tiffin Room — Plain dosa with sambar",
    timestamp: "2026-09-21 16:05",
  },
  {
    id: "audit-3",
    actorId: "partner-u-0203",
    actorRole: "partner",
    action: "submitted claim",
    entityLabel: "Sample Andhra Meals Hall",
    timestamp: "2026-09-18 11:30",
  },
  {
    id: "audit-4",
    actorId: "system",
    actorRole: "system",
    action: "flagged possible duplicate",
    entityLabel: "Sample Tiffin Room (T Nagar)",
    timestamp: "2026-09-17 22:58",
  },
  {
    id: "audit-5",
    actorId: "admin-ops-07",
    actorRole: "admin",
    action: "rejected claim",
    entityLabel: "Sample Kerala Kitchen — claim-0097",
    timestamp: "2026-08-30 15:12",
  },
];
