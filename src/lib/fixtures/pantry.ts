/**
 * Synthetic starter pantry for the Fulfilment cluster (S23 Pantry). Quantities
 * are plain "<amount> <unit>" strings so the Pantry screen can parse a leading
 * number for +/- steppers. Not real inventory data.
 */

export type PantryItem = {
  id: string;
  name: string;
  quantity: string;
  expiryDate?: string;
};

export const pantryItems: PantryItem[] = [
  { id: "pantry-rice", name: "Rice", quantity: "5 kg" },
  { id: "pantry-toor-dal", name: "Toor dal", quantity: "1 kg" },
  { id: "pantry-coconut", name: "Coconut", quantity: "2 pieces", expiryDate: "2026-09-27" },
  { id: "pantry-curry-leaves", name: "Curry leaves", quantity: "1 bunch", expiryDate: "2026-09-25" },
  { id: "pantry-millet", name: "Millet", quantity: "500 g" },
  { id: "pantry-mustard-seeds", name: "Mustard seeds", quantity: "100 g" },
  { id: "pantry-turmeric-powder", name: "Turmeric powder", quantity: "50 g" },
  { id: "pantry-tamarind", name: "Tamarind", quantity: "200 g" },
  { id: "pantry-coconut-oil", name: "Coconut oil", quantity: "1 litre" },
  { id: "pantry-onion", name: "Onion", quantity: "1 kg", expiryDate: "2026-10-05" },
];
