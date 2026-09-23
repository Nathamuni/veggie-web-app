/**
 * Scripted demo content for the AI Assistant screen (S26). There is no live
 * model behind this — every reply is canned and cycled through in order, per
 * PRODUCT.md's binding rule that nutrition/wellness content is support, not
 * diagnosis, and the assistant must never give medical or dosage advice.
 */

export type ScriptedExchange = {
  id: string;
  userPrompt: string; // what a user might type/tap
  assistantReply: string; // the canned reply text
  recommendedRecipeIds?: string[]; // optional, IDs from the recipes fixture to show as cards
  isSafetyBoundaryDemo?: boolean; // true for the one exchange demonstrating refusal to give medical advice
};

export const scriptedExchanges: ScriptedExchange[] = [
  {
    id: "craving-biryani",
    userPrompt: "I'm craving chicken biryani",
    assistantReply:
      "Totally fair — biryani is mostly about the rice, spice and dum, not the chicken itself. Try the Tamil-style Mushroom Biryani: same seeraga samba rice and masala, mushrooms soaking up the dum flavour instead. It rates close to the original on fullness and satisfaction.",
    recommendedRecipeIds: ["mushroom-biryani"],
  },
  {
    id: "quick-protein-dinner",
    userPrompt: "What's a quick high-protein dinner?",
    assistantReply:
      "Two that come up a lot for quick and high-protein: Chettinad Soya Curry with millet (about 30 min, soya chunks), or a Paneer Bhurji Wrap if you've got 20 minutes and want something handheld.",
    recommendedRecipeIds: ["chettinad-soya-curry", "paneer-bhurji-wrap"],
  },
  {
    id: "vegan-budget",
    userPrompt: "I want something vegan and budget-friendly",
    assistantReply:
      "Millet Sambar Combo and Avial with Red Rice are both in the cheapest cost band and fully vegan — dal, vegetables and pantry spices, nothing exotic to shop for.",
    recommendedRecipeIds: ["millet-sambar-combo", "avial-red-rice"],
  },
  {
    id: "kerala-filling",
    userPrompt: "Suggest a filling Kerala-style meal",
    assistantReply:
      "Kerala Kadala Curry with Appam rates highest on fullness among the Kerala options — black chickpeas in a coconut masala with soft fermented appam.",
    recommendedRecipeIds: ["kerala-kadala-appam"],
  },
  {
    id: "anaemia-safety-boundary",
    userPrompt: "I'm anaemic, what should I take?",
    assistantReply:
      "I can't advise on supplements, dosage or treating anaemia — that needs a doctor who can see your labs. What I can do is point you toward vegetarian foods people commonly eat for iron, as wellness support alongside medical care, never instead of it.",
    isSafetyBoundaryDemo: true,
  },
  {
    id: "weekend-comfort",
    userPrompt: "Any comfort food for the weekend?",
    assistantReply:
      "Punjabi Rajma Chawal or Karnataka Bisi Bele Bath — both run closer to an hour to cook but score high on satisfaction if you've got the weekend for it.",
    recommendedRecipeIds: ["punjabi-rajma-chawal", "karnataka-bisi-bele-bath"],
  },
];
