import { LinkButton } from "../../components/Button";

export default function WaitlistConfirmationPage() {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl bg-ivory p-10 text-center shadow-soft ring-1 ring-charcoal/10">
      <h1 className="font-display text-3xl text-charcoal">You&apos;re on the list!</h1>
      <p className="mt-3 text-charcoal/70">
        Thank you for trusting Taylor-Made Baby Co. Our concierge team reviews new requests each
        day. Once approved, you&apos;ll receive a unique invite code to set up your profile.
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <LinkButton variant="primary" href="/">
          Back to Home
        </LinkButton>
        <LinkButton variant="ghost" href="/login">
          Head to Login
        </LinkButton>
      </div>
    </div>
  );
}
