import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  ArrowRight,
  Sparkles,
  GraduationCap,
  MapPin,
  CalendarDays,
  Percent,
  FlaskConical,
  Ruler,
  Zap,
  Hash,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free Online Tools – Calculators & Unit Converters | LearnoBoy",
  description:
    "Free online tools for students. Basic & scientific calculator, SGPA→CGPA, SGPA→Percentage, Acre→Bigha, Age Calculator and more — all in one place.",
};

const TOOLS = [
  {
    id: "tool-card-calculator",
    name: "Calculator",
    href: "/tools/calculator",
    tagline: "Basic & Scientific",
    description:
      "A full-featured calculator with two modes — a clean everyday calculator and a powerful scientific one with trig, log, powers, memory, and more.",
    active: true,
    accentFrom: "#6d28d9",
    accentTo: "#4f46e5",
    shadowColor: "rgba(109, 40, 217, 0.18)",
    borderHover: "#6d28d9",
    icon: <Calculator className="w-8 h-8 text-violet-400" />,
    iconBg: "bg-violet-100 dark:bg-violet-950/40",
    badge: "2 Modes",
    badgeColor: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30",
    subItems: [
      {
        icon: <Calculator className="w-4 h-4" />,
        label: "Basic Calculator",
        desc: "Everyday arithmetic",
      },
      {
        icon: <FlaskConical className="w-4 h-4" />,
        label: "Scientific Calculator",
        desc: "sin, cos, log, powers, √…",
      },
    ],
  },
  {
    id: "tool-card-unitconverters",
    name: "Unit Converters",
    href: "/tools/unitconverters",
    tagline: "Grades · Land · Age",
    description:
      "Student-first converters for real-world needs: convert SGPA to CGPA or Percentage, Acres to Bigha (state-wise), and calculate your exact age.",
    active: true,
    accentFrom: "#0891b2",
    accentTo: "#0284c7",
    shadowColor: "rgba(8, 145, 178, 0.18)",
    borderHover: "#0891b2",
    icon: <Ruler className="w-8 h-8 text-cyan-400" />,
    iconBg: "bg-cyan-100 dark:bg-cyan-950/40",
    badge: "4 Converters",
    badgeColor: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30",
    subItems: [
      {
        icon: <GraduationCap className="w-4 h-4" />,
        label: "SGPA → CGPA",
        desc: "Average of semester SGPAs",
      },
      {
        icon: <Percent className="w-4 h-4" />,
        label: "SGPA → Percentage",
        desc: "VTU, Anna Univ & more",
      },
      {
        icon: <MapPin className="w-4 h-4" />,
        label: "Acre ↔ Bigha",
        desc: "12 Indian states",
      },
      {
        icon: <CalendarDays className="w-4 h-4" />,
        label: "Age Calculator",
        desc: "Exact years, months & days",
      },
    ],
  },
];

const FEATURES = [
  {
    id: "feat-instant",
    icon: <Zap className="w-5 h-5 text-yellow-500" />,
    bg: "bg-yellow-50 dark:bg-yellow-950/20",
    title: "Instant Results",
    desc: "Everything runs in your browser — zero latency, no server round-trips.",
  },
  {
    id: "feat-free",
    icon: <Sparkles className="w-5 h-5 text-violet-500" />,
    bg: "bg-violet-50 dark:bg-violet-950/20",
    title: "100% Free",
    desc: "No account, no ads blocking your output. Open to everyone, always.",
  },
  {
    id: "feat-student",
    icon: <GraduationCap className="w-5 h-5 text-green-500" />,
    bg: "bg-green-50 dark:bg-green-950/20",
    title: "Student-First",
    desc: "Built around what Indian university students actually need.",
  },
  {
    id: "feat-land",
    icon: <MapPin className="w-5 h-5 text-orange-500" />,
    bg: "bg-orange-50 dark:bg-orange-950/20",
    title: "State-wise Land Units",
    desc: "Accurate Acre ↔ Bigha ratios for 12 different Indian states.",
  },
  {
    id: "feat-sci",
    icon: <FlaskConical className="w-5 h-5 text-blue-500" />,
    bg: "bg-blue-50 dark:bg-blue-950/20",
    title: "Scientific Mode",
    desc: "Full trig, log, power, factorial & memory functions built in.",
  },
  {
    id: "feat-keyboard",
    icon: <Hash className="w-5 h-5 text-pink-500" />,
    bg: "bg-pink-50 dark:bg-pink-950/20",
    title: "Keyboard Ready",
    desc: "Type your calculations directly — the calculator responds to keyboard input.",
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 38% at 50% -8%, rgba(109,40,217,0.08) 0%, transparent 68%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--link-color)] mb-4 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Free Online Tools — No Sign-up Needed
          </div>
          <h1
            id="tools-hub-title"
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
          >
            LearnoBoy{" "}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
              Tools Hub
            </span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg sm:text-xl leading-relaxed">
            Quick, accurate, student-friendly calculators and converters. Pick a
            tool and get your answer in seconds.
          </p>
        </div>

        {/* Tool cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              id={tool.id}
              className="group select-none"
            >
              <div
                className="relative flex flex-col h-full p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                style={{
                  boxShadow: `0 8px 28px -8px ${tool.shadowColor}`,
                }}
              >
                {/* Hover glow overlay */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${tool.accentFrom}14, ${tool.accentTo}14)`,
                  }}
                />

                {/* Top row */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`p-3 rounded-xl ${tool.iconBg} border border-[var(--border-color)]`}
                  >
                    {tool.icon}
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${tool.badgeColor}`}
                  >
                    {tool.badge}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-1">
                  {tool.name}
                </h2>
                <p className="text-sm font-semibold text-[var(--text-tertiary)] mb-3">
                  {tool.tagline}
                </p>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
                  {tool.description}
                </p>

                {/* Sub-items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  {tool.subItems.map((sub) => (
                    <div
                      key={sub.label}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-color)] text-[var(--text-secondary)]"
                    >
                      <span className="flex-shrink-0 text-[var(--text-tertiary)]">
                        {sub.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                          {sub.label}
                        </p>
                        <p className="text-[10px] text-[var(--text-tertiary)] truncate">
                          {sub.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div
                  className="mt-auto flex items-center gap-1.5 text-sm font-bold transition-colors"
                  style={{ color: tool.accentFrom }}
                >
                  Open {tool.name}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Features */}
        <section
          id="tools-features"
          className="border-t border-[var(--border-color)] pt-16 mb-8"
        >
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-[var(--text-primary)]">
              Why use LearnoBoy Tools?
            </h2>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base">
              Built for real students, not just demos.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.id}
                id={f.id}
                className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]"
              >
                <div className={`p-2.5 rounded-xl ${f.bg} w-fit mb-3`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-base mb-1.5 text-[var(--text-primary)]">
                  {f.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
