import type { ReactNode } from "react";
import { ModeTag } from "@/components/ui/ModeTag";
import type { Place } from "@/domain/places/osm";

/** Diet status exactly as OSM contributors declared it — never inferred. */
export function DietStatus({ place }: { place: Pick<Place, "vegetarian" | "vegan"> }) {
  if (place.vegan === "only") return <ModeTag mode="vegan" label="Vegan only" />;
  if (place.vegetarian === "only")
    return (
      <span className="flex flex-wrap justify-end gap-1">
        <ModeTag mode="vegetarian" label="Pure veg" />
        {place.vegan === "yes" ? <ModeTag mode="vegan" label="Vegan options" /> : null}
      </span>
    );
  const tags: ReactNode[] = [];
  if (place.vegetarian === "yes") tags.push(<ModeTag key="veg" mode="vegetarian" label="Veg options" />);
  if (place.vegan === "yes") tags.push(<ModeTag key="vegan" mode="vegan" label="Vegan options" />);
  if (tags.length) return <span className="flex flex-wrap justify-end gap-1">{tags}</span>;
  return <ModeTag mode="neutral" label="Unverified" />;
}
