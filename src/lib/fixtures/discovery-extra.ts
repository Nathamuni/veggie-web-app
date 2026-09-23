/**
 * Synthetic demo data for the Discovery cluster (S12–S14) that isn't covered
 * by the shared restaurant/dish fixtures — preparation declarations,
 * one-line reviews, and dish ingredient lists. Same rules as the rest of
 * ./fixtures: nothing here is real (PRODUCT.md forbids fabricating real
 * restaurants, prices or people); it exists only to make the UI legible
 * with realistic shapes of data.
 *
 * Keyed by the ids already used in ./restaurants.ts so callers can look
 * these up alongside `restaurants` / `dishes` without a second id scheme.
 */

export type RestaurantNotes = {
  /** 2-3 static "how the kitchen handles veg/non-veg" declarations. */
  preparation: string[];
  /** 2-3 short synthetic one-line reviews. */
  reviews: string[];
};

export const restaurantNotes: Record<string, RestaurantNotes> = {
  "saravana-bhavan-tnagar": {
    preparation: [
      "Dedicated vegetarian kitchen — no meat, fish or eggs prepared on premises.",
      "Preparation notes are restaurant-declared, not independently verified.",
    ],
    reviews: [
      "Ghee roast dosa is worth the wait outside on a Sunday morning.",
      "Reliable for a family lunch — menu doesn't change much, in a good way.",
      "Gets loud and crowded after 12:30pm; go earlier if you want a table.",
    ],
  },
  "amma-mess-tnagar": {
    preparation: [
      "Uses a shared kitchen with non-veg preparation on a separate counter.",
      "Vegetarian and vegan thalis cooked in dedicated vessels on request.",
    ],
    reviews: [
      "Tastes like home-style Chettinad cooking, not restaurant Chettinad.",
      "Small place, plastic chairs, but the poricha kuzhambu is worth it.",
    ],
  },
  "kappa-chakka-kandhari": {
    preparation: [
      "Shares a kitchen with the attached non-veg section; veg orders are flagged at billing.",
      "Coconut oil used throughout — ask staff if you need an alternative.",
    ],
    reviews: [
      "Kerala sadya on weekends is the reason to book ahead.",
      "Portions are generous — the avial meals easily does two people.",
      "Closes early most weekdays, check before the trip.",
    ],
  },
  "meenakshi-bhavan-mylapore": {
    preparation: [
      "Dedicated vegetarian kitchen since opening — no non-veg menu at all.",
      "Preparation notes are restaurant-declared, not independently verified.",
    ],
    reviews: [
      "Ven pongal here is softer and less oily than most T. Nagar places.",
      "Quiet in the mid-afternoon, good for a slow solo lunch.",
    ],
  },
  "andhra-mirchi-adyar": {
    preparation: [
      "Uses a shared kitchen with non-veg preparation on the same stove line.",
      "Spice level is high by default — ask for it toned down.",
    ],
    reviews: [
      "Gongura pappu is properly sour-spicy, not the toned-down city version.",
      "Come hungry — the gutti vankaya curry portion is huge.",
      "Service is quick but the room is basic — takeaway is the better call.",
    ],
  },
  "malabar-coconut-velachery": {
    preparation: [
      "Uses a shared kitchen with non-veg preparation on a separate section.",
      "Coconut-heavy prep throughout — most dishes use fresh-grated coconut daily.",
    ],
    reviews: [
      "Puttu and kadala curry here is closer to a Kerala home kitchen than most.",
      "A bit of a trek from central Chennai but worth it once a month.",
    ],
  },
  "punjab-tadka-nungambakkam": {
    preparation: [
      "Dedicated vegetarian kitchen — the whole menu is meat-free.",
      "Preparation notes are restaurant-declared, not independently verified.",
    ],
    reviews: [
      "Dal makhani is rich and buttery — not for a light meal.",
      "Good option when the group wants North Indian and you don't eat meat.",
    ],
  },
  "green-leaf-deli-besantnagar": {
    preparation: [
      "Dedicated vegetarian and vegan kitchen — no meat, fish or eggs on premises.",
      "Ingredients sourced and swapped seasonally; ask staff for the current list.",
    ],
    reviews: [
      "Closest thing in the area to a proper vegan cafe menu, not just a side option.",
      "Quinoa buddha bowl is filling enough to skip a second meal.",
      "Prices run higher than the tiffin places nearby — it's a cafe, not a mess.",
    ],
  },
  "chettinad-spice-annanagar": {
    preparation: [
      "Uses a shared kitchen with non-veg preparation on the same stove line.",
      "Chettinad masala base is common to veg and non-veg dishes; oil is shared.",
    ],
    reviews: [
      "Mushroom Chettinad is the closest vegetarian version of the chicken dish gets.",
      "Inconsistent — great on a good night, oversalted on a bad one.",
    ],
  },
};

export const dishIngredients: Record<string, string[]> = {
  "sb-soya-chettinad": [
    "Soya chunks",
    "Onion & tomato masala",
    "Chettinad spice blend",
    "Curry leaves",
    "Coconut oil",
  ],
  "sb-ghee-roast-dosa": ["Fermented rice & urad batter", "Ghee", "Podi (spice powder)"],
  "am-kadala-curry": ["Black chickpeas (kadala)", "Roasted coconut", "Shallots", "Appam batter"],
  "am-poricha-kuzhambu": ["Mixed vegetables", "Toor dal", "Coconut-cumin paste", "Curry leaves"],
  "kck-avial-meals": [
    "Mixed vegetables",
    "Coconut & yogurt paste",
    "Raw rice",
    "Sambar",
    "Coconut oil",
  ],
  "kck-banana-chips-sadya": ["Raw banana", "Coconut oil", "Turmeric", "Salt"],
  "mb-ven-pongal": ["Rice & moong dal", "Cumin & pepper", "Ghee", "Gothsu (brinjal-tomato side)"],
  "mb-rava-kesari": ["Semolina (rava)", "Ghee", "Sugar", "Cashew & raisin"],
  "amc-gongura-pappu": ["Gongura (sorrel leaves)", "Toor dal", "Garlic tempering", "Red chilli"],
  "amc-gutti-vankaya-curry": [
    "Baby brinjal",
    "Peanut-sesame masala",
    "Tamarind",
    "Curry leaves",
  ],
  "mch-puttu-kadala-curry": ["Rice flour & coconut", "Black chickpeas", "Coconut milk masala"],
  "mch-parippu-curry-rice": ["Moong dal", "Coconut milk", "Ghee tempering", "Rice"],
  "ptj-dal-makhani": ["Black lentils & kidney beans", "Butter & cream", "Tomato masala", "Lachha paratha"],
  "ptj-kadai-vegetable": ["Mixed vegetables", "Kadai masala", "Capsicum & onion", "Ginger-garlic paste"],
  "gld-quinoa-buddha-bowl": ["Quinoa", "Roasted chickpeas", "Seasonal greens", "Tahini dressing"],
  "gld-margherita-flatbread": ["Flatbread base", "Tomato sauce", "Plant-based cheese", "Basil"],
  "csr-mushroom-chettinad": ["Button mushroom", "Chettinad masala", "Coconut", "Curry leaves"],
  "csr-idiyappam-kurma": ["Steamed rice noodles (idiyappam)", "Mixed vegetable kurma", "Coconut milk"],
};
