import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import AreaTool from "./AreaTool";

export const metadata: Metadata = {
  title: "Area Converter – Acre to Bigha, Sqft to Sqm, Hectare | LearnoBoy",
  description:
    "Free online land area converter. Convert Acre to Bigha (12 Indian states), Square Feet to Square Meters, Acre to Hectare. State-specific Bigha ratios included.",
  keywords: ["acre to bigha", "bigha to acre", "sqft to sqm", "land area converter India", "hectare to acre", "acre calculator", "UP bigha", "MP bigha converter"],
  openGraph: {
    title: "Area Converter – Acre to Bigha by State | LearnoBoy",
    description: "Convert land area units in India. Accurate state-specific Acre to Bigha ratios for UP, Bihar, Rajasthan, MP, Assam and more.",
    type: "website",
  },
};

const FAQ = [
  {
    q: "How many Bigha is 1 Acre in Uttar Pradesh?",
    a: "In Uttar Pradesh (UP), 1 Acre equals 1.6 Bigha. So 5 acres = 8 Bigha in UP. Note that the Bigha size varies significantly across Indian states.",
  },
  {
    q: "How many Bigha is 1 Acre in Rajasthan?",
    a: "In Rajasthan, 1 Acre = 1.6 Bigha (same as UP). However, the size of 1 Bigha in Rajasthan is approximately 27,225 square feet or 2529.28 square meters.",
  },
  {
    q: "How many square feet is 1 Bigha in Himachal Pradesh?",
    a: "In Himachal Pradesh, 1 Bigha = 8,712 square feet (which is much smaller than in other states). This is why 1 Acre = 5 Bigha in Himachal Pradesh.",
  },
  {
    q: "How to convert Square Feet to Square Meters?",
    a: "1 Square Foot = 0.092903 Square Meters. So to convert, multiply the square feet value by 0.092903. For example, 1,000 sqft = 1,000 × 0.092903 = 92.90 sqm.",
  },
  {
    q: "How many Acres is 1 Hectare?",
    a: "1 Hectare = 2.47105 Acres. Conversely, 1 Acre = 0.404686 Hectares. The hectare is the standard international unit for land area measurement.",
  },
  {
    q: "Why does Bigha size differ by state?",
    a: "Bigha is a traditional land measurement unit in South Asia that was never standardised across regions. Each state developed its own definition based on historical land survey practices, leading to different values across UP, Bihar, Rajasthan, Himachal Pradesh, Assam and other states.",
  },
];

const STATE_TABLE = [
  { state: "Uttar Pradesh",    bighaPerAcre: 1.6,    sqftPerBigha: 27000 },
  { state: "Bihar",            bighaPerAcre: 1.6,    sqftPerBigha: 27220 },
  { state: "Madhya Pradesh",   bighaPerAcre: 1.333,  sqftPerBigha: 32670 },
  { state: "Rajasthan",        bighaPerAcre: 1.6,    sqftPerBigha: 27225 },
  { state: "Uttarakhand",      bighaPerAcre: 1.6,    sqftPerBigha: 27000 },
  { state: "West Bengal",      bighaPerAcre: 1.333,  sqftPerBigha: 32670 },
  { state: "Himachal Pradesh", bighaPerAcre: 5,      sqftPerBigha: 8712  },
  { state: "Assam",            bighaPerAcre: 3,      sqftPerBigha: 14520 },
  { state: "Gujarat",          bighaPerAcre: 2.5,    sqftPerBigha: 17424 },
  { state: "Haryana",          bighaPerAcre: 4,      sqftPerBigha: 10890 },
  { state: "Punjab",           bighaPerAcre: 4,      sqftPerBigha: 10890 },
];

export default function AreaPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 55% 35% at 50% -5%, rgba(34,197,94,0.06) 0%, transparent 70%)" }} />

      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] mb-8" aria-label="Breadcrumb">
          <Link href="/tools" className="hover:text-[var(--link-color)] transition-colors flex items-center gap-1"><ArrowLeft className="w-4 h-4" />Tools</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/tools/unitconverters" className="hover:text-[var(--link-color)] transition-colors">Converters</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--text-primary)] font-semibold">Area</span>
        </nav>

        {/* Hero */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-green-600 dark:text-green-400 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Free Land Area Converter
          </div>
          <h1 id="area-converter-title" className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Area Converter –{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Acre, Bigha, Sqft & More
            </span>
          </h1>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed max-w-2xl">
            Convert land area units used across India. State-specific Acre to Bigha
            conversion for 12 states, plus Square Feet to Square Meters, Hectare to Acre, and more.
          </p>
        </header>

        {/* ── Interactive Tool ── */}
        <AreaTool />

        {/* ── State Reference Table ── */}
        <section id="state-table" className="mt-14">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Acre to Bigha Conversion by State</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">
            The Bigha is a traditional land unit with no standardised national value. Each state has its own Bigha size, making state-specific ratios essential for accurate conversion.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
            <table className="w-full text-sm">
              <thead className="bg-[var(--bg-muted)]">
                <tr>
                  <th className="px-5 py-3 text-left font-bold text-[var(--text-tertiary)] text-xs uppercase tracking-wider">State</th>
                  <th className="px-5 py-3 text-right font-bold text-[var(--text-tertiary)] text-xs uppercase tracking-wider">1 Acre = X Bigha</th>
                  <th className="px-5 py-3 text-right font-bold text-[var(--text-tertiary)] text-xs uppercase tracking-wider">1 Bigha (sqft)</th>
                </tr>
              </thead>
              <tbody>
                {STATE_TABLE.map((row) => (
                  <tr key={row.state} className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] transition-colors">
                    <td className="px-5 py-3 font-medium text-[var(--text-primary)]">{row.state}</td>
                    <td className="px-5 py-3 text-right font-bold text-green-600 dark:text-green-400">{row.bighaPerAcre} Bigha</td>
                    <td className="px-5 py-3 text-right text-[var(--text-secondary)]">{row.sqftPerBigha.toLocaleString("en-IN")} sqft</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Standard units ── */}
        <section id="standard-units" className="mt-12">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Standard Area Units Reference</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "1 Acre", values: ["43,560 Square Feet", "4,046.86 Square Meters", "0.4047 Hectares", "4,840 Square Yards"] },
              { title: "1 Hectare", values: ["2.471 Acres", "10,000 Square Meters", "107,639 Square Feet", "11,960 Square Yards"] },
            ].map((card) => (
              <div key={card.title} className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                <h3 className="font-bold text-base text-[var(--text-primary)] mb-3">{card.title} equals:</h3>
                <ul className="space-y-1.5">
                  {card.values.map((v) => (
                    <li key={v} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="mt-14">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <details key={i} id={`faq-area-${i}`} className="group border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-xl p-4">
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
