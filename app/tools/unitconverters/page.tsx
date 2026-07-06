import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  MapPin,
  CalendarDays,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free Online Unit Converters & Calculators | LearnoBoy Tools",
  description:
    "Free online converters for students — Academic SGPA/CGPA calculator, Land Area converter (Acre to Bigha by state), Age Calculator, and Simple & Compound Interest calculator.",
  keywords: [
    "SGPA to CGPA",
    "SGPA to percentage",
    "acre to bigha",
    "age calculator",
    "interest calculator",
    "online unit converter",
    "student calculator",
  ],
};

const CONVERTERS = [
  {
    id: "academic",
    title: "Academic Calculator",
    href: "/tools/unitconverters/academic",
    description:
      "Convert SGPA to CGPA and SGPA to Percentage using formulas from VTU, Anna University, GGSIPU, Delhi University and more universities.",
    icon: GraduationCap,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-100 dark:bg-violet-950/40",
    shadow: "rgba(109,40,217,0.15)",
    ctaColor: "text-violet-600 dark:text-violet-400",
    tags: ["SGPA → CGPA", "SGPA → %", "VTU", "Anna Univ", "GGSIPU"],
  },
  {
    id: "area",
    title: "Area Converter",
    href: "/tools/unitconverters/area",
    description:
      "Convert land area units — Acre to Bigha (12 Indian states), Square Feet to Square Meters, Hectare to Acre, and more with instant results.",
    icon: MapPin,
    iconColor: "text-green-400",
    iconBg: "bg-green-100 dark:bg-green-950/40",
    shadow: "rgba(34,197,94,0.12)",
    ctaColor: "text-green-600 dark:text-green-400",
    tags: ["Acre → Bigha", "Sqft → Sqm", "Hectare", "12 States"],
  },
  {
    id: "age",
    title: "Age Calculator",
    href: "/tools/unitconverters/age",
    description:
      "Calculate your exact age in years, months, and days. Also shows total days lived, next birthday countdown, and supports a custom reference date.",
    icon: CalendarDays,
    iconColor: "text-orange-400",
    iconBg: "bg-orange-100 dark:bg-orange-950/40",
    shadow: "rgba(249,115,22,0.12)",
    ctaColor: "text-orange-600 dark:text-orange-400",
    tags: ["Exact Age", "Days Lived", "Next Birthday", "Custom Date"],
  },
  {
    id: "interest",
    title: "Interest Calculator",
    href: "/tools/unitconverters/interest",
    description:
      "Calculate Simple Interest and Compound Interest with principal, rate, and time. Includes EMI calculator with monthly breakdown and amortization.",
    icon: TrendingUp,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-950/40",
    shadow: "rgba(59,130,246,0.12)",
    ctaColor: "text-blue-600 dark:text-blue-400",
    tags: ["Simple Interest", "Compound Interest", "EMI", "Loan"],
  },
];

export default function UnitConvertersHub() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 35% at 50% -5%, rgba(8,145,178,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] mb-10" aria-label="Breadcrumb">
          <Link href="/tools" className="hover:text-[var(--link-color)] transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--text-primary)] font-semibold">Unit Converters</span>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--link-color)] mb-4">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            4 Free Converters — No Account Needed
          </div>
          <h1
            id="unitconverters-hub-title"
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
          >
            Free Online{" "}
            <span className="bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Unit Converters
            </span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
            A collection of accurate, student-first calculators and converters.
            No ads, no sign-up — just instant results.
          </p>
        </div>

        {/* Converter cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-20">
          {CONVERTERS.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.id}
                href={c.href}
                id={`converter-card-${c.id}`}
                className="group block"
              >
                <article
                  className="relative h-full p-7 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  style={{ boxShadow: `0 6px 24px -6px ${c.shadow}` }}
                >
                  {/* Hover glow */}
                  <div
                    aria-hidden="true"
                    className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${c.shadow.replace("0.15", "0.06").replace("0.12", "0.05")} 0%, transparent 70%)`,
                    }}
                  />

                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl border border-[var(--border-color)] ${c.iconBg} flex-shrink-0`}>
                      <Icon className={`w-7 h-7 ${c.iconColor}`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[var(--text-primary)]">
                        {c.title}
                      </h2>
                      <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
                        {c.description}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {c.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-[var(--bg-muted)] text-[var(--text-tertiary)] border border-[var(--border-color)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className={`flex items-center gap-1.5 text-sm font-bold ${c.ctaColor} transition-colors`}>
                    Open {c.title}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {/* Why section */}
        <section id="why-section" className="border-t border-[var(--border-color)] pt-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 text-[var(--text-primary)]">
            Designed for Students, Built for Accuracy
          </h2>
          <p className="text-center text-[var(--text-secondary)] text-base max-w-2xl mx-auto mb-10">
            Every converter uses real, verified formulas from official university
            guidelines and standard measurement systems.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { title: "Accurate Formulas", desc: "Academic conversions follow official VTU, Anna University and UGC guidelines." },
              { title: "State-Wise Ratios", desc: "Acre to Bigha ratios differ per state — we cover 12 major Indian states correctly." },
              { title: "100% Free", desc: "No ads, no subscriptions, no popups. All tools are permanently free." },
            ].map((f) => (
              <div key={f.title} className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                <h3 className="font-bold text-base text-[var(--text-primary)] mb-1.5">{f.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
