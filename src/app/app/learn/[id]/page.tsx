import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ModeTag } from "@/components/ui/ModeTag";
import { SourceLabel } from "@/components/ui/SourceLabel";
import { lessons, type Lesson } from "@/lib/fixtures/learn";

const topicLabels: Record<Lesson["topic"], string> = {
  protein: "Protein",
  iron: "Iron",
  b12: "B12",
  transition: "Transition",
  regional: "Regional",
};

const nutritionTopics: Lesson["topic"][] = ["protein", "iron", "b12"];

export function generateStaticParams() {
  return lessons.map((l) => ({ id: l.id }));
}

/** S22 lesson detail. Every lesson ends in one concrete action — a lesson that
 *  doesn't lead to an action isn't shipped (PRD). */
export default async function LessonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = lessons.find((l) => l.id === id);
  if (!lesson) notFound();

  const isNutrition = nutritionTopics.includes(lesson.topic);

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link href="/app/learn" className="mt-5 inline-block text-ink">
          ← Veggie Learn
        </Link>
        <PageTitle eyebrow={`${topicLabels[lesson.topic]} · ${lesson.durationMinutes} min read`}>
          {lesson.title}
        </PageTitle>

        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
        <div className="max-w-prose">
        <div className="mb-5 flex flex-wrap items-center gap-1.5">
          {lesson.dietModeRelevance === "both" ? (
            <>
              <ModeTag mode="vegetarian" />
              <ModeTag mode="vegan" />
            </>
          ) : (
            <>
              <ModeTag mode={lesson.dietModeRelevance} />
              <span className="text-[0.75rem] text-ink-soft">
                Written for {lesson.dietModeRelevance} eaters
              </span>
            </>
          )}
        </div>

        {lesson.triggerBarrier ? (
          <p className="mb-4 text-[0.8125rem] text-ink-soft">
            Helpful when: &ldquo;{lesson.triggerBarrier}&rdquo;
          </p>
        ) : null}

        <article className="mb-5">
          <p className="mb-4 text-[0.9375rem] font-medium leading-relaxed">{lesson.summary}</p>
          {lesson.body.map((para, i) => (
            <p key={i} className="mb-3 text-[0.9375rem] leading-relaxed text-ink">
              {para}
            </p>
          ))}
        </article>

        {isNutrition ? (
          <Card className="mb-5">
            <p className="text-[0.8125rem] text-ink-soft">
              Veggie is wellness support, not medical advice. For questions about your health,
              symptoms or supplements, speak to a qualified professional.
            </p>
          </Card>
        ) : null}
        </div>

        <aside className="xl:sticky xl:top-6 xl:self-start">
        <div className="mb-6 rounded-[6px] border border-hairline bg-surface p-4">
          <label className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-2">
            <input type="checkbox" className="peer h-5 w-5 shrink-0 accent-curry-leaf" />
            <span className="text-[0.9375rem] font-medium">Mark lesson as done</span>
            <span className="hidden w-full text-[0.8125rem] text-curry-leaf peer-checked:block">
              Done — now put it on a plate.
            </span>
          </label>
        </div>

        <section aria-labelledby="lesson-action">
          <h2 id="lesson-action" className="mb-2 text-[1.125rem] font-semibold leading-tight">
            Try it next
          </h2>
          <Button href={lesson.actionHref} className="w-full">
            {lesson.actionLabel}
          </Button>
          <p className="mt-3">
            <SourceLabel>Prototype lesson · placeholder content</SourceLabel>
          </p>
        </section>
        </aside>
        </div>
      </Shell>
    </main>
  );
}
