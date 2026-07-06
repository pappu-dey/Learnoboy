"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  GraduationCap,
  Percent,
  MapPin,
  CalendarDays,
  RotateCcw,
  Copy,
  Check,
  Info,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ConverterKey = "sgpa-cgpa" | "sgpa-percent" | "acre-bigha" | "age";

// ─── Acre ↔ Bigha ratios by Indian state ──────────────────────────────────────
const ACRE_BIGHA: Record<string, { label: string; ratio: number }> = {
  UP:         { label: "Uttar Pradesh",       ratio: 1.6    },
  Bihar:      { label: "Bihar",               ratio: 1.6    },
  MP:         { label: "Madhya Pradesh",      ratio: 1.333  },
  Rajasthan:  { label: "Rajasthan",           ratio: 1.6    },
  Uttarakhand:{ label: "Uttarakhand",         ratio: 1.6    },
  Jharkhand:  { label: "Jharkhand",           ratio: 1.6    },
  WB:         { label: "West Bengal",         ratio: 1.3333 },
  Himachal:   { label: "Himachal Pradesh",    ratio: 5      },
  Assam:      { label: "Assam",               ratio: 3      },
  Gujarat:    { label: "Gujarat",             ratio: 2.5    },
  Haryana:    { label: "Haryana",             ratio: 4      },
  Punjab:     { label: "Punjab",              ratio: 4      },
};

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      title="Copy"
      className="ml-2 p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-muted)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

// ─── Result box ───────────────────────────────────────────────────────────────
function ResultBox({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="mt-6 p-5 rounded-2xl border border-[var(--link-color)]/30 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-muted)] animate-fade-in-up">
      <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-1">
        {label}
      </p>
      <div className="flex items-center gap-1">
        <p className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          {value}
        </p>
        <CopyBtn text={value} />
      </div>
      {note && (
        <p className="mt-2 text-xs text-[var(--text-tertiary)] flex items-center gap-1 leading-relaxed">
          <Info className="w-3.5 h-3.5 flex-shrink-0" />
          {note}
        </p>
      )}
    </div>
  );
}

// ─── Input field ──────────────────────────────────────────────────────────────
function InputField({
  label,
  id,
  type = "number",
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-[var(--text-primary)]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link-color)]/40 focus:border-[var(--link-color)] transition-all"
      />
    </div>
  );
}

// ─── SGPA → CGPA ─────────────────────────────────────────────────────────────
function SgpaToCgpa() {
  const [semesters, setSemesters] = useState<string[]>(["", "", "", "", "", ""]);

  const update = (idx: number, val: string) => {
    const next = [...semesters];
    next[idx] = val;
    setSemesters(next);
  };

  const filled = semesters.filter((s) => s !== "");
  const invalid = filled.some((s) => {
    const n = parseFloat(s);
    return isNaN(n) || n < 0 || n > 10;
  });
  const cgpa =
    filled.length > 0 && !invalid
      ? (filled.reduce((a, s) => a + parseFloat(s), 0) / filled.length).toFixed(2)
      : null;

  return (
    <div>
      <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">
        Enter your SGPA for each semester (0–10 scale). Empty semesters are
        ignored — only filled entries are averaged.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {semesters.map((s, i) => (
          <InputField
            key={i}
            id={`sgpa-sem-${i + 1}`}
            label={`Semester ${i + 1}`}
            value={s}
            onChange={(v) => update(i, v)}
            placeholder="e.g. 8.4"
            min="0"
            max="10"
            step="0.01"
          />
        ))}
      </div>
      {invalid && (
        <p className="mt-3 text-sm text-red-500 font-medium">
          ⚠ All SGPA values must be between 0 and 10.
        </p>
      )}
      <div className="flex gap-3 mt-5">
        <button
          id="btn-add-semester"
          onClick={() => setSemesters([...semesters, ""])}
          disabled={semesters.length >= 12}
          className="flex-1 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors disabled:opacity-40"
        >
          + Add Semester
        </button>
        <button
          id="btn-reset-sgpa-cgpa"
          onClick={() => setSemesters(["", "", "", "", "", ""])}
          className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-tertiary)] hover:bg-[var(--bg-muted)] transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
      {cgpa && !invalid && (
        <ResultBox
          label="Your CGPA"
          value={cgpa}
          note={`Average of ${filled.length} semester${filled.length > 1 ? "s" : ""} on a 10-point scale.`}
        />
      )}
    </div>
  );
}

// ─── SGPA → Percentage ────────────────────────────────────────────────────────
type FormulaKey = "vtu" | "anna" | "ggsipu" | "du" | "custom";

interface FormulaInfo {
  label: string;
  shortName: string;
  fn: (s: number, m: number) => number;
  hint: string;
}

const FORMULAS: Record<FormulaKey, FormulaInfo> = {
  vtu:    { label: "VTU / RGPV / Most Universities",  shortName: "VTU",    fn: (s) => s * 9.5,         hint: "Formula: SGPA × 9.5 — widely used by VTU, RGPV and many central universities." },
  anna:   { label: "Anna University (Tamil Nadu)",     shortName: "Anna",   fn: (s) => s * 10 - 0.75,   hint: "Formula: (SGPA × 10) − 0.75 — standard Anna University conversion." },
  ggsipu: { label: "GGSIPU (Delhi)",                  shortName: "GGSIPU", fn: (s) => s * 9.5,         hint: "Formula: SGPA × 9.5 — Guru Gobind Singh Indraprastha University." },
  du:     { label: "Delhi University",                 shortName: "DU",     fn: (s) => (s - 0.5) * 10, hint: "Formula: (SGPA − 0.5) × 10 — used by University of Delhi." },
  custom: { label: "Custom Formula",                   shortName: "Custom", fn: (s, m) => s * m,        hint: "Multiply your SGPA by your university's specific multiplier." },
};

function SgpaToPercent() {
  const [sgpa, setSgpa] = useState("");
  const [formula, setFormula] = useState<FormulaKey>("vtu");
  const [multiplier, setMultiplier] = useState("9.5");

  const n = parseFloat(sgpa);
  const valid = !isNaN(n) && n >= 0 && n <= 10;
  const percent = valid
    ? FORMULAS[formula].fn(n, parseFloat(multiplier || "9.5")).toFixed(2)
    : null;

  return (
    <div>
      <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">
        Enter your SGPA or CGPA and choose your university formula to get the
        equivalent percentage.
      </p>
      <div className="flex flex-col gap-4">
        <InputField
          id="sgpa-percent-input"
          label="SGPA / CGPA (out of 10)"
          value={sgpa}
          onChange={setSgpa}
          placeholder="e.g. 8.6"
          min="0"
          max="10"
          step="0.01"
        />

        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            University Formula
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(Object.keys(FORMULAS) as FormulaKey[]).map((key) => (
              <label
                key={key}
                id={`formula-${key}`}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formula === key
                    ? "border-[var(--link-color)] bg-[var(--link-color)]/5"
                    : "border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)]"
                }`}
              >
                <input
                  type="radio"
                  name="formula"
                  value={key}
                  checked={formula === key}
                  onChange={() => setFormula(key)}
                  className="mt-0.5 accent-[var(--link-color)]"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-[var(--text-primary)]">
                    {FORMULAS[key].shortName}
                  </p>
                  <p className="text-[10px] text-[var(--text-tertiary)] leading-relaxed">
                    {FORMULAS[key].label}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {formula === "custom" && (
          <InputField
            id="custom-multiplier"
            label="Custom Multiplier"
            value={multiplier}
            onChange={setMultiplier}
            placeholder="e.g. 9.5"
            min="1"
            max="20"
            step="0.01"
          />
        )}
      </div>

      {sgpa && !valid && (
        <p className="mt-3 text-sm text-red-500 font-medium">
          ⚠ Enter a valid SGPA between 0 and 10.
        </p>
      )}
      {percent && valid && (
        <ResultBox
          label="Equivalent Percentage"
          value={`${percent}%`}
          note={FORMULAS[formula].hint}
        />
      )}
    </div>
  );
}

// ─── Acre ↔ Bigha ─────────────────────────────────────────────────────────────
function AcreToBigha() {
  const [value, setValue] = useState("");
  const [state, setState] = useState("UP");
  const [dir, setDir] = useState<"atob" | "btoa">("atob");

  const ratio = ACRE_BIGHA[state].ratio;
  const n = parseFloat(value);
  const valid = !isNaN(n) && n > 0;
  const result = valid ? (dir === "atob" ? n * ratio : n / ratio).toFixed(4) : null;
  const fromUnit = dir === "atob" ? "Acre" : "Bigha";
  const toUnit   = dir === "atob" ? "Bigha" : "Acre";

  return (
    <div>
      <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">
        Convert between Acres and Bigha using the correct ratio for your Indian
        state. Ratios vary significantly across states.
      </p>

      <div className="flex flex-col gap-4">
        {/* Direction toggle */}
        <div className="flex rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-surface)]">
          {([["atob", "Acre → Bigha"], ["btoa", "Bigha → Acre"]] as const).map(([d, label]) => (
            <button
              key={d}
              id={`direction-${d}`}
              onClick={() => { setDir(d); setValue(""); }}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${
                dir === d
                  ? "bg-[var(--link-color)] text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* State selector */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="state-select" className="text-sm font-semibold text-[var(--text-primary)]">
            Select State
          </label>
          <select
            id="state-select"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--link-color)]/40 focus:border-[var(--link-color)] transition-all"
          >
            {Object.entries(ACRE_BIGHA).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            1 Acre = {ratio} Bigha in {ACRE_BIGHA[state].label}
          </p>
        </div>

        <InputField
          id="acre-value-input"
          label={`Value in ${fromUnit}`}
          value={value}
          onChange={setValue}
          placeholder={dir === "atob" ? "e.g. 2.5" : "e.g. 4"}
          min="0"
          step="0.0001"
        />
      </div>

      {result && (
        <ResultBox
          label={`Result in ${toUnit}`}
          value={`${result} ${toUnit}`}
          note={`Conversion ratio: 1 Acre = ${ratio} Bigha in ${ACRE_BIGHA[state].label}`}
        />
      )}

      {/* State ratio table */}
      <div className="mt-6 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
        <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
          State Ratios Reference (1 Acre = X Bigha)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {Object.entries(ACRE_BIGHA).map(([key, { label, ratio: r }]) => (
            <button
              key={key}
              onClick={() => setState(key)}
              className={`text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                state === key
                  ? "bg-[var(--link-color)]/10 text-[var(--link-color)] font-bold border border-[var(--link-color)]/30"
                  : "bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--bg-base)]"
              }`}
            >
              <span className="block font-semibold truncate">{label}</span>
              <span className="text-[10px] text-[var(--text-tertiary)]">{r} Bigha</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Age Calculator ───────────────────────────────────────────────────────────
function AgeCalc() {
  const [dob, setDob] = useState("");
  const [refDate, setRefDate] = useState("");

  const ref = refDate ? new Date(refDate) : new Date();
  ref.setHours(0, 0, 0, 0);
  const birth = dob ? new Date(dob) : null;
  if (birth) birth.setHours(0, 0, 0, 0);

  let age: { years: number; months: number; days: number } | null = null;
  let error = "";
  let totalDays: number | null = null;
  let nextBd: number | null = null;

  if (birth) {
    if (birth > ref) {
      error = "Date of birth cannot be after the reference date.";
    } else {
      let y = ref.getFullYear() - birth.getFullYear();
      let m = ref.getMonth() - birth.getMonth();
      let d = ref.getDate() - birth.getDate();
      if (d < 0) { m--; d += new Date(ref.getFullYear(), ref.getMonth(), 0).getDate(); }
      if (m < 0) { y--; m += 12; }
      age = { years: y, months: m, days: d };
      totalDays = Math.floor((ref.getTime() - birth.getTime()) / 86400000);

      const next = new Date(ref.getFullYear(), birth.getMonth(), birth.getDate());
      if (next <= ref) next.setFullYear(ref.getFullYear() + 1);
      nextBd = Math.ceil((next.getTime() - ref.getTime()) / 86400000);
    }
  }

  return (
    <div>
      <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">
        Find your exact age in years, months, and days. You can also set a
        custom reference date (e.g. exam date, job application cutoff).
      </p>

      <div className="flex flex-col gap-4">
        <InputField
          id="dob-input"
          label="Date of Birth"
          type="date"
          value={dob}
          onChange={setDob}
          max={new Date().toISOString().split("T")[0]}
        />
        <InputField
          id="ref-date-input"
          label="Reference Date (defaults to today)"
          type="date"
          value={refDate}
          onChange={setRefDate}
        />
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium">⚠ {error}</p>
      )}

      {age && !error && (
        <div className="mt-6 animate-fade-in-up space-y-3">
          {/* Main age display */}
          <div className="p-5 rounded-2xl border border-[var(--link-color)]/30 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-muted)]">
            <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-3">
              Your Age
            </p>
            <div className="flex items-end gap-4 flex-wrap">
              {[
                { val: age.years,  unit: "Years"  },
                { val: age.months, unit: "Months" },
                { val: age.days,   unit: "Days"   },
              ].map(({ val, unit }) => (
                <div key={unit} className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[var(--text-primary)] leading-none">
                    {val}
                  </span>
                  <span className="text-sm font-semibold text-[var(--text-secondary)] mb-0.5">
                    {unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-center">
              <p className="text-2xl font-extrabold text-[var(--text-primary)]">
                {totalDays?.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1 font-medium">
                Total Days Lived
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-center">
              <p className="text-2xl font-extrabold text-[var(--text-primary)]">
                {nextBd}
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1 font-medium">
                Days to Next Birthday
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Converter list ───────────────────────────────────────────────────────────
const CONVERTERS: Array<{
  key: ConverterKey;
  label: string;
  short: string;
  icon: React.ReactNode;
  iconBg: string;
  component: React.ReactNode;
}> = [
  {
    key: "sgpa-cgpa",
    label: "SGPA → CGPA",
    short: "Semester average converter",
    icon: <GraduationCap className="w-5 h-5" />,
    iconBg: "bg-violet-100 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400",
    component: <SgpaToCgpa />,
  },
  {
    key: "sgpa-percent",
    label: "SGPA → Percentage",
    short: "VTU, Anna Univ & more",
    icon: <Percent className="w-5 h-5" />,
    iconBg: "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
    component: <SgpaToPercent />,
  },
  {
    key: "acre-bigha",
    label: "Acre ↔ Bigha",
    short: "12 Indian state ratios",
    icon: <MapPin className="w-5 h-5" />,
    iconBg: "bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400",
    component: <AcreToBigha />,
  },
  {
    key: "age",
    label: "Age Calculator",
    short: "Exact years, months & days",
    icon: <CalendarDays className="w-5 h-5" />,
    iconBg: "bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400",
    component: <AgeCalc />,
  },
];

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function UnitConvertersClient() {
  const [active, setActive] = useState<ConverterKey>("sgpa-cgpa");
  const activeTool = CONVERTERS.find((c) => c.key === active)!;
  const select = useCallback((k: ConverterKey) => setActive(k), []);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 35% at 50% -5%, rgba(8,145,178,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] mb-8"
          aria-label="Breadcrumb"
        >
          <Link
            href="/tools"
            className="hover:text-[var(--link-color)] transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--text-primary)] font-semibold">
            Unit Converters
          </span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--link-color)] mb-4 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            4 Free Converters — No Sign-up
          </div>
          <h1
            id="unitconverters-title"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
          >
            Unit{" "}
            <span className="bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Converters
            </span>
          </h1>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed max-w-2xl">
            Academic grades, land area, and age — all the conversions Indian
            students actually need, all in one place.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0" aria-label="Converter list">
            <div className="lg:sticky lg:top-24 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {CONVERTERS.map((conv) => (
                <button
                  key={conv.key}
                  id={`tab-${conv.key}`}
                  onClick={() => select(conv.key)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 flex-shrink-0 lg:flex-shrink lg:w-full ${
                    active === conv.key
                      ? "border-[var(--link-color)] bg-[var(--link-color)]/8 shadow-sm"
                      : "border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)]"
                  }`}
                >
                  <span
                    className={`p-2 rounded-lg flex-shrink-0 transition-colors ${
                      active === conv.key
                        ? conv.iconBg
                        : "bg-[var(--bg-muted)] text-[var(--text-tertiary)]"
                    }`}
                  >
                    {conv.icon}
                  </span>
                  <div className="hidden sm:block min-w-0">
                    <p
                      className={`font-semibold text-sm truncate ${
                        active === conv.key
                          ? "text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {conv.label}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] truncate">
                      {conv.short}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Main panel */}
          <main className="flex-1 min-w-0">
            <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm">
              {/* Tool header */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[var(--border-color)]">
                <div className={`p-3 rounded-xl flex-shrink-0 ${activeTool.iconBg}`}>
                  {activeTool.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    {activeTool.label}
                  </h2>
                  <p className="text-sm text-[var(--text-tertiary)]">
                    {activeTool.short}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div key={active}>{activeTool.component}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
