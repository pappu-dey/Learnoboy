import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

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
            <div className="flex items-center gap-3">
              {[
                { href: "https://github.com", label: "GitHub" },
                { href: "https://twitter.com", label: "Twitter" },
                { href: "https://linkedin.com", label: "LinkedIn" },
              ].map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--link-color)] transition-all duration-200 text-xs font-bold"
                >
                  <ExternalLink size={12} />
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

        <div
          className="pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-sm text-[var(--text-tertiary)]">
            © {new Date().getFullYear()} LearnoBoy. All rights reserved.
          </p>
          <p className="text-sm text-[var(--text-tertiary)]">
            Built with Next.js 15 & MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
}
