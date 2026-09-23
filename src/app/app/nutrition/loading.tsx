import { SkeletonPage } from "@/components/ui/Skeleton";

// Never show stale personal nutrition as final while recomputation is pending (§4.2).
export default function Loading() {
  return <SkeletonPage label="Recalculating nutrition from your logged meals…" blocks={3} />;
}
