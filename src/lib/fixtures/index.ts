/**
 * Synthetic demo data for the prototype. No database, no auth — every screen
 * in this pass reads from here. Nothing here is real (PRODUCT.md forbids
 * fabricating real restaurants, prices or people); it exists only to make
 * the UI legible with realistic shapes of data.
 *
 * Split by domain (recipes / restaurants / meal logs / nutrition / core) so
 * each domain can be edited independently. Re-exported here so existing
 * imports of "@/lib/fixtures" keep working unchanged.
 */

export * from "./types";
export * from "./recipes";
export * from "./restaurants";
export * from "./mealLogs";
export * from "./nutrition";
export * from "./core";
export * from "./swaps";
