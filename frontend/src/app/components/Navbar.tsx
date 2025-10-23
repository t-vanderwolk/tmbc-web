import Link from "next/link";

const links = [
  { href: "/invite/request", label: "Request Invite" },
  { href: "/login", label: "Login" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-script text-3xl text-mauve">Taylor-Made Baby Co.</span>
          <span className="text-xs tracking-[0.35em] text-charcoal/70">Learn - Prepare - Connect</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-semibold text-charcoal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-4 py-2 transition-colors hover:bg-blush/80"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
