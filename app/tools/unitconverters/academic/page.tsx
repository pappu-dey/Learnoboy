import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import AcademicTool from "./AcademicTool";

export const metadata: Metadata = {
  title: "SGPA to CGPA & Percentage Calculator | Free Academic Converter | LearnoBoy",
  description:
    "Convert SGPA to CGPA and SGPA to Percentage for free. Supports VTU, Anna University, GGSIPU, Delhi University, MGU and custom university formulas. Instant results.",
  keywords: ["SGPA to CGPA", "SGPA to percentage", "VTU percentage calculator", "Anna University converter", "CGPA calculator online", "academic grade converter India"],
  openGraph: {
    title: "SGPA to CGPA & Percentage Calculator | LearnoBoy",
    description: "Free SGPA to CGPA and SGPA to Percentage converter for Indian university students.",
    type: "website",
  },
};

const FAQ = [
  {
    q: "What is SGPA?",
    a: "SGPA (Semester Grade Point Average) is the weighted average of all grade points earned in a single semester. It is calculated by dividing the sum of (credit × grade point) for each subject by the total credits of that semester.",
  },
  {
    q: "What is CGPA and how is it different from SGPA?",
    a: "CGPA (Cumulative Grade Point Average) is the overall average of all SGPAs across all completed semesters. While SGPA reflects your performance in one semester, CGPA reflects your overall academic performance across the entire programme.",
  },
  {
    q: "How to convert SGPA to CGPA?",
    a: "CGPA = Sum of all SGPAs ÷ Number of Semesters. For example, if you have 4 semesters with SGPAs 8.2, 7.8, 8.5, and 8.0 — your CGPA = (8.2 + 7.8 + 8.5 + 8.0) ÷ 4 = 8.125.",
  },
  {
    q: "How to convert SGPA to Percentage for VTU?",
    a: "VTU (Visvesvaraya Technological University) uses the formula: Percentage = SGPA × 9.5. So if your SGPA is 8.5, your percentage = 8.5 × 9.5 = 80.75%.",
  },
  {
    q: "What formula does Anna University use?",
    a: "Anna University uses: Percentage = (SGPA × 10) − 0.75. So for an SGPA of 9.0, the percentage = (9.0 × 10) − 0.75 = 89.25%.",
  },
  {
    q: "Is this calculator approved by universities?",
    a: "This calculator uses the official conversion formulas published by each university. Always verify with your institution, as universities may update their guidelines.",
  },
];

export default function AcademicPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 55% 35% at 50% -5%, rgba(109,40,217,0.07) 0%, transparent 70%)" }} />

      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] mb-8" aria-label="Breadcrumb">
          <Link href="/tools" className="hover:text-[var(--link-color)] transition-colors flex items-center gap-1"><ArrowLeft className="w-4 h-4" />Tools</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/tools/unitconverters" className="hover:text-[var(--link-color)] transition-colors">Converters</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--text-primary)] font-semibold">Academic</span>
        </nav>

        {/* Hero */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-violet-600 dark:text-violet-400 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Free Academic Calculator
          </div>
          <h1 id="academic-calc-title" className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            SGPA to CGPA &{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
              Percentage Calculator
            </span>
          </h1>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed max-w-2xl">
            Convert your semester grades to CGPA or Percentage instantly. Supports
            VTU, Anna University, GGSIPU, Delhi University, MGU Kerala, and custom formulas.
          </p>
        </header>

        {/* ── Interactive Tool ── */}
        <AcademicTool />

        {/* ── How to Use ── */}
        <section id="how-to-use" className="mt-14">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">How to Use This Calculator</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { step: "1", title: "SGPA → CGPA", desc: "Switch to the SGPA → CGPA tab. Enter your SGPA for each completed semester. Leave empty semesters blank. Your CGPA is calculated as the simple average of all filled values." },
              { step: "2", title: "SGPA → Percentage", desc: "Switch to the SGPA → Percentage tab. Enter your SGPA or CGPA, then select your university formula. The calculator applies the official formula and shows your percentage." },
            ].map((s) => (
              <div key={s.step} className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 font-extrabold text-sm">{s.step}</span>
                  <h3 className="font-bold text-base text-[var(--text-primary)]">{s.title}</h3>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Formulas ── */}
        <section id="formulas" className="mt-12">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">University-wise Conversion Formulas</h2>
          <p className="text-[var(--text-secondary)] text-sm mb-5 leading-relaxed">
            Different Indian universities use different multipliers. Below are the official formulas used by major institutions:
          </p>
          <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
            <table className="w-full text-sm">
              <thead className="bg-[var(--bg-muted)]">
                <tr>
                  <th className="px-5 py-3 text-left font-bold text-[var(--text-tertiary)] text-xs uppercase tracking-wider">University</th>
                  <th className="px-5 py-3 text-left font-bold text-[var(--text-tertiary)] text-xs uppercase tracking-wider">Formula</th>
                  <th className="px-5 py-3 text-left font-bold text-[var(--text-tertiary)] text-xs uppercase tracking-wider">Example (SGPA 8.5)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { uni: "VTU / RGPV / Most Universities", formula: "SGPA × 9.5", example: "80.75%" },
                  { uni: "Anna University (Tamil Nadu)", formula: "(SGPA × 10) − 0.75", example: "84.25%" },
                  { uni: "GGSIPU (Delhi)", formula: "SGPA × 9.5", example: "80.75%" },
                  { uni: "Delhi University", formula: "(SGPA − 0.5) × 10", example: "80.00%" },
                  { uni: "MGU Kerala", formula: "SGPA × 10", example: "85.00%" },
                ].map((row, i) => (
                  <tr key={i} className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] transition-colors">
                    <td className="px-5 py-3 font-medium text-[var(--text-primary)]">{row.uni}</td>
                    <td className="px-5 py-3 font-mono text-xs text-[var(--link-color)]">{row.formula}</td>
                    <td className="px-5 py-3 font-semibold text-emerald-600 dark:text-emerald-400">{row.example}</td>
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
              <details key={i} id={`faq-${i}`} className="group border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-xl p-4">
                <summary className="flex items-center justify-between font-bold text-base cursor-pointer list-none select-none text-[var(--text-primary)]">
                  <span>{item.q}</span>
                  <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] transition-transform group-open:rotate-90 flex-shrink-0 ml-3" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] border-t border-[var(--border-color)] pt-3">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
