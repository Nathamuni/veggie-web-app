/**
 * Synthetic shopping list for the Fulfilment cluster (S25 Shopping List).
 * Prices are illustrative prototype placeholders, not real market prices.
 */

export type ShoppingItem = {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  estimatedPriceRupees: number;
  category: string;
};

export const shoppingListItems: ShoppingItem[] = [
  { id: "shop-tomatoes", name: "Tomatoes", quantity: "1", unit: "kg", estimatedPriceRupees: 40, category: "Produce" },
  { id: "shop-onions", name: "Onions", quantity: "2", unit: "kg", estimatedPriceRupees: 60, category: "Produce" },
  { id: "shop-curry-leaves", name: "Curry leaves", quantity: "2", unit: "bunches", estimatedPriceRupees: 10, category: "Produce" },
  { id: "shop-coconut", name: "Coconut", quantity: "2", unit: "pieces", estimatedPriceRupees: 50, category: "Produce" },
  { id: "shop-rice", name: "Rice (ponni)", quantity: "5", unit: "kg", estimatedPriceRupees: 300, category: "Grains" },
  { id: "shop-toor-dal", name: "Toor dal", quantity: "1", unit: "kg", estimatedPriceRupees: 160, category: "Grains" },
  { id: "shop-millet", name: "Millet (ragi)", quantity: "1", unit: "kg", estimatedPriceRupees: 90, category: "Grains" },
  { id: "shop-curd", name: "Curd", quantity: "500", unit: "g", estimatedPriceRupees: 35, category: "Dairy" },
  { id: "shop-paneer", name: "Paneer", quantity: "200", unit: "g", estimatedPriceRupees: 90, category: "Dairy" },
  { id: "shop-milk", name: "Milk", quantity: "1", unit: "litre", estimatedPriceRupees: 32, category: "Dairy" },
  { id: "shop-mustard-seeds", name: "Mustard seeds", quantity: "100", unit: "g", estimatedPriceRupees: 20, category: "Spices" },
  { id: "shop-turmeric-powder", name: "Turmeric powder", quantity: "50", unit: "g", estimatedPriceRupees: 25, category: "Spices" },
];

/** Every price above is a retail (shop-counter) estimate; wholesale is never mixed in. */
export const shoppingPriceBasis = "retail" as const;
export const shoppingPriceSource = "synthetic estimate · Chennai · 2026-09";

/**
 * Explicit pantry subtraction for S25. Names don't match cleanly ("Onions" vs
 * "Onion", "Rice (ponni)" vs "Rice") and a partial quantity should stay on the
 * list, so the prototype lists only items the pantry fully covers
 * (shopping item id → pantry item id).
 */
export const shoppingCoveredByPantry: Record<string, string> = {
  "shop-rice": "pantry-rice",
  "shop-toor-dal": "pantry-toor-dal",
  "shop-coconut": "pantry-coconut",
  "shop-mustard-seeds": "pantry-mustard-seeds",
  "shop-turmeric-powder": "pantry-turmeric-powder",
};
