import type { DietMode } from "./types";

/**
 * Synthetic "fulfilment combo" data — a main dish plus sides assembled to hit
 * a specific job (budget, protein, fullness, comfort, ...). Separate from
 * `recipes`: a combo does not carry its own ingredients/steps, it composes
 * existing dish names into a plate. Nothing here is real (PRODUCT.md); it
 * exists only to give the S17 combo-detail screen a realistic data shape.
 */
export type Combo = {
  id: string;
  name: string;
  category:
    | "Taste"
    | "Protein"
    | "Fullness"
    | "Balanced"
    | "Budget"
    | "Quick"
    | "Vegetarian"
    | "Vegan"
    | "Regional"
    | "Restaurant"
    | "Workout"
    | "Comfort";
  dietMode: DietMode;
  cuisine: string;
  mainDish: string;
  sides: string[];
  proteinLevel: "high" | "medium" | "low";
  fullness: number; // 1-5
  estimatedCostRupees: number;
  whyItFits: string;
  alternativeComponents: string[];
};

export const combos: Combo[] = [
  {
    id: "chettinad-soya-thali",
    name: "Chettinad Soya Thali",
    category: "Regional",
    dietMode: "vegetarian",
    cuisine: "Chettinad",
    mainDish: "Chettinad Soya Curry",
    sides: ["Steamed millet", "Curd", "Pickle"],
    proteinLevel: "high",
    fullness: 5,
    estimatedCostRupees: 90,
    whyItFits:
      "Pairs a high-protein main with a starch, a cooling side and a sharp condiment — the four-part structure a tiffin room uses to make a plate feel complete.",
    alternativeComponents: ["Swap millet for brown rice", "Swap curd for buttermilk", "Swap pickle for a lemon wedge"],
  },
  {
    id: "kerala-sadya-lite",
    name: "Kerala Sadya, Weekday Lite",
    category: "Balanced",
    dietMode: "vegan",
    cuisine: "Kerala",
    mainDish: "Kadala Curry",
    sides: ["Appam", "Avial", "Banana chips"],
    proteinLevel: "medium",
    fullness: 5,
    estimatedCostRupees: 110,
    whyItFits:
      "Balances a protein-forward curry with a vegetable-forward side, covering fullness and variety without needing a fourth dish.",
    alternativeComponents: ["Swap appam for idiyappam", "Swap banana chips for roasted papad", "Add a spoon of coconut chutney"],
  },
  {
    id: "continental-power-bowl",
    name: "Continental Protein Power Bowl",
    category: "Workout",
    dietMode: "vegan",
    cuisine: "Continental",
    mainDish: "Mediterranean Chickpea Bowl",
    sides: ["Extra tahini drizzle", "Toasted seeds"],
    proteinLevel: "high",
    fullness: 4,
    estimatedCostRupees: 150,
    whyItFits:
      "Built around a legume-and-grain base with an added fat source for satiety — the combination fitness-conscious users ask for instead of a plain shake.",
    alternativeComponents: ["Swap chickpeas for boiled soya chunks", "Swap couscous for quinoa", "Add roasted peanuts for crunch"],
  },
  {
    id: "budget-everyday-tiffin",
    name: "Budget Everyday Tiffin",
    category: "Budget",
    dietMode: "vegetarian",
    cuisine: "Tamil",
    mainDish: "Millet Sambar",
    sides: ["Steamed rice", "Papad"],
    proteinLevel: "medium",
    fullness: 4,
    estimatedCostRupees: 45,
    whyItFits:
      "Dal-and-rice priced this low still lands on medium protein and a full plate — the pantry combination a budget cook already defaults to, made explicit.",
    alternativeComponents: ["Swap papad for a besan omelette", "Swap rice for leftover idli", "Add raw onion for crunch"],
  },
  {
    id: "quick-curd-rice-combo",
    name: "5-Minute Dairy-Free Curd Rice Combo",
    category: "Quick",
    dietMode: "vegan",
    cuisine: "Tamil",
    mainDish: "Dairy-free curd rice (coconut-milk yogurt, no dairy)",
    sides: ["Mango pickle", "Fried peanuts"],
    proteinLevel: "low",
    fullness: 3,
    estimatedCostRupees: 35,
    whyItFits:
      "The fastest plate in the set — no cooking beyond the rice, built for a night with zero time that still lands on a complete plate.",
    alternativeComponents: ["Swap coconut milk for cashew cream", "Swap peanuts for roasted chana", "Add grated carrot for crunch"],
  },
  {
    id: "andhra-full-meals",
    name: "Andhra Full Meals",
    category: "Fullness",
    dietMode: "vegan",
    cuisine: "Andhra",
    mainDish: "Gutti Vankaya Kura",
    sides: ["Steamed rice", "Rasam", "Fried appalam"],
    proteinLevel: "low",
    fullness: 5,
    estimatedCostRupees: 80,
    whyItFits:
      "A four-part plate stacked for volume rather than protein — the answer when the ask is simply 'I want to feel full', not a macro target.",
    alternativeComponents: ["Swap rasam for pulusu", "Swap appalam for vadiyam", "Add a spoon of ghee to the rice"],
  },
  {
    id: "punjabi-comfort-thali",
    name: "Punjabi Comfort Thali",
    category: "Comfort",
    dietMode: "vegan",
    cuisine: "Punjabi",
    mainDish: "Rajma",
    sides: ["Jeera rice", "Onion-lemon salad"],
    proteinLevel: "high",
    fullness: 5,
    estimatedCostRupees: 95,
    whyItFits:
      "The rainy-day plate: a slow-simmered legume curry over rice is the comfort-food shape most reducers already default to, minus the meat.",
    alternativeComponents: ["Swap jeera rice for plain rice", "Swap rajma for chole", "Add a side of curd"],
  },
  {
    id: "restaurant-style-paneer-combo",
    name: "Restaurant-style Paneer Combo",
    category: "Restaurant",
    dietMode: "vegetarian",
    cuisine: "North Indian",
    mainDish: "Paneer Bhurji",
    sides: ["Butter roti", "Sliced salad"],
    proteinLevel: "high",
    fullness: 4,
    estimatedCostRupees: 180,
    whyItFits:
      "The combination most North Indian restaurant menus already default to for a vegetarian main — ordering it by name gets a consistent plate anywhere.",
    alternativeComponents: ["Swap butter roti for plain roti", "Swap paneer for tofu bhurji", "Add a side of dal makhani"],
  },
];
