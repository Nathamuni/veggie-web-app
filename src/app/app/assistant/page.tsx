"use client";

import { useState } from "react";
import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Button } from "@/components/ui/Button";
import { ModeTag } from "@/components/ui/ModeTag";
import { recipes } from "@/lib/fixtures";
import { scriptedExchanges } from "@/lib/fixtures/assistant";

type Turn = {
  key: string;
  role: "user" | "assistant";
  text: string;
  recommendedRecipeIds?: string[];
  isSafetyBoundaryDemo?: boolean;
};

const SEED_COUNT = 2;

function seedTurns(): Turn[] {
  return scriptedExchanges.slice(0, SEED_COUNT).flatMap((ex, i) => [
    { key: `seed-${i}-user`, role: "user" as const, text: ex.userPrompt },
    {
      key: `seed-${i}-assistant`,
      role: "assistant" as const,
      text: ex.assistantReply,
      recommendedRecipeIds: ex.recommendedRecipeIds,
      isSafetyBoundaryDemo: ex.isSafetyBoundaryDemo,
    },
  ]);
}

function RecipeMiniCard({ id }: { id: string }) {
  const recipe = recipes.find((r) => r.id === id);
  if (!recipe) return null;
  return (
    <div className="flex items-center justify-between gap-3 rounded-[6px] border border-hairline bg-surface px-3 py-2.5">
      <div>
        <p className="text-[0.8125rem] font-medium leading-snug">{recipe.name}</p>
        <p className="text-[0.75rem] text-ink-soft">
          {recipe.cuisine} · {recipe.timeMinutes} min · {recipe.costBand}
        </p>
      </div>
      <ModeTag mode={recipe.dietMode} />
    </div>
  );
}

function TurnRow({ turn }: { turn: Turn }) {
  const isAssistant = turn.role === "assistant";
  const isBoundary = !!turn.isSafetyBoundaryDemo;
  return (
    <div
      className={`border-b border-hairline pb-4 last:border-none ${
        isBoundary ? "border-l-2 border-l-rust pl-3" : ""
      }`}
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
          {isAssistant ? "Assistant" : "You"}
        </span>
        {isBoundary ? <ModeTag mode="warning" label="Not medical advice" /> : null}
      </div>
      <p className={`text-[0.9375rem] leading-snug ${isBoundary ? "text-rust" : "text-ink"}`}>
        {turn.text}
      </p>
      {turn.recommendedRecipeIds?.length ? (
        <div className="mt-2 flex flex-col gap-2 md:grid md:grid-cols-2">
          {turn.recommendedRecipeIds.map((id) => (
            <RecipeMiniCard key={id} id={id} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function AssistantPage() {
  const [turns, setTurns] = useState<Turn[]>(seedTurns);
  const [nextIndex, setNextIndex] = useState(SEED_COUNT);
  const [draft, setDraft] = useState("");

  function handleSend() {
    const text = draft.trim();
    if (!text) return;

    const exchange = scriptedExchanges[nextIndex % scriptedExchanges.length];
    const stamp = Date.now();

    setTurns((prev) => [
      ...prev,
      { key: `t${stamp}-user`, role: "user", text },
      {
        key: `t${stamp}-assistant`,
        role: "assistant",
        text: exchange.assistantReply,
        recommendedRecipeIds: exchange.recommendedRecipeIds,
        isSafetyBoundaryDemo: exchange.isSafetyBoundaryDemo,
      },
    ]);
    setNextIndex((i) => i + 1);
    setDraft("");
  }

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <div className="xl:mx-auto xl:max-w-[720px]">
        <Link href="/app" className="mt-5 inline-block text-ink">
          ← Home
        </Link>
        <PageTitle eyebrow="Ask Veggie">AI Assistant</PageTitle>

        <div className="mb-5 rounded-[6px] border border-hairline bg-surface px-3 py-2.5">
          <p className="text-[0.75rem] text-ink-soft">
            Prototype — responses are scripted, not a live AI model.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {turns.map((turn) => (
            <TurnRow key={turn.key} turn={turn} />
          ))}
        </div>

        <form
          className="mt-6 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask about a swap, a recipe, a craving…"
            className="flex-1 rounded-[6px] border border-hairline bg-surface px-3 py-2.5 text-[0.875rem] outline-none focus:border-turmeric"
          />
          <Button type="submit">Send</Button>
        </form>
        </div>
      </Shell>
    </main>
  );
}
