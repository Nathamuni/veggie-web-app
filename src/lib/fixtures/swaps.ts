import type { DietMode } from "./types";

/**
 * Synthetic craving → replacement rules for UC-02 ("I'm craving…"). Each rule
 * maps a South Indian meat dish to alternatives that already exist in the
 * recipe or combo fixtures, with the dimensions of the craving each one keeps
 * and a few plain-language reasons. Nothing here is tested with real users —
 * the pairings are prototype placeholders (PRODUCT.md), not satisfaction data.
 *
 * Diet mode is carried per alternative and is always the mode of the linked
 * recipe/combo: vegetarian and vegan are never merged, and screens must hard
 * filter by the user's mode before ranking.
 */

/** "cuisine" is shown to users as "Familiarity" — same regional base, same plate. */
export type SwapDimension = "spice" | "texture" | "fullness" | "cuisine";

export type SwapReasonCode =
  | "same-spice-level"
  | "same-masala-base"
  | "chewy-bite"
  | "crisp-bite"
  | "layered-rice"
  | "keeps-you-full"
  | "high-protein"
  | "same-regional-plate"
  | "gravy-with-rice";

export type SwapAlternative = {
  target: { kind: "recipe" | "combo"; id: string };
  name: string;
  dietMode: DietMode;
  preserves: SwapDimension[];
  reasons: { code: SwapReasonCode; text: string }[];
};

export type SwapRule = {
  id: string;
  craving: string;
  /** Lower-case fragments a typed craving is matched against. */
  aliases: string[];
  alternatives: SwapAlternative[];
};

export const swapRules: SwapRule[] = [
  {
    id: "chicken-biryani",
    craving: "Chicken biryani",
    aliases: ["chicken biryani", "biryani", "biriyani", "dum biryani"],
    alternatives: [
      {
        target: { kind: "recipe", id: "mushroom-biryani" },
        name: "Tamil-style Mushroom Biryani",
        dietMode: "vegetarian",
        preserves: ["spice", "texture", "fullness", "cuisine"],
        reasons: [
          { code: "layered-rice", text: "Same seeraga samba rice, layered and dum-cooked" },
          { code: "chewy-bite", text: "Mushroom holds a meaty bite through the masala" },
          { code: "same-spice-level", text: "Same fiery biryani masala" },
        ],
      },
      {
        target: { kind: "combo", id: "punjabi-comfort-thali" },
        name: "Punjabi Comfort Thali",
        dietMode: "vegan",
        preserves: ["fullness"],
        reasons: [
          { code: "keeps-you-full", text: "A full rice plate for a big-appetite night" },
          { code: "high-protein", text: "Rajma brings the protein the chicken used to" },
        ],
      },
      {
        target: { kind: "recipe", id: "karnataka-bisi-bele-bath" },
        name: "Karnataka Bisi Bele Bath",
        dietMode: "vegetarian",
        preserves: ["fullness", "cuisine"],
        reasons: [
          { code: "keeps-you-full", text: "One-pot spiced rice that fills like biryani" },
          { code: "same-regional-plate", text: "A South Indian weekend rice dish" },
        ],
      },
    ],
  },
  {
    id: "mutton-curry",
    craving: "Mutton curry",
    aliases: ["mutton", "mutton curry", "mutton kuzhambu", "lamb", "goat curry", "chettinad mutton"],
    alternatives: [
      {
        target: { kind: "recipe", id: "chettinad-soya-curry" },
        name: "Chettinad Soya Curry + Millet",
        dietMode: "vegetarian",
        preserves: ["spice", "texture", "fullness", "cuisine"],
        reasons: [
          { code: "same-masala-base", text: "Same Chettinad masala — star anise, stone flower, fennel" },
          { code: "chewy-bite", text: "Soya chunks soak up gravy with a chewy bite" },
          { code: "high-protein", text: "High protein, like the mutton it replaces" },
        ],
      },
      {
        target: { kind: "recipe", id: "kerala-kadala-appam" },
        name: "Kerala Kadala Curry + Appam",
        dietMode: "vegan",
        preserves: ["fullness", "cuisine"],
        reasons: [
          { code: "gravy-with-rice", text: "A thick coconut gravy made for mopping up" },
          { code: "same-regional-plate", text: "The Sunday-curry plate from Kerala homes" },
        ],
      },
      {
        target: { kind: "recipe", id: "punjabi-rajma-chawal" },
        name: "Punjabi Rajma Chawal",
        dietMode: "vegan",
        preserves: ["fullness", "texture"],
        reasons: [
          { code: "keeps-you-full", text: "Slow-simmered and filling over rice" },
          { code: "chewy-bite", text: "Rajma gives a dense, satisfying bite" },
        ],
      },
    ],
  },
  {
    id: "fish-fry",
    craving: "Fish fry",
    aliases: ["fish", "fish fry", "meen varuval", "meen", "prawn fry", "fried fish"],
    alternatives: [
      {
        target: { kind: "recipe", id: "andhra-gutti-vankaya" },
        name: "Andhra Gutti Vankaya Kura",
        dietMode: "vegan",
        preserves: ["spice", "cuisine"],
        reasons: [
          { code: "same-spice-level", text: "Red-chilli heat like a masala-coated fry" },
          { code: "same-regional-plate", text: "Sits on the same rice-and-rasam plate" },
        ],
      },
      {
        target: { kind: "combo", id: "andhra-full-meals" },
        name: "Andhra Full Meals",
        dietMode: "vegan",
        preserves: ["texture", "fullness", "cuisine"],
        reasons: [
          { code: "crisp-bite", text: "Fried appalam gives the crunch on the side" },
          { code: "keeps-you-full", text: "A four-part meals plate" },
          { code: "same-regional-plate", text: "The same meals format fish fry is served with" },
        ],
      },
      {
        target: { kind: "combo", id: "kerala-sadya-lite" },
        name: "Kerala Sadya, Weekday Lite",
        dietMode: "vegan",
        preserves: ["texture", "cuisine"],
        reasons: [
          { code: "crisp-bite", text: "Banana chips for the crisp you miss" },
          { code: "same-regional-plate", text: "Coconut-and-curry-leaf coastal flavours" },
        ],
      },
    ],
  },
  {
    id: "chicken-65",
    craving: "Chicken 65",
    aliases: ["chicken 65", "65", "chilli chicken", "chicken fry", "pepper chicken"],
    alternatives: [
      {
        target: { kind: "recipe", id: "maharashtrian-misal-pav" },
        name: "Maharashtrian Misal Pav",
        dietMode: "vegan",
        preserves: ["spice", "texture"],
        reasons: [
          { code: "same-spice-level", text: "Fiery, street-food heat" },
          { code: "crisp-bite", text: "Crunchy farsan on top for the fried-snack feel" },
          { code: "high-protein", text: "Sprouted matki keeps protein high" },
        ],
      },
      {
        target: { kind: "recipe", id: "chettinad-soya-curry" },
        name: "Chettinad Soya Curry + Millet",
        dietMode: "vegetarian",
        preserves: ["spice", "texture", "cuisine"],
        reasons: [
          { code: "chewy-bite", text: "Soya chunks take a masala coat the way chicken does" },
          { code: "same-spice-level", text: "Same Tamil Nadu heat" },
        ],
      },
      {
        target: { kind: "recipe", id: "paneer-bhurji-wrap" },
        name: "Paneer Bhurji Wrap",
        dietMode: "vegetarian",
        preserves: ["texture"],
        reasons: [
          { code: "high-protein", text: "Quick, high-protein snack-meal" },
          { code: "chewy-bite", text: "Soft, pan-seared bite in 20 minutes" },
        ],
      },
    ],
  },
  {
    id: "egg-curry",
    craving: "Egg curry",
    aliases: ["egg", "egg curry", "muttai kuzhambu", "egg masala", "anda curry", "omelette"],
    alternatives: [
      {
        target: { kind: "recipe", id: "paneer-bhurji-wrap" },
        name: "Paneer Bhurji Wrap",
        dietMode: "vegetarian",
        preserves: ["texture"],
        reasons: [
          { code: "chewy-bite", text: "Scrambled paneer eats a lot like egg bhurji" },
          { code: "high-protein", text: "High protein, ready in 20 minutes" },
        ],
      },
      {
        target: { kind: "recipe", id: "north-indian-chana-masala" },
        name: "North Indian Chana Masala",
        dietMode: "vegan",
        preserves: ["spice", "fullness"],
        reasons: [
          { code: "gravy-with-rice", text: "Onion-tomato gravy like an egg masala" },
          { code: "keeps-you-full", text: "Chana keeps you full through the evening" },
        ],
      },
      {
        target: { kind: "recipe", id: "kerala-puttu-kadala" },
        name: "Kerala Puttu with Kadala Curry",
        dietMode: "vegan",
        preserves: ["fullness", "cuisine"],
        reasons: [
          { code: "same-regional-plate", text: "The breakfast plate egg curry often shares" },
          { code: "keeps-you-full", text: "Puttu and kadala hold you till lunch" },
        ],
      },
    ],
  },
];

/** Case-insensitive, whole-word match of free text against a rule's name and
 *  aliases ("veggie" must not match the "egg" alias). */
export function findSwapRule(query: string): SwapRule | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const hasWords = (text: string, phrase: string) =>
    new RegExp(`(^|[^a-z0-9])${escape(phrase)}($|[^a-z0-9])`).test(text);
  return (
    swapRules.find((r) => r.craving.toLowerCase() === q || r.aliases.includes(q)) ??
    swapRules.find((r) => r.aliases.some((a) => hasWords(q, a)))
  );
}
