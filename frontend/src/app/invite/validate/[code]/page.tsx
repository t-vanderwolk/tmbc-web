"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Button } from "../../../components/Button";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../../lib/api";

type InviteValidation = {
  valid: boolean;
  invite?: { code: string };
};

export default function ValidateInvitePage() {
  const params = useParams();
  const rawCode = params?.code;
  const code = Array.isArray(rawCode) ? rawCode[0] : rawCode ?? "";
  const { register, loading, error } = useAuth();
  const [inviteState, setInviteState] = useState<{ status: "loading" | "invalid" | "valid"; message?: string }>({
    status: "loading",
  });
  const [formState, setFormState] = useState({ name: "", email: "", password: "" });
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Check the invite code once on mount so we only show the registration form when it is valid.
  useEffect(() => {
    const validate = async () => {
      try {
        const response = await api.get<InviteValidation>(`/invite/validate/${code}`);
        if (response.data.valid) {
          setInviteState({ status: "valid" });
        } else {
          setInviteState({ status: "invalid", message: "This invite code has expired or was not found." });
        }
      } catch (error) {
        setInviteState({ status: "invalid", message: "We could not verify this invite code." });
      }
    };

    if (!code) {
      setInviteState({ status: "invalid", message: "Invite code is missing." });
      return;
    }

    void validate();
  }, [code]);

  // Create the user profile with the validated invite code.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionError(null);

    try {
      await register({
        email: formState.email,
        password: formState.password,
        name: formState.name,
        inviteCode: code,
      });
    } catch (submitError) {
      setSubmissionError("Unable to complete registration. Please try again.");
    }
  };

  if (inviteState.status === "loading") {
    return <p className="text-charcoal/70">Validating your invite...</p>;
  }

  if (inviteState.status === "invalid") {
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-ivory p-10 text-center shadow-soft ring-1 ring-charcoal/10">
        <h1 className="font-display text-3xl text-charcoal">Invite not found</h1>
        <p className="mt-3 text-charcoal/70">
          {inviteState.message ??
            "Double-check the link you received or request a new invite from our concierge team."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl bg-ivory p-10 shadow-soft ring-1 ring-charcoal/10">
      <h1 className="font-display text-3xl text-charcoal">Create your Taylor-Made profile</h1>
      <p className="mt-2 text-charcoal/70">
        Invite verified! Complete your details below to unlock the member dashboard and concierge access.
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
          />
        </label>
        <label className="block text-sm font-semibold text-charcoal">
          Password
          <input
            required
            type="password"
            minLength={6}
            value={formState.password}
            onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
            className="mt-2 w-full rounded-xl border border-charcoal/20 bg-white px-4 py-3 text-sm shadow-inner focus:border-mauve focus:outline-none focus:ring-2 focus:ring-mauve/40"
          />
        </label>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating profile..." : "Create Profile"}
        </Button>
        {(submissionError || error) && (
          <p className="text-sm text-red-600">{submissionError ?? error ?? ""}</p>
        )}
      </form>
    </div>
  );
}
