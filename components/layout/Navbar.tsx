"use client";

const links = [
  { label: "Work", href: "#intro" },
  { label: "Capabilities", href: "#services" },
  { label: "About", href: "#intro" },
] as const;

export default function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10"
      >
        <a
          href="/"
          data-animate="nav-logo"
          className="font-display text-lg font-extrabold tracking-[0.18em] text-white md:text-xl"
        >
          AWANTIS
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                data-animate="nav-link"
                className="text-sm font-medium tracking-wide text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          data-animate="nav-cta"
          className="hidden items-center gap-2 text-sm font-semibold tracking-wide text-aw-yellow transition-opacity hover:opacity-80 md:inline-flex"
        >
          <span
            aria-hidden
            className="inline-block size-1.5 rounded-full bg-aw-yellow"
          />
          Let&apos;s Talk
        </a>

        <a
          href="#intro"
          data-animate="nav-menu"
          className="text-sm font-medium tracking-wide text-white/80 md:hidden"
        >
          Menu
        </a>
      </nav>
    </header>
  );
}
