"use client";

import { Card } from "../components/Card";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function MentorPage() {
  return (
    <ProtectedRoute allowedRoles={["MENTOR"]}>
      {(user) => (
        <div className="space-y-8">
          <header>
            <p className="text-sm uppercase tracking-[0.4em] text-charcoal/60">Mentor HQ</p>
            <h1 className="mt-2 font-display text-4xl text-charcoal">Mentor Dashboard</h1>
            <p className="mt-2 max-w-2xl text-charcoal/70">
              Support each mentee with curated prompts, curriculum checkpoints, and concierge notes.
              This space evolves with every journey.
            </p>
          </header>
          <section className="grid gap-6 md:grid-cols-2">
            <Card title="Mentees" description="Snapshot of current mentees and upcoming sessions.">
              <ul className="mt-3 space-y-2 text-sm text-charcoal/70">
                <li>- Personalized milestones (coming soon)</li>
                <li>- Shared notes between mentors</li>
                <li>- Rolodex of preferred specialists</li>
              </ul>
            </Card>
            <Card title="Resource Library" description="Workshop recordings, guides, and templates.">
              <p className="text-sm text-charcoal/70">
                Upload your favorite references and share them with mentees instantly.
              </p>
            </Card>
          </section>
        </div>
      )}
    </ProtectedRoute>
  );
}
