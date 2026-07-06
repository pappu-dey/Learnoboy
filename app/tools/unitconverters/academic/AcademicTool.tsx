"use client";

import { useState } from "react";
import { RotateCcw, Copy, Check, Info } from "lucide-react";

type FormulaKey = "vtu" | "anna" | "ggsipu" | "du" | "mgu" | "custom";

const FORMULAS: Record<FormulaKey, { name: string; full: string; fn: (s: number, m: number) => number; formula: string }> = {
  vtu:    { name: "VTU / RGPV",         full: "Visvesvaraya Technological University",     fn: (s) => s * 9.5,          formula: "% = SGPA × 9.5" },
  anna:   { name: "Anna University",    full: "Anna University, Tamil Nadu",               fn: (s) => s * 10 - 0.75,    formula: "% = (SGPA × 10) − 0.75" },
  ggsipu: { name: "GGSIPU",             full: "Guru Gobind Singh Indraprastha University",  fn: (s) => s * 9.5,          formula: "% = SGPA × 9.5" },
  du:     { name: "Delhi University",   full: "University of Delhi",                        fn: (s) => (s - 0.5) * 10,   formula: "% = (SGPA − 0.5) × 10" },
  mgu:    { name: "MGU / Kerala",       full: "Mahatma Gandhi University, Kerala",          fn: (s) => s * 10,           formula: "% = SGPA × 10" },
  custom: { name: "Custom",             full: "Enter your own multiplier",                  fn: (s, m) => s * m,         formula: "% = SGPA × Multiplier" },
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="ml-2 p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-muted)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function Result({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="mt-5 p-5 rounded-2xl border border-[var(--link-color)]/30 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-muted)] animate-fade-in-up">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">{label}</p>
      <div className="flex items-center gap-1">
        <span className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">{value}</span>
        <CopyBtn text={value} />
      </div>
      {note && <p className="mt-2 text-xs text-[var(--text-tertiary)] flex items-center gap-1"><Info className="w-3.5 h-3.5 flex-shrink-0" />{note}</p>}
    </div>
  );
}

function Field({ label, id, value, onChange, placeholder, min = "0", max = "10" }: {
  label: string; id: string; value: string; onChange: (v: string) => void; placeholder?: string; min?: string; max?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-[var(--text-primary)]">{label}</label>
      <input id={id} type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        min={min} max={max} step="0.01"
        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link-color)]/40 focus:border-[var(--link-color)] transition-all" />
    </div>
  );
}

// ── SGPA → CGPA ──────────────────────────────────────────────────────────────
function SgpaToCgpa() {
  const [sems, setSems] = useState(["", "", "", "", "", ""]);

  const filled = sems.filter((s) => s !== "");
  const bad = filled.some((s) => { const n = parseFloat(s); return isNaN(n) || n < 0 || n > 10; });
  const cgpa = filled.length > 0 && !bad
    ? (filled.reduce((a, s) => a + parseFloat(s), 0) / filled.length).toFixed(2) : null;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {sems.map((s, i) => (
          <Field key={i} id={`sem-${i + 1}`} label={`Semester ${i + 1}`} value={s}
            onChange={(v) => { const n = [...sems]; n[i] = v; setSems(n); }} placeholder="e.g. 8.4" />
        ))}
      </div>
      {bad && <p className="text-sm text-red-500 font-medium mb-3">⚠ Values must be between 0 and 10.</p>}
      <div className="flex gap-3">
        <button id="add-sem-btn" onClick={() => setSems([...sems, ""])} disabled={sems.length >= 12}
          className="flex-1 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] disabled:opacity-40 transition-colors">
          + Add Semester
        </button>
        <button id="reset-cgpa-btn" onClick={() => setSems(["", "", "", "", "", ""])}
          className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-tertiary)] hover:bg-[var(--bg-muted)] transition-colors">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
      {cgpa && !bad && (
        <Result label="Your CGPA" value={cgpa}
          note={`Average of ${filled.length} semester${filled.length > 1 ? "s" : ""}. Scale: 0 – 10.`} />
      )}
    </div>
  );
}

// ── SGPA → Percentage ─────────────────────────────────────────────────────────
function SgpaToPercent() {
  const [sgpa, setSgpa] = useState("");
  const [formula, setFormula] = useState<FormulaKey>("vtu");
  const [mult, setMult] = useState("9.5");

  const n = parseFloat(sgpa);
  const valid = !isNaN(n) && n >= 0 && n <= 10;
  const pct = valid ? FORMULAS[formula].fn(n, parseFloat(mult || "9.5")).toFixed(2) : null;

  return (
    <div>
      <Field id="sgpa-pct-input" label="Your SGPA / CGPA (0 – 10)" value={sgpa} onChange={setSgpa} placeholder="e.g. 8.6" />

      <p className="text-sm font-semibold text-[var(--text-primary)] mt-4 mb-2">Select University Formula</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        {(Object.keys(FORMULAS) as FormulaKey[]).map((key) => (
          <label key={key} id={`formula-${key}`} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formula === key ? "border-[var(--link-color)] bg-[var(--link-color)]/5" : "border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)]"}`}>
            <input type="radio" name="formula" value={key} checked={formula === key} onChange={() => setFormula(key)} className="mt-0.5 accent-[var(--link-color)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{FORMULAS[key].name}</p>
              <p className="text-[10px] text-[var(--text-tertiary)]">{FORMULAS[key].formula}</p>
            </div>
          </label>
        ))}
      </div>

      {formula === "custom" && (
        <Field id="custom-mult" label="Custom Multiplier" value={mult} onChange={setMult} placeholder="e.g. 9.5" min="0.1" max="20" />
      )}

      {sgpa && !valid && <p className="mt-3 text-sm text-red-500 font-medium">⚠ Enter a value between 0 and 10.</p>}
      {pct && valid && (
        <Result label="Equivalent Percentage" value={`${pct}%`} note={`${FORMULAS[formula].full} — ${FORMULAS[formula].formula}`} />
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function AcademicTool() {
  const [tab, setTab] = useState<"cgpa" | "percent">("cgpa");

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm">
      {/* Tab bar */}
      <div className="flex bg-[var(--bg-muted)] rounded-xl p-1 gap-1 mb-6">
        {([["cgpa", "SGPA → CGPA"], ["percent", "SGPA → Percentage"]] as const).map(([k, label]) => (
          <button key={k} id={`academic-tab-${k}`} onClick={() => setTab(k)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === k ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "cgpa" ? (
        <div>
          <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
            Enter your SGPA for each completed semester. Leave empty semesters blank — only filled values are averaged.
          </p>
          <SgpaToCgpa />
        </div>
      ) : (
        <div>
          <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
            Select your university's conversion formula and enter your SGPA or CGPA to get the equivalent percentage.
          </p>
          <SgpaToPercent />
        </div>
      )}
    </div>
  );
}
