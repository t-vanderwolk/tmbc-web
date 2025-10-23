"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ProtectedRoute } from "../components/ProtectedRoute";
import api from "../../lib/api";
import type { Invite, User, WaitlistEntry } from "../../types";

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      {(user) => <AdminDashboard user={user} />}
    </ProtectedRoute>
  );
}

function AdminDashboard({ user }: { user: User }) {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Pull the latest invite + waitlist info once the admin view renders.
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [waitlistResponse, inviteResponse] = await Promise.all([
        api.get<{ waitlist: WaitlistEntry[] }>("/invite/waitlist"),
        api.get<{ invites: Invite[] }>("/admin/invites"),
      ]);
      setWaitlist(waitlistResponse.data.waitlist ?? []);
      setInvites(inviteResponse.data.invites ?? []);
    } catch (fetchError) {
      setError("Unable to load admin data. Please try again.");
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // Approve a waitlist entry and refresh the data grid.
  const handleApprove = async (entry: WaitlistEntry) => {
    try {
      setBusyId(entry.id);
      await api.post("/invite/approve", { id: entry.id });
      await fetchData();
    } catch (approveError) {
      setError("We couldn't approve that request. Please retry.");
    } finally {
      setBusyId(null);
    }
  };

  // Create a blank invite code that the concierge can share manually.
  const handleCreateInvite = async () => {
    try {
      setBusyId("create");
      await api.post("/invite", {});
      await fetchData();
    } catch (createError) {
      setError("Unable to create a new invite code.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-charcoal/60">Admin HQ</p>
          <h1 className="mt-2 font-display text-4xl text-charcoal">Invite Management</h1>
          <p className="text-xs text-charcoal/60">Signed in as {user.email}</p>
          <p className="mt-2 max-w-2xl text-charcoal/70">
            Approve new families, generate codes, and keep the Taylor-Made community curated and
            intentional.
          </p>
        </div>
        <Button onClick={handleCreateInvite} disabled={busyId === "create"}>
          {busyId === "create" ? "Generating..." : "Create invite"}
        </Button>
      </header>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <section className="grid gap-6 md:grid-cols-2">
        <Card title="Waitlist" description="Approve requests to send personalized invite codes.">
          <div className="mt-4 space-y-4">
            {waitlist.length === 0 && (
              <p className="text-sm text-charcoal/60">No pending requests right now.</p>
            )}
            {waitlist.map((entry) => (
              <div key={entry.id} className="rounded-xl border border-charcoal/10 p-4">
                <p className="font-semibold text-charcoal">{entry.name ?? entry.email}</p>
                <p className="text-sm text-charcoal/60">{entry.email}</p>
                <Button
                  variant="secondary"
                  className="mt-3 w-full md:w-auto"
                  onClick={() => handleApprove(entry)}
                  disabled={busyId === entry.id}
                >
                  {busyId === entry.id ? "Approving..." : "Approve & create invite"}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Active Invites" description="Share codes directly with families ready to onboard.">
          <div className="mt-4 space-y-3">
            {invites.length === 0 && (
              <p className="text-sm text-charcoal/60">No invites generated yet.</p>
            )}
            {invites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                <div>
                  <p className="font-semibold text-charcoal">{invite.code}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-charcoal/50">
                    {invite.used ? "Used" : "Available"}
                  </p>
                </div>
                <span className="text-xs text-charcoal/50">
                  {new Date(invite.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
