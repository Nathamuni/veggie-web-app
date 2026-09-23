/**
 * Synthetic "Veggie Learn" lesson content for the Fulfilment cluster (S22).
 * Short, non-prescriptive explainers — nutrition is wellness support, not
 * diagnosis (PRODUCT.md). Nothing here is medical advice; figures and claims
 * are prototype placeholders, not sourced facts.
 */

export type Lesson = {
  id: string;
  title: string;
  topic: "protein" | "iron" | "b12" | "transition" | "regional";
  dietModeRelevance: "vegetarian" | "vegan" | "both";
  durationMinutes: number;
  /** When set, should textually match one of fixtures/mealLogs.ts's `barrierOptions` strings
   *  so the Learn screen can recommend this lesson off a logged barrier. */
  triggerBarrier?: string;
  summary: string;
  /** Micro-lesson content shown on /app/learn/[id]. Wellness wording only for
   *  nutrition topics — never diagnosis, dosage or treatment advice. */
  body: string[];
  /** Every lesson ends in one concrete action (PRD S22): a specific recipe,
   *  a specific combo, or logging a meal — never a generic list page. */
  actionLabel: string;
  actionHref: string;
};

export const lessons: Lesson[] = [
  {
    id: "protein-without-meat-101",
    title: "Getting enough protein without meat",
    topic: "protein",
    dietModeRelevance: "both",
    durationMinutes: 4,
    summary:
      "Dals, soya chunks, paneer and millets combined with rice or wheat cover most of a day's protein without meat. Pairing a lentil with a grain — sambar with rice, rajma with chawal — gives a more complete amino acid mix than either eaten alone.",
    body: [
      "If your logged meals appear low in protein on meat-free days, it's usually the plate's shape, not the vegetarian food itself. A bowl of rice with a thin rasam is light on protein; the same rice with a thick sambar, a kootu and a spoon of curd is not.",
      "A simple habit: every main meal gets one of dal, chana, rajma, soya chunks, paneer or tofu. Pair it with a grain — sambar with rice, rajma with chawal — for a more complete mix than either alone.",
      "Soya chunks are the most direct swap for meat in a gravy: same chewy bite, high protein, and they take a Chettinad or Kerala masala just as well.",
    ],
    actionLabel: "Open Chettinad Soya Curry",
    actionHref: "/app/recipes/chettinad-soya-curry",
  },
  {
    id: "iron-rich-swaps",
    title: "Iron-rich swaps for red meat",
    topic: "iron",
    dietModeRelevance: "both",
    durationMinutes: 5,
    summary:
      "Ragi, spinach (keerai), chana and sesame are common iron sources in South Indian cooking. Pairing them with a vitamin-C food — tomato, lemon, amla — helps absorption, the same idea behind a rasam or a lemon-dressed salad.",
    body: [
      "Red meat is an easy iron source, so when it leaves the plate it helps to know what replaces it. Common South Indian options: ragi, keerai (greens), chana, rajma, sesame and jaggery.",
      "Plant iron is absorbed better alongside vitamin C — a squeeze of lemon, tomato in the gravy, or amla on the side. Tea or coffee right with the meal can work against it, so leaving a gap is an easy change.",
      "If your logged meals appear low in iron-rich foods for a while, that's a prompt to add one, not a diagnosis. For anything medical — tiredness, a blood test result — talk to a qualified professional.",
    ],
    actionLabel: "Open Chana Masala",
    actionHref: "/app/recipes/north-indian-chana-masala",
  },
  {
    id: "b12-for-vegans",
    title: "Why vegans track B12 separately",
    topic: "b12",
    dietModeRelevance: "vegan",
    durationMinutes: 3,
    summary:
      "B12 mainly comes from animal products, so fully vegan eaters commonly rely on fortified foods — that's common practice, not a sign anything has gone wrong. A qualified professional can advise on anything beyond food; this isn't a diagnosis.",
    body: [
      "B12 is found mainly in animal foods. Vegetarians who eat dairy get some from milk and curd; a fully vegan plate has very few natural sources.",
      "That's why vegan eaters commonly lean on fortified foods — some plant milks, breakfast cereals and nutritional yeast carry added B12. Checking the label is the quickest step.",
      "Whether you need anything beyond food, and whether testing makes sense, is a question for a qualified professional — Veggie doesn't give dosage or treatment advice, and this isn't a diagnosis. Logging your meals lets you see how often fortified foods show up.",
    ],
    actionLabel: "Log a meal",
    actionHref: "/app/log",
  },
  {
    id: "reading-a-mixed-menu",
    title: "Reading a non-vegetarian menu fast",
    topic: "transition",
    dietModeRelevance: "both",
    durationMinutes: 6,
    triggerBarrier: "No vegetarian option available",
    summary:
      "Most Tamil Nadu and Andhra restaurants carry a small vegetarian section even on a meat-heavy menu — check for the meals/sambar-rasam section, poriyal, or a veg biryani before assuming there's nothing. It gets faster to spot with practice.",
    body: [
      "When someone else picks the restaurant, the vegetarian choice is usually there — just not on the first page. Look for the 'meals' or sambar-rasam section, the poriyal and kootu list, or a veg biryani near the chicken one.",
      "Ask for the mess-style meals if it isn't listed; many Tamil and Andhra kitchens make it daily. Paneer or mushroom versions of the chicken starters are often available on request.",
      "It gets faster with practice. Logging what you ordered — and how satisfying it was — helps Veggie suggest the right dish next time you're at a similar table.",
    ],
    actionLabel: "Log a meal",
    actionHref: "/app/log",
  },
  {
    id: "cook-in-twenty-minutes",
    title: "Vegetarian dinners in under 20 minutes",
    topic: "transition",
    dietModeRelevance: "both",
    durationMinutes: 5,
    triggerBarrier: "Ran out of time to cook",
    summary:
      "A short list of dishes that hold up on a rushed weeknight: varan bhaat, paneer bhurji wrap, khichdi kadhi. Keeping a batch-cooked dal or sambar in the fridge cuts most of these to under 15 minutes.",
    body: [
      "Rushed weeknights are where meat tends to come back — the takeaway is fastest. A short list of 20-minute vegetarian dinners removes that pressure.",
      "Varan bhaat, paneer bhurji wraps and khichdi-kadhi all come together fast. The biggest time-saver is a batch of dal or sambar in the fridge: with it, most dinners are under 15 minutes.",
      "Start with one dish you can make without looking at the steps. Once it's automatic, add a second.",
    ],
    actionLabel: "Open Varan Bhaat",
    actionHref: "/app/recipes/maharashtrian-varan-bhaat",
  },
  {
    id: "chettinad-without-meat",
    title: "Chettinad flavour, without the meat",
    topic: "regional",
    dietModeRelevance: "vegetarian",
    durationMinutes: 4,
    summary:
      "The Chettinad masala base — star anise, stone flower, fennel, curry leaf — carries just as well over soya chunks or mushroom as it does over chicken. The spice blend is doing most of the work, not the protein underneath it.",
    body: [
      "Chettinad cooking is defined by its masala — star anise, stone flower (kalpasi), fennel, dried red chilli, black pepper and curry leaf — roasted and ground fresh.",
      "That spice blend is doing most of the work. Over soya chunks or mushroom, it keeps the same heat and aroma as the chicken or mutton version, and soya brings a similar chewy bite.",
      "If a family recipe calls for meat, keep everything else exactly the same and swap only the protein. Familiar masala makes the change easy to accept at the table.",
    ],
    actionLabel: "Open Chettinad Soya Curry",
    actionHref: "/app/recipes/chettinad-soya-curry",
  },
  {
    id: "kerala-vegan-breakfasts",
    title: "Kerala breakfasts that are already vegan",
    topic: "regional",
    dietModeRelevance: "vegan",
    durationMinutes: 4,
    summary:
      "Puttu, appam and idiyappam are coconut- and rice-based by default in most home kitchens — no dairy or egg to swap out. The curry served alongside (kadala or a vegetable stew) is the part worth checking for ghee.",
    body: [
      "Many Kerala breakfasts are vegan by default: puttu, appam and idiyappam are rice and coconut, with no dairy or egg to remove.",
      "The curry served alongside is where to check. Kadala (black chickpea) curry and vegetable stew are usually coconut-based, but some kitchens finish with ghee — ask, or cook it at home with coconut oil.",
      "Puttu with kadala is filling enough to replace an egg-based breakfast, and the chickpeas add protein.",
    ],
    actionLabel: "Open Puttu with Kadala",
    actionHref: "/app/recipes/kerala-puttu-kadala",
  },
  {
    id: "protein-on-a-budget",
    title: "High-protein, low-cost combinations",
    topic: "protein",
    dietModeRelevance: "both",
    durationMinutes: 4,
    summary:
      "Rajma, chana, toor dal and soya chunks are among the cheapest protein sources per rupee in most Chennai kitchens — often less expensive than the meat they replace. Buying dried rather than tinned keeps the cost down further.",
    body: [
      "Rajma, chana, toor dal and soya chunks are among the cheapest protein sources per rupee — often less than the meat they replace.",
      "Buying dried rather than tinned and cooking a batch at a time keeps cost down further. A pressure cooker makes overnight-soaked beans a 20-minute job.",
      "A dal-and-rice plate with papad and a vegetable is a complete, budget-friendly meal — the everyday tiffin shape most kitchens already know.",
    ],
    actionLabel: "Open Budget Everyday Tiffin",
    actionHref: "/app/combos/budget-everyday-tiffin",
  },
];
