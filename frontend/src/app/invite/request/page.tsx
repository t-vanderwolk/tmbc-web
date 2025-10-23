"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import api from "../../../lib/api";
import { Button } from "../../components/Button";

export default function RequestInvitePage() {
  const router = useRouter();
  const [formState, setFormState] = useState({ name: "", email: "" });
  const [status, setStatus] = useState<{ message: string; tone: "idle" | "success" | "error" }>({
    message: "",
    tone: "idle",
  });
  const [submitting, setSubmitting] = useState(false);

  // Send the invite request to the API and navigate to the confirmation screen.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ message: "", tone: "idle" });

    try {
      await api.post("/invite/request", formState);
      setStatus({
        message: "Request received! Redirecting to confirmation...",
        tone: "success",
      });
      setTimeout(() => router.push("/invite/waitlist"), 800);
    } catch (error) {
      setStatus({
        message: "We couldn't submit your invite request. Please try again.",
        tone: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl bg-ivory p-10 shadow-soft ring-1 ring-charcoal/10">
      <h1 className="font-display text-3xl text-charcoal">Request an Invite</h1>
      <p className="mt-2 text-charcoal/70">
        Share a few details and our concierge team will follow up with next steps. Admins review
        waitlist requests daily.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <label className="block text-sm font-semibold text-charcoal">
          Name
          <input
            required
            type="text"
            value={formState.name}
            onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
            className="mt-2 w-full rounded-xl border border-charcoal/20 bg-white px-4 py-3 text-sm shadow-inner focus:border-mauve focus:outline-none focus:ring-2 focus:ring-mauve/40"
            placeholder="Taylor Hudson"
          />
        </label>
        <label className="block text-sm font-semibold text-charcoal">
          Email
          <input
            required
            type="email"
            value={formState.email}
            onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
            className="mt-2 w-full rounded-xl border border-charcoal/20 bg-white px-4 py-3 text-sm shadow-inner focus:border-mauve focus:outline-none focus:ring-2 focus:ring-mauve/40"
            placeholder="you@example.com"
          />
        </label>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Submitting..." : "Request Invite"}
        </Button>
        {status.message && (
          <p
            className={`text-sm ${
              status.tone === "error"
                ? "text-red-600"
                : status.tone === "success"
                ? "text-mauve"
                : "text-charcoal/70"
            }`}
          >
            {status.message}
          </p>
        )}
      </form>
    </div>
  );
}
