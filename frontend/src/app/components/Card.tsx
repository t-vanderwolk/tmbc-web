import Link from "next/link";
import { ReactNode } from "react";

type CardProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  href?: string;
};

export function Card({ title, description, icon, children, href }: CardProps) {
  const content = (
    <>
      <div className="flex items-center gap-3">
        {icon && <div className="text-3xl text-mauve">{icon}</div>}
        <div>
          <h3 className="text-2xl font-display text-charcoal">{title}</h3>
          {description && <p className="text-sm text-charcoal/70">{description}</p>}
        </div>
      </div>
      {children}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex flex-col gap-3 rounded-2xl bg-ivory p-6 shadow-soft ring-1 ring-charcoal/10 transition hover:-translate-y-1 hover:shadow-lg"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-ivory p-6 shadow-soft ring-1 ring-charcoal/10">
      {content}
    </div>
  );
}
