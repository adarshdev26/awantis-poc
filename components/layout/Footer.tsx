const links = [
  { label: "Work", href: "#intro" },
  { label: "Capabilities", href: "#services" },
  { label: "About", href: "#intro" },
  { label: "Contact", href: "#contact" },
] as const;

export default function Footer() {
  return (
    <footer
      className="relative border-t border-white/10 text-white"
      style={{ backgroundColor: "#121212" }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 md:flex-row md:items-end md:justify-between md:px-10 md:py-14">
        <div>
          <a
            href="/"
            className="font-display text-lg font-extrabold tracking-[0.2em] text-white"
          >
            AWANTIS
          </a>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/45">
            Engineering intelligence for ambitious teams.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm font-medium tracking-wide text-white/55 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-5 text-xs tracking-wide text-white/35 md:flex-row md:items-center md:justify-between md:px-10">
          <p>© 2026 Awantis. All rights reserved.</p>
          <p>Proof of concept — visual and animation showcase.</p>
        </div>
      </div>
    </footer>
  );
}
