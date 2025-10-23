import Link, { LinkProps } from "next/link";
import { ComponentPropsWithoutRef, ReactNode } from "react";

const cn = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(" ");

const baseStyles =
  "inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<"primary" | "secondary" | "ghost", string> = {
  primary: "bg-mauve text-charcoal hover:bg-gold focus-visible:outline-mauve",
  secondary: "bg-charcoal text-ivory hover:bg-mauve hover:text-charcoal focus-visible:outline-charcoal",
  ghost:
    "bg-transparent text-charcoal hover:bg-blush/60 focus-visible:outline-charcoal border border-charcoal/10",
};

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={cn(baseStyles, variants[variant], className)} {...props} />;
}

type LinkButtonProps = LinkProps &
  Omit<ComponentPropsWithoutRef<"a">, "href"> & {
    variant?: "primary" | "secondary" | "ghost";
    children: ReactNode;
  };

export function LinkButton({ className, variant = "primary", children, ...props }: LinkButtonProps) {
  return (
    <Link className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}
