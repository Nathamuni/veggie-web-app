import { redirect } from "next/navigation";

// "More" now lives on the Me page.
export default function MorePage() {
  redirect("/app/settings#more");
}
