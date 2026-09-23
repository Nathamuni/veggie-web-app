import { SkeletonPage } from "@/components/ui/Skeleton";

export default function Loading() {
  return <SkeletonPage label="Finding places near you…" blocks={5} />;
}
