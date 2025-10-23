import Link from "next/link";

import { LinkButton } from "./components/Button";

export default function Home() {
  return (
    <div className="flex flex-col-reverse gap-12 lg:flex-row lg:items-center">
      <section className="flex-1 space-y-6">
        <span className="inline-block rounded-full bg-blush/60 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-charcoal/70">
          Tailored guidance for modern families
        </span>
        <h1 className="font-script text-6xl text-mauve lg:text-7xl">Learn • Prepare • Connect</h1>
        <p className="max-w-xl text-lg text-charcoal/80">
          Personalized mentorship, curated resources, and a concierge-style registry that grows
          with you. Taylor-Made Baby Co. brings experts, mentors, and members together for every
          step of your parenting journey.
        </p>
        <div className="flex flex-wrap gap-4">
          <LinkButton href="/invite/request">Request an Invite</LinkButton>
          <LinkButton variant="ghost" href="/login">
            Already invited? Login
          </LinkButton>
        </div>
      </section>
      <aside className="flex-1">
        <div className="rounded-[2.5rem] border border-charcoal/10 bg-ivory p-10 shadow-soft">
          <h2 className="mb-6 font-display text-3xl text-charcoal">Your Taylor-Made Experience</h2>
          <ul className="space-y-4 text-charcoal/80">
            <li>
              <strong className="font-display text-mauve">Mentorship:</strong> One-on-one support
              with seasoned parents and doulas.
            </li>
            <li>
              <strong className="font-display text-mauve">Dynamic Registry:</strong> Curated
              essentials that adapt as your baby grows.
            </li>
            <li>
              <strong className="font-display text-mauve">Community:</strong> Circles that celebrate
              milestones and hold space for every question.
            </li>
            <li>
              <strong className="font-display text-mauve">Concierge:</strong> On-call experts ready
              for nursery setups, events, and beyond.
            </li>
          </ul>
          <Link
            href="/invite/request"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-charcoal"
          >
            Join the waitlist &rarr;
          </Link>
        </div>
      </aside>
    </div>
  );
}
