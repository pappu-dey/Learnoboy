import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import InterestTool from "./InterestTool";

export const metadata: Metadata = {
  title: "Interest Calculator – Simple Interest, Compound Interest & EMI | LearnoBoy",
  description:
    "Free online interest calculator. Calculate Simple Interest (SI), Compound Interest (CI) with annual/monthly compounding, and EMI for loans. Includes year-by-year breakdown and amortization summary.",
  keywords: ["simple interest calculator", "compound interest calculator", "EMI calculator", "loan EMI India", "SI CI formula", "interest calculator online", "compound interest with compounding frequency"],
  openGraph: {
    title: "Interest Calculator – SI, CI & EMI | LearnoBoy",
    description: "Calculate Simple Interest, Compound Interest and Loan EMI instantly. Includes year-by-year compound interest breakdown.",
    type: "website",
  },
};

const FAQ = [
  {
    q: "What is the formula for Simple Interest?",
    a: "Simple Interest (SI) = (Principal × Rate × Time) ÷ 100. For example, if Principal = ₹1,00,000, Rate = 8% per annum, and Time = 3 years, then SI = (1,00,000 × 8 × 3) ÷ 100 = ₹24,000. Total Amount = Principal + SI = ₹1,24,000.",
  },
  {
    q: "What is the formula for Compound Interest?",
    a: "Compound Interest uses: A = P × (1 + R/n)^(n×T), where P = Principal, R = Annual Rate (in decimal), n = Compounding frequency per year, T = Time in years. CI = A − P. For monthly compounding, n = 12. For annual, n = 1.",
  },
  {
    q: "What is the difference between Simple and Compound Interest?",
    a: "In Simple Interest, interest is calculated only on the principal amount each period. In Compound Interest, interest is calculated on the principal plus all previously earned interest (interest on interest), causing it to grow exponentially. Compound Interest always yields a higher return over the same period.",
  },
  {
    q: "How is EMI calculated?",
    a: "EMI = P × r × (1 + r)^N ÷ ((1 + r)^N − 1), where P = Loan Amount, r = Monthly interest rate (Annual Rate ÷ 12 ÷ 100), N = Total number of months. For a ₹5,00,000 loan at 10.5% for 5 years: r = 10.5/(12×100) = 0.00875, N = 60. EMI ≈ ₹10,747.",
  },
  {
    q: "What does compounding frequency mean?",
    a: "Compounding frequency is how often interest is calculated and added to the principal per year. Annual = once a year, Semi-Annual = twice, Quarterly = 4 times, Monthly = 12 times. More frequent compounding results in slightly higher interest earned, especially over long durations.",
  },
  {
    q: "Which is better — monthly or annual compounding for savings?",
    a: "Monthly compounding is better for savings/investments as it results in slightly more interest earned due to more frequent reinvestment. For loans, monthly compounding means you pay slightly more interest. The difference becomes significant over longer durations and higher principal amounts.",
  },
];

export default function InterestPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 55% 35% at 50% -5%, rgba(59,130,246,0.06) 0%, transparent 70%)" }} />

      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] mb-8" aria-label="Breadcrumb">
          <Link href="/tools" className="hover:text-[var(--link-color)] transition-colors flex items-center gap-1"><ArrowLeft className="w-4 h-4" />Tools</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/tools/unitconverters" className="hover:text-[var(--link-color)] transition-colors">Converters</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--text-primary)] font-semibold">Interest Calculator</span>
        </nav>

        {/* Hero */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-blue-600 dark:text-blue-400 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Free Interest Calculator
          </div>
          <h1 id="interest-calc-title" className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Interest Calculator –{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              SI, Compound Interest & EMI
            </span>
          </h1>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed max-w-2xl">
            Calculate Simple Interest, Compound Interest (with annual, semi-annual, quarterly, or monthly
            compounding), and EMI for loans. Includes year-by-year breakdown and full loan summary.
          </p>
        </header>

        {/* ── Interactive Tool ── */}
        <InterestTool />

        {/* ── Formulas ── */}
        <section id="formulas" className="mt-14">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Interest Formulas Explained</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "Simple Interest",
                formula: "SI = P × R × T ÷ 100",
                vars: ["P = Principal Amount", "R = Annual Rate (%)", "T = Time (years)"],
                note: "Interest is always computed on the original principal only.",
              },
              {
                title: "Compound Interest",
                formula: "A = P × (1 + R/n)^(n×T)",
                vars: ["P = Principal", "R = Annual Rate (decimal)", "n = Compounding frequency", "T = Time (years)"],
                note: "CI = A − P. Interest earns interest each period.",
              },
              {
                title: "EMI",
                formula: "EMI = P×r×(1+r)^N ÷ ((1+r)^N−1)",
                vars: ["P = Loan Amount", "r = Monthly rate (R/1200)", "N = Total months (years×12)"],
                note: "Equal monthly payment covering principal + interest.",
              },
            ].map((card) => (
              <div key={card.title} className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                <h3 className="font-bold text-base text-[var(--text-primary)] mb-2">{card.title}</h3>
                <code className="block text-xs font-mono bg-[var(--bg-muted)] text-[var(--link-color)] rounded-lg px-3 py-2 mb-3 break-all">{card.formula}</code>
                <ul className="space-y-1 mb-3">
                  {card.vars.map((v) => (
                    <li key={v} className="text-xs text-[var(--text-secondary)] flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />{v}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-[var(--text-tertiary)] italic">{card.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SI vs CI comparison ── */}
        <section id="si-vs-ci" className="mt-12">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Simple Interest vs Compound Interest</h2>
          <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
            <table className="w-full text-sm">
              <thead className="bg-[var(--bg-muted)]">
                <tr>
                  <th className="px-5 py-3 text-left font-bold text-[var(--text-tertiary)] text-xs uppercase tracking-wider">Feature</th>
                  <th className="px-5 py-3 text-left font-bold text-[var(--text-tertiary)] text-xs uppercase tracking-wider">Simple Interest</th>
                  <th className="px-5 py-3 text-left font-bold text-[var(--text-tertiary)] text-xs uppercase tracking-wider">Compound Interest</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feat: "Based on", si: "Original principal only", ci: "Principal + accumulated interest" },
                  { feat: "Growth type", si: "Linear", ci: "Exponential" },
                  { feat: "Interest amount", si: "Same every period", ci: "Increases each period" },
                  { feat: "Best for", si: "Short-term loans", ci: "Long-term investments" },
                  { feat: "Example (₹1L, 10%, 5yr)", si: "₹50,000 interest", ci: "₹61,051 interest (annual)" },
                ].map((row) => (
                  <tr key={row.feat} className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] transition-colors">
                    <td className="px-5 py-3 font-semibold text-[var(--text-primary)]">{row.feat}</td>
                    <td className="px-5 py-3 text-[var(--text-secondary)]">{row.si}</td>
                    <td className="px-5 py-3 text-[var(--text-secondary)]">{row.ci}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="mt-14">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <details key={i} id={`faq-interest-${i}`} className="group border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-xl p-4">
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
