import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = {
  Learn: [
    { href: "/javascript", label: "JavaScript" },
    { href: "/python", label: "Python" },
    { href: "/data-structures", label: "Data Structures" },
    { href: "/web-development", label: "Web Development" },
    { href: "/databases", label: "Databases" },
  ],
  Platform: [
    { href: "/", label: "Home" },
    { href: "/search", label: "Search Articles" },
    { href: "/admin", label: "Admin" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

const SOCIAL_LINKS = [
  {
    href: "https://github.com",
    label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .319.216.694.825.576C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    href: "https://twitter.com",
    label: "Twitter / X",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer
      className="border-t border-[var(--border-color)] mt-20"
      style={{ background: "var(--bg-surface)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex mb-4">
              <Image
                src="/images/logo-gif.gif"
                alt="LearnoBoy"
                width={300}
                height={300}
                unoptimized
                style={{ height: "200px", width: "auto", borderRadius: "30%" }}
              />
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              A premium educational platform for developers, students, and
              technical readers.
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--link-color)] hover:border-[var(--link-color)] hover:bg-[var(--link-color)]/5 transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--link-color)] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-[var(--text-tertiary)]">
            © {new Date().getFullYear()} LearnoBoy. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-sm text-[var(--text-tertiary)]">
            <span>Made with</span>
            {/* Heart SVG */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              width="14"
              height="14"
              className="text-red-500"
              aria-hidden="true"
            >
              <path d="M12 21.593c-.525-.327-3.695-2.366-5.865-4.55C3.915 14.788 2 12.41 2 9.5 2 6.462 4.462 4 7.5 4c1.59 0 3.09.748 4.5 2.25C13.41 4.748 14.91 4 16.5 4 19.538 4 22 6.462 22 9.5c0 2.91-1.916 5.288-4.135 7.543C15.695 19.227 12.525 21.266 12 21.593z" />
            </svg>
            <span>for learners everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}