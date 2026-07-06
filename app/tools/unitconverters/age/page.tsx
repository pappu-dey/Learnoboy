import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import AgeTool from "./AgeTool";

export const metadata: Metadata = {
  title: "Age Calculator – Find Your Exact Age in Years, Months & Days | LearnoBoy",
  description:
    "Free online age calculator. Find your exact age in years, months, and days from your date of birth. Shows total days lived, weeks, hours, next birthday countdown, day you were born, and zodiac sign.",
  keywords: ["age calculator", "how old am I", "calculate age from date of birth", "exact age calculator", "days lived calculator", "next birthday calculator", "zodiac sign by birthday"],
  openGraph: {
    title: "Age Calculator – Exact Age in Years, Months & Days | LearnoBoy",
    description: "Calculate your exact age, total days lived, next birthday countdown and zodiac sign. Free and instant.",
    type: "website",
  },
};

const FAQ = [
  {
    q: "How to calculate age from date of birth?",
    a: "To calculate age: subtract the birth year from the current year to get years. If the birthday hasn't occurred yet this year, subtract one. Then calculate remaining months and days similarly. For example, if born on 15 March 2000 and today is 4 July 2026, the age is 26 years, 3 months, and 19 days.",
  },
  {
    q: "What is the reference date option used for?",
    a: "The reference date option lets you calculate age as of a specific date — not just today. This is useful for age-eligibility checks (e.g. a job application cutoff, exam date, or scholarship deadline).",
  },
  {
    q: "How many days old am I?",
    a: "To find your total days lived, multiply years by 365.25 (accounting for leap years) and add the remaining months and days. Our calculator computes this precisely using the actual calendar, giving your exact total days.",
  },
  {
    q: "How do I find what day of the week I was born on?",
    a: "Our age calculator automatically shows the day of the week you were born (e.g. Monday, Friday) based on your date of birth using Zeller's algorithm.",
  },
  {
    q: "How is the next birthday countdown calculated?",
    a: "The calculator finds your birthday in the current calendar year. If it has already passed, it moves to next year. Then it counts the days from today (or your reference date) to that upcoming birthday.",
  },
  {
    q: "Does this age calculator account for leap years?",
    a: "Yes. Our calculator uses the actual Gregorian calendar system which correctly handles leap years (years divisible by 4, except century years not divisible by 400). This ensures your total days lived is always accurate.",
  },
];

export default function AgePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 55% 35% at 50% -5%, rgba(249,115,22,0.06) 0%, transparent 70%)" }} />

      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] mb-8" aria-label="Breadcrumb">
          <Link href="/tools" className="hover:text-[var(--link-color)] transition-colors flex items-center gap-1"><ArrowLeft className="w-4 h-4" />Tools</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/tools/unitconverters" className="hover:text-[var(--link-color)] transition-colors">Converters</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--text-primary)] font-semibold">Age Calculator</span>
        </nav>

        {/* Hero */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-orange-600 dark:text-orange-400 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Free Online Age Calculator
          </div>
          <h1 id="age-calc-title" className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Age Calculator –{" "}
            <span className="bg-gradient-to-r from-orange-600 to-pink-500 bg-clip-text text-transparent">
              Exact Years, Months & Days
            </span>
          </h1>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed max-w-2xl">
            Find your exact age from your date of birth. Includes total days lived,
            total weeks, hours, next birthday countdown, the day you were born, and your zodiac sign.
          </p>
        </header>

        {/* ── Interactive Tool ── */}
        <AgeTool />

        {/* ── What is it ── */}
        <section id="about-age-calculator" className="mt-14">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">What This Age Calculator Tells You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Exact Age",           desc: "Precise breakdown in years, months, and days — not just a rough year count." },
              { title: "Total Days Lived",    desc: "The exact number of days from your birth date to today (or any reference date)." },
              { title: "Total Weeks & Hours", desc: "How many complete weeks and approximate hours you have been alive." },
              { title: "Next Birthday",       desc: "Days remaining until your next birthday — so you never miss the countdown." },
              { title: "Day You Were Born",   desc: "Find out whether you arrived on a Monday, Friday, or any other day of the week." },
              { title: "Zodiac Sign",         desc: "Your Western astrology zodiac sign based on your birth month and day." },
            ].map((f) => (
              <div key={f.title} className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1.5">{f.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How age is calculated ── */}
        <section id="how-age-calculated" className="mt-12">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">How Age is Calculated</h2>
          <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              Age is calculated by subtracting your birth date from the reference date (today by default) using the Gregorian calendar:
            </p>
            <ol className="space-y-3">
              {[
                "Start with the year difference: Current Year − Birth Year.",
                "Subtract the month difference. If the current month is before the birth month, reduce the year count by 1 and adjust months.",
                "Subtract the day difference. If the current day is before the birth day, borrow days from the previous month.",
                "Total days = (Reference Date − Birth Date) ÷ 86,400,000 milliseconds. Leap years are handled automatically.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)]">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-extrabold flex items-center justify-center">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="mt-14">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <details key={i} id={`faq-age-${i}`} className="group border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-xl p-4">
                <summary className="flex items-center justify-between font-bold text-base cursor-pointer list-none select-none text-[var(--text-primary)]">
                  <span>{item.q}</span>
                  <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] transition-transform group-open:rotate-90 flex-shrink-0 ml-3" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] border-t border-[var(--border-color)] pt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
