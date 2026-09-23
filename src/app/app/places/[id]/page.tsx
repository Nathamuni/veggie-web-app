import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell, PageTitle } from "@/components/ui/Shell";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SourceLabel, DataUnavailable } from "@/components/ui/SourceLabel";
import { DietStatus } from "@/components/ui/DietStatus";
import { EmptyState } from "@/components/ui/EmptyState";
import { parsePlaceId, placeById, PlacesUnavailableError, type Place } from "@/domain/places/osm";

const dietCopy: Record<Place["vegetarian"], string> = {
  only: "Only",
  yes: "Options available",
  no: "Not available",
  unknown: "Not mapped yet",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-hairline py-2.5 last:border-b-0">
      <span className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">{label}</span>
      <span className="text-right text-[0.875rem]">{children}</span>
    </div>
  );
}

export default async function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ref = parsePlaceId(id);
  if (!ref) notFound();

  let place: Place | null;
  try {
    place = await placeById(ref.osmType, ref.osmId);
  } catch (error) {
    if (!(error instanceof PlacesUnavailableError)) throw error;
    return (
      <main className="flex-1 pb-8">
        <Shell>
          <Link href="/app/discover" className="mt-5 inline-block text-ink">
            ← Discover
          </Link>
          <PageTitle eyebrow="Place">Couldn&apos;t load this place</PageTitle>
          <EmptyState
            title="Map data is busy"
            reason="The OpenStreetMap servers didn't answer in time. Nothing is wrong with your account."
            actionHref={`/app/places/${id}`}
            actionLabel="Try again"
          />
        </Shell>
      </main>
    );
  }
  if (!place) notFound();

  const osmUrl = `https://www.openstreetmap.org/${place.osmType}/${place.osmId}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
  const d = 0.004;
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${place.lng - d},${place.lat - d},${place.lng + d},${place.lat + d}&layer=mapnik&marker=${place.lat},${place.lng}`;

  return (
    <main className="flex-1 pb-8">
      <Shell>
        <Link href="/app/discover" className="mt-5 inline-block text-ink">
          ← Discover
        </Link>
        <PageTitle eyebrow={place.kind.replaceAll("_", " ")}>{place.name}</PageTitle>

        <div className="mb-4 flex justify-start">
          <DietStatus place={place} />
        </div>

        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
        <aside className="xl:sticky xl:top-6 xl:col-start-2 xl:row-start-1 xl:self-start">
        <div className="mb-4 overflow-hidden rounded-[6px] border border-hairline">
          <iframe title={`Map showing ${place.name}`} src={embed} className="h-48 w-full xl:h-64" loading="lazy" />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <Button href={directions} className="w-full">
            Directions
          </Button>
          {place.phone ? (
            <Button href={`tel:${place.phone.split(";")[0].replace(/\s/g, "")}`} variant="secondary" className="w-full">
              Call
            </Button>
          ) : (
            <Button variant="secondary" className="w-full" disabled>
              No phone mapped
            </Button>
          )}
        </div>
        </aside>

        <div className="min-w-0 xl:col-start-1 xl:row-start-1">
        <Card className="mb-4">
          <CardTitle>Diet suitability</CardTitle>
          <Row label="Vegetarian">{dietCopy[place.vegetarian]}</Row>
          <Row label="Vegan">{dietCopy[place.vegan]}</Row>
          <p className="mt-2">
            <SourceLabel>Declared by OpenStreetMap contributors · not verified by Veggie</SourceLabel>
          </p>
          {place.vegetarian === "unknown" && place.vegan === "unknown" ? (
            <p className="mt-2 max-w-prose text-[0.8125rem] text-ink-soft">
              Nobody has mapped this place&apos;s diet options yet. It may still serve vegetarian food —
              we just won&apos;t guess.
            </p>
          ) : null}
        </Card>

        <Card className="mb-4">
          <CardTitle>Details</CardTitle>
          <Row label="Cuisine">
            {place.cuisines.length ? <span className="capitalize">{place.cuisines.join(", ")}</span> : <DataUnavailable />}
          </Row>
          <Row label="Hours">{place.openingHours ?? <DataUnavailable />}</Row>
          <Row label="Address">{place.address ?? <DataUnavailable />}</Row>
          <Row label="Website">
            {place.website ? (
              <a href={place.website} target="_blank" rel="noreferrer" className="break-all underline">
                {place.website.replace(/^https?:\/\//, "")}
              </a>
            ) : (
              <DataUnavailable />
            )}
          </Row>
        </Card>

        <Card className="mb-4">
          <CardTitle>Ratings</CardTitle>
          <Row label="Veggie Rating">
            <DataUnavailable />
          </Row>
          <p className="mt-2 max-w-prose text-[0.8125rem] text-ink-soft">
            No Veggie diners have rated this place yet. External ratings are shown separately once the
            live listing source is switched on.
          </p>
        </Card>

        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap">
          <Button href={`/app/log?dish=${encodeURIComponent(`Meal at ${place.name}`)}`} variant="secondary">
            I ate here — log it
          </Button>
          <Button href={`${osmUrl}#map=19/${place.lat}/${place.lng}`} variant="ghost">
            Something wrong? Correct it on OpenStreetMap
          </Button>
        </div>

        <p className="mt-4">
          <SourceLabel>
            ©{" "}
            <a href="https://www.openstreetmap.org/copyright" className="underline" target="_blank" rel="noreferrer">
              OpenStreetMap contributors
            </a>{" "}
            (ODbL) ·{" "}
            <a href={osmUrl} className="underline" target="_blank" rel="noreferrer">
              source record
            </a>
          </SourceLabel>
        </p>
        </div>
        </div>
      </Shell>
    </main>
  );
}
