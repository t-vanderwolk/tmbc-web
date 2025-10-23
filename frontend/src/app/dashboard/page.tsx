"use client";

import { Card } from "../components/Card";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function MemberDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["MEMBER"]}>
      {(user) => (
        <div className="space-y-8">
          <header>
            <p className="text-sm uppercase tracking-[0.4em] text-charcoal/60">Welcome</p>
            <h1 className="mt-2 font-display text-4xl text-charcoal">{user.name ?? user.email}</h1>
            <p className="mt-2 max-w-2xl text-charcoal/70">
              Your Taylor-Made journey adapts as baby grows. Explore curated modules below - each one
              tailored to keep you informed, prepared, and connected.
            </p>
          </header>
          <section className="grid gap-6 md:grid-cols-2">
            <Card
              href="/dashboard/academy"
              title="Academy"
              description="Workshops, classes, and expert Q&A sessions for every trimester."
            >
              <p className="text-sm text-charcoal/70">
                Coming soon: live session scheduling and on-demand streaming.
              </p>
            </Card>
            <Card
              href="/dashboard/registry"
              title="Dynamic Registry"
              description="Curated essentials that evolve alongside your baby."
            >
              <p className="text-sm text-charcoal/70">
                Track must-haves, share with family, and get concierge recommendations.
              </p>
            </Card>
            <Card
              href="/dashboard/community"
              title="Community"
              description="Mentorship circles, events, and celebrations."
            >
              <p className="text-sm text-charcoal/70">
                Connect with families at similar stages and RSVP for monthly gatherings.
              </p>
            </Card>
            <Card
              href="/dashboard/concierge"
              title="Concierge"
              description="On-call support for planning, styling, and logistics."
            >
              <p className="text-sm text-charcoal/70">
                Message the concierge team anytime for nursery builds, registry edits, and more.
              </p>
            </Card>
          </section>
        </div>
      )}
    </ProtectedRoute>
  );
}
