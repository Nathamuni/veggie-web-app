"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ModeTag } from "@/components/ui/ModeTag";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { mealLogs } from "@/lib/fixtures";
import { lessons, type Lesson } from "@/lib/fixtures/learn";

const topics: { id: Lesson["topic"]; label: string }[] = [
  { id: "protein", label: "Protein" },
  { id: "iron", label: "Iron" },
  { id: "b12", label: "B12" },
  { id: "transition", label: "Transition" },
  { id: "regional", label: "Regional" },
];

/** Loose, case-insensitive keyword overlap — mealLogs barriers are freeform
 *  sentences, not exact matches of the canonical barrierOptions strings. */
function barriersOverlap(a: string, b: string): boolean {
  const stop = new Set(["with", "that", "this", "from", "have", "were", "your", "there", "about"]);
  const words = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !stop.has(w));
  const aWords = new Set(words(a));
  const shared = words(b).filter((w) => aWords.has(w));
  return shared.length >= 2;
}

function findRecommendedLesson(): { lesson: Lesson; matchedBarrier: string } | null {
  const barrierLogs = mealLogs.filter((m) => !!m.barrier);
  const candidateLessons = lessons.filter((l) => l.triggerBarrier);
  for (const log of barrierLogs) {
    for (const lesson of candidateLessons) {
      if (lesson.triggerBarrier && barriersOverlap(lesson.triggerBarrier, log.barrier!)) {
        return { lesson, matchedBarrier: log.barrier! };
      }
    }
  }
  return null;
}

function LessonModeTags({ lesson }: { lesson: Lesson }) {
  if (lesson.dietModeRelevance === "both") {
    return (
      <div className="flex gap-1.5">
        <ModeTag mode="vegetarian" />
        <ModeTag mode="vegan" />
      </div>
    );
  }
  return <ModeTag mode={lesson.dietModeRelevance} />;
}

export default function LearnPage() {
  const recommended = useMemo(() => findRecommendedLesson(), []);
  const [activeTopics, setActiveTopics] = useState<Lesson["topic"][]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  function toggleTopic(t: Lesson["topic"]) {
    setActiveTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
    setViewedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  const filtered = lessons.filter(
    (l) => activeTopics.length === 0 || activeTopics.includes(l.topic)
  );

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link href="/app" className="mt-5 inline-block text-ink">
          ← Home
        </Link>
        <PageTitle eyebrow="Veggie Learn">Bite-sized lessons</PageTitle>

        <div className="mb-5">
          <ProgressBar value={viewedIds.size} max={lessons.length} label="Lessons viewed" />
        </div>

        {recommended ? (
          <div className="mb-5">
            <p className="mb-2 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
              Recommended for you
            </p>
            <Card className="border-2 border-ink xl:max-w-[75ch]">
              <p className="mb-1 text-[0.75rem] text-ink-soft">
                Because you logged: &ldquo;{recommended.matchedBarrier}&rdquo;
              </p>
              <CardTitle>{recommended.lesson.title}</CardTitle>
              <p className="mb-3 text-[0.875rem] leading-relaxed text-ink-soft">
                {recommended.lesson.summary}
              </p>
              <Button href={recommended.lesson.actionHref}>{recommended.lesson.actionLabel}</Button>
            </Card>
          </div>
        ) : null}

        <div className="mb-4 flex flex-wrap gap-2">
          {topics.map((t) => {
            const selected = activeTopics.includes(t.id);
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => toggleTopic(t.id)}
                className={`rounded-full border px-3 py-1.5 text-[0.8125rem] ${
                  selected ? "border-ink bg-ink text-surface" : "border-hairline bg-surface text-ink"
                }`}
              >
                {t.label}
                {selected ? " ✓" : ""}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 md:grid md:grid-cols-2 md:items-start md:gap-3">
          {filtered.map((lesson) => {
            const expanded = expandedId === lesson.id;
            return (
              <Card key={lesson.id} className={expanded ? "border-2 border-ink" : ""}>
                <button
                  type="button"
                  onClick={() => toggleExpand(lesson.id)}
                  className="flex w-full items-start justify-between gap-3 text-left"
                >
                  <div>
                    <p className="text-[0.9375rem] font-medium">{lesson.title}</p>
                    <p className="mt-1 font-mono text-[0.75rem] text-ink-soft">
                      {lesson.durationMinutes} min · {topics.find((t) => t.id === lesson.topic)?.label}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <LessonModeTags lesson={lesson} />
                    <span className="text-[0.75rem] text-ink-soft">{expanded ? "▲" : "▼"}</span>
                  </div>
                </button>
                <Link
                  href={`/app/learn/${lesson.id}`}
                  className="mt-2 inline-block text-[0.8125rem] text-ink underline underline-offset-2"
                  aria-label={`Read lesson: ${lesson.title}`}
                >
                  Read lesson →
                </Link>

                {expanded ? (
                  <div className="mt-3 border-t border-hairline pt-3">
                    <p className="mb-3 text-[0.875rem] leading-relaxed text-ink-soft">
                      {lesson.summary}
                    </p>
                    <Button href={lesson.actionHref} variant="secondary">
                      {lesson.actionLabel}
                    </Button>
                  </div>
                ) : null}
              </Card>
            );
          })}
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-[0.875rem] text-ink-soft md:col-span-full">
              No lessons match that filter yet.
            </p>
          ) : null}
        </div>
      </Shell>
    </main>
  );
}
