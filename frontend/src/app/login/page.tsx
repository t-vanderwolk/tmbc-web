"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState<string | null>(null);

  // Try to authenticate with the provided credentials using the useAuth helper.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);
    try {
      await login(formState.email, formState.password);
    } catch (err) {
      setLocalError("We couldn't log you in. Please check your details.");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl bg-ivory p-10 shadow-soft ring-1 ring-charcoal/10">
      <h1 className="font-display text-3xl text-charcoal">Welcome back</h1>
      <p className="mt-2 text-sm text-charcoal/70">
        Enter your credentials to access your personalized Taylor-Made dashboard.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
        <label className="block text-sm font-semibold text-charcoal">
          Password
          <input
            required
            type="password"
            value={formState.password}
            onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
            className="mt-2 w-full rounded-xl border border-charcoal/20 bg-white px-4 py-3 text-sm shadow-inner focus:border-mauve focus:outline-none focus:ring-2 focus:ring-mauve/40"
            placeholder="••••••••"
          />
        </label>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        {(error || localError) && <p className="text-sm text-red-600">{localError ?? error}</p>}
      </form>
      <p className="mt-4 text-center text-xs text-charcoal/60">
        Forgot password? Concierge reset flows are coming soon.
      </p>
      <p className="mt-6 text-center text-sm text-charcoal/70">
        Need an invite?{" "}
        <Link href="/invite/request" className="font-semibold text-mauve">
          Join the waitlist
        </Link>
      </p>
    </div>
  );
}
