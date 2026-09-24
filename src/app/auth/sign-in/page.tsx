import { Shell, PageTitle } from "@/components/ui/Shell";
import { SignInForm } from "./SignInForm";

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <main className="flex-1 pb-16">
      <Shell width="narrow">
        {/* md+: the form sits in a hairline-bordered sheet on the paper background. */}
        <div className="md:mt-12 md:rounded-[6px] md:border md:border-hairline md:bg-surface md:px-8 md:pb-8 md:pt-2">
          <PageTitle eyebrow="Welcome back">Sign in</PageTitle>
          <SignInForm next={next} />
        </div>
      </Shell>
    </main>
  );
}
