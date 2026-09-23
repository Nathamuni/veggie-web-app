import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[4px] px-5 py-3 text-[0.9375rem] font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-turmeric text-surface hover:bg-turmeric-deep",
  secondary: "bg-surface text-ink border border-hairline hover:border-ink-soft",
  ghost: "text-ink underline-offset-4 hover:underline",
};

export function Button({
  variant = "primary",
  className = "",
  href,
  children,
  ...rest
}: {
  variant?: Variant;
  className?: string;
  href?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
