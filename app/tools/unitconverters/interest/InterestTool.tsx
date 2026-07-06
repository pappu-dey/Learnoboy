"use client";

import { useState, useMemo } from "react";
import { Copy, Check, Info } from "lucide-react";

function CopyBtn({ text }: { text: string }) {
  const [c, setC] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }}
      className="ml-2 p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-muted)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
      {c ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-center">
      <div className="flex items-center justify-center gap-0.5">
        <p className="text-xl font-extrabold text-[var(--text-primary)]">{value}</p>
        <CopyBtn text={value} />
      </div>
      <p className="text-xs font-semibold text-[var(--text-tertiary)] mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{sub}</p>}
    </div>
  );
}

function Field({ label, id, value, onChange, type = "number", min, max, placeholder, suffix }: {
  label: string; id: string; value: string; onChange: (v: string) => void; type?: string;
  min?: string; max?: string; placeholder?: string; suffix?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-[var(--text-primary)]">{label}</label>
      <div className="relative">
        <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)}
          min={min} max={max} placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link-color)]/40 focus:border-[var(--link-color)] transition-all ${suffix ? "pr-14" : ""}`} />
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-tertiary)] font-medium pointer-events-none">{suffix}</span>}
      </div>
    </div>
  );
}

const FREQ_OPTIONS = [
  { id: "annually",    label: "Annually",    n: 1  },
  { id: "semiannual",  label: "Semi-Annual", n: 2  },
  { id: "quarterly",   label: "Quarterly",   n: 4  },
  { id: "monthly",     label: "Monthly",     n: 12 },
];

// ── Simple Interest ────────────────────────────────────────────────────────────
function SimpleInterest() {
  const [P, setP] = useState("");
  const [R, setR] = useState("");
  const [T, setT] = useState("");

  const p = parseFloat(P), r = parseFloat(R), t = parseFloat(T);
  const valid = !isNaN(p) && !isNaN(r) && !isNaN(t) && p > 0 && r > 0 && t > 0;
  const SI = valid ? (p * r * t) / 100 : null;
  const total = SI !== null ? p + SI : null;

  const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

  return (
    <div className="flex flex-col gap-4">
      <Field id="si-principal" label="Principal (₹)" value={P} onChange={setP} placeholder="e.g. 100000" suffix="₹" />
      <Field id="si-rate"      label="Annual Interest Rate" value={R} onChange={setR} placeholder="e.g. 8.5" suffix="%" min="0" max="100" />
      <Field id="si-time"      label="Time Period (years)" value={T} onChange={setT} placeholder="e.g. 3" min="0" />

      {valid && SI !== null && total !== null && (
        <div className="mt-2 p-5 rounded-2xl border border-[var(--link-color)]/30 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-muted)] animate-fade-in-up">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-4">Simple Interest Summary</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xs text-[var(--text-tertiary)] mb-1">Principal</p>
              <p className="text-base font-bold text-[var(--text-primary)]">₹{fmt(p)}</p>
            </div>
            <div className="text-center border-x border-[var(--border-color)]">
              <p className="text-xs text-[var(--text-tertiary)] mb-1">Interest Earned</p>
              <p className="text-base font-bold text-blue-600 dark:text-blue-400">₹{fmt(SI)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[var(--text-tertiary)] mb-1">Total Amount</p>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">₹{fmt(total)}</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-[var(--text-tertiary)] flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Formula: SI = P × R × T ÷ 100
          </p>
        </div>
      )}
    </div>
  );
}

// ── Compound Interest ──────────────────────────────────────────────────────────
function CompoundInterest() {
  const [P, setP] = useState("");
  const [R, setR] = useState("");
  const [T, setT] = useState("");
  const [freq, setFreq] = useState("annually");

  const p = parseFloat(P), r = parseFloat(R), t = parseFloat(T);
  const n = FREQ_OPTIONS.find((f) => f.id === freq)!.n;
  const valid = !isNaN(p) && !isNaN(r) && !isNaN(t) && p > 0 && r > 0 && t > 0;

  const A  = valid ? p * Math.pow(1 + r / (n * 100), n * t) : null;
  const CI = A !== null ? A - p : null;

  const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

  // Year-by-year breakdown
  const breakdown = useMemo(() => {
    if (!valid || !A) return [];
    return Array.from({ length: Math.min(Math.ceil(t), 10) }, (_, i) => {
      const yr = i + 1;
      const amount = p * Math.pow(1 + r / (n * 100), n * yr);
      return { yr, amount, ci: amount - p };
    });
  }, [valid, p, r, t, n, A]);

  return (
    <div className="flex flex-col gap-4">
      <Field id="ci-principal" label="Principal (₹)" value={P} onChange={setP} placeholder="e.g. 100000" suffix="₹" />
      <Field id="ci-rate"      label="Annual Interest Rate" value={R} onChange={setR} placeholder="e.g. 12" suffix="%" min="0" max="100" />
      <Field id="ci-time"      label="Time Period (years)" value={T} onChange={setT} placeholder="e.g. 5" min="0" />

      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Compounding Frequency</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FREQ_OPTIONS.map((f) => (
            <label key={f.id} id={`freq-${f.id}`} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all text-sm ${freq === f.id ? "border-[var(--link-color)] bg-[var(--link-color)]/5 font-semibold text-[var(--link-color)]" : "border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"}`}>
              <input type="radio" name="ci-freq" value={f.id} checked={freq === f.id} onChange={() => setFreq(f.id)} className="accent-[var(--link-color)]" />
              {f.label}
            </label>
          ))}
        </div>
      </div>

      {valid && A !== null && CI !== null && (
        <div className="mt-2 animate-fade-in-up space-y-3">
          <div className="p-5 rounded-2xl border border-[var(--link-color)]/30 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-muted)]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-4">Compound Interest Summary</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-xs text-[var(--text-tertiary)] mb-1">Principal</p>
                <p className="text-base font-bold text-[var(--text-primary)]">₹{fmt(p)}</p>
              </div>
              <div className="text-center border-x border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-tertiary)] mb-1">Interest Earned</p>
                <p className="text-base font-bold text-blue-600 dark:text-blue-400">₹{fmt(CI)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[var(--text-tertiary)] mb-1">Total Amount</p>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">₹{fmt(A)}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-[var(--text-tertiary)] flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> A = P × (1 + R/n)^(n×T)
            </p>
          </div>

          {breakdown.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
              <table className="w-full text-sm">
                <thead className="bg-[var(--bg-muted)]">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Year</th>
                    <th className="px-4 py-2.5 text-right text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Total Amount</th>
                    <th className="px-4 py-2.5 text-right text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Interest Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdown.map((row) => (
                    <tr key={row.yr} className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] transition-colors">
                      <td className="px-4 py-2.5 text-[var(--text-secondary)] font-medium">Year {row.yr}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">₹{fmt(row.amount)}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-blue-600 dark:text-blue-400">₹{fmt(row.ci)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── EMI Calculator ─────────────────────────────────────────────────────────────
function EmiCalculator() {
  const [P, setP] = useState("");
  const [R, setR] = useState("");
  const [T, setT] = useState("");

  const p = parseFloat(P), r = parseFloat(R), t = parseFloat(T);
  const valid = !isNaN(p) && !isNaN(r) && !isNaN(t) && p > 0 && r > 0 && t > 0;

  const monthlyRate = r / (12 * 100);
  const months = t * 12;
  const emi = valid
    ? (p * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    : null;
  const totalPayable = emi ? emi * months : null;
  const totalInterest = totalPayable ? totalPayable - p : null;

  const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

  return (
    <div className="flex flex-col gap-4">
      <Field id="emi-loan"   label="Loan Amount (₹)" value={P} onChange={setP} placeholder="e.g. 500000" suffix="₹" />
      <Field id="emi-rate"   label="Annual Interest Rate" value={R} onChange={setR} placeholder="e.g. 10.5" suffix="%" min="0" max="50" />
      <Field id="emi-tenure" label="Loan Tenure (years)" value={T} onChange={setT} placeholder="e.g. 5" min="0" max="30" />

      {valid && emi !== null && totalPayable !== null && totalInterest !== null && (
        <div className="mt-2 animate-fade-in-up space-y-3">
          <div className="p-5 rounded-2xl border border-[var(--link-color)]/30 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-muted)]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-2">Monthly EMI</p>
            <div className="flex items-center gap-1 mb-4">
              <span className="text-4xl font-extrabold text-[var(--text-primary)]">₹{fmt(emi)}</span>
              <CopyBtn text={fmt(emi)} />
            </div>
            <div className="grid grid-cols-3 gap-3 border-t border-[var(--border-color)] pt-4">
              <div className="text-center">
                <p className="text-xs text-[var(--text-tertiary)] mb-1">Principal</p>
                <p className="text-sm font-bold text-[var(--text-primary)]">₹{fmt(p)}</p>
              </div>
              <div className="text-center border-x border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-tertiary)] mb-1">Total Interest</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">₹{fmt(totalInterest)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[var(--text-tertiary)] mb-1">Total Payable</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₹{fmt(totalPayable)}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total Months" value={`${months}`} />
            <StatCard label="Interest % of Principal" value={`${((totalInterest / p) * 100).toFixed(1)}%`} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function InterestTool() {
  const [tab, setTab] = useState<"si" | "ci" | "emi">("si");
  const TABS = [["si", "Simple Interest"], ["ci", "Compound Interest"], ["emi", "EMI"]] as const;

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm">
      <div className="flex bg-[var(--bg-muted)] rounded-xl p-1 gap-1 mb-6 overflow-x-auto">
        {TABS.map(([k, l]) => (
          <button key={k} id={`interest-tab-${k}`} onClick={() => setTab(k)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all px-2 ${tab === k ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
            {l}
          </button>
        ))}
      </div>
      {tab === "si"  && <SimpleInterest />}
      {tab === "ci"  && <CompoundInterest />}
      {tab === "emi" && <EmiCalculator />}
    </div>
  );
}

