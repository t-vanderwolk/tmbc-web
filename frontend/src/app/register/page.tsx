"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import api from "../../lib/api";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const inviteCodeParam = searchParams.get("code") ?? "";
  const { register, loading, error } = useAuth();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    inviteCode: inviteCodeParam,
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [inviteStatus, setInviteStatus] = useState<"checking" | "valid" | "invalid">(
    inviteCodeParam ? "checking" : "invalid",
  );

  // Confirm the invite code is still active before showing the registration form.
  useEffect(() => {
    if (!inviteCodeParam) {
      setInviteStatus("invalid");
      return;
    }

    const validate = async () => {
      try {
        await api.get(`/invite/validate/${inviteCodeParam}`);
        setInviteStatus("valid");
      } catch (validationError) {
        setInviteStatus("invalid");
      }
    };

    void validate();
  }, [inviteCodeParam]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);
    try {
      await register(formState);
    } catch (err) {
      setLocalError("We couldn't complete your registration.");
    }
  };

  if (inviteStatus === "checking") {
    return <p className="text-charcoal/70">Validating your invite code...</p>;
  }

  if (inviteStatus === "invalid") {
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-ivory p-10 text-center shadow-soft ring-1 ring-charcoal/10">
        <h1 className="font-display text-3xl text-charcoal">Invite required</h1>
        <p className="mt-3 text-charcoal/70">
          We could not validate an invite code. Double-check your link or request access from the
          Taylor-Made concierge team.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl bg-ivory p-10 shadow-soft ring-1 ring-charcoal/10">
      <h1 className="font-display text-3xl text-charcoal">Create your account</h1>
      <p className="mt-2 text-sm text-charcoal/70">
        Enter your invite code and details to unlock the Taylor-Made dashboard. Codes are one-time
        use and provided by our concierge team.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <label className="block text-sm font-semibold text-charcoal">
          Invite code
          <input
            required
            type="text"
            value={formState.inviteCode}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, inviteCode: event.target.value.trim() }))
            }
            className="mt-2 w-full rounded-xl border border-charcoal/20 bg-white px-4 py-3 text-sm uppercase tracking-[0.3em] shadow-inner focus:border-mauve focus:outline-none focus:ring-2 focus:ring-mauve/40"
            placeholder="A1B2C3D4"
          />
        </label>
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
          {loading ? "Creating account..." : "Create account"}
        </Button>
        {(error || localError) && <p className="text-sm text-red-600">{localError ?? error}</p>}
      </form>
    </div>
  );
}
