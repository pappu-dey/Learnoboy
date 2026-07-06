"use client";

import { useState } from "react";
import { Copy, Check, Info, ArrowLeftRight } from "lucide-react";

// ── Standard area conversions ──────────────────────────────────────────────────
const ACRE_TO_SQFT = 43560;
const ACRE_TO_SQM  = 4046.86;
const ACRE_TO_HA   = 0.404686;
const SQFT_TO_SQM  = 0.092903;
const HA_TO_ACRE   = 2.47105;

// ── State-wise Bigha ratios (bigha per acre) ───────────────────────────────────
const STATES: Record<string, { label: string; bighaPerAcre: number; sqftPerBigha: number }> = {
  UP:          { label: "Uttar Pradesh",     bighaPerAcre: 1.6,    sqftPerBigha: 27000 },
  Bihar:       { label: "Bihar",             bighaPerAcre: 1.6,    sqftPerBigha: 27220 },
  MP:          { label: "Madhya Pradesh",    bighaPerAcre: 1.333,  sqftPerBigha: 32670 },
  Rajasthan:   { label: "Rajasthan",         bighaPerAcre: 1.6,    sqftPerBigha: 27225 },
  Uttarakhand: { label: "Uttarakhand",       bighaPerAcre: 1.6,    sqftPerBigha: 27000 },
  Jharkhand:   { label: "Jharkhand",         bighaPerAcre: 1.6,    sqftPerBigha: 27220 },
  WB:          { label: "West Bengal",       bighaPerAcre: 1.3333, sqftPerBigha: 32670 },
  Himachal:    { label: "Himachal Pradesh",  bighaPerAcre: 5,      sqftPerBigha: 8712  },
  Assam:       { label: "Assam",             bighaPerAcre: 3,      sqftPerBigha: 14520 },
  Gujarat:     { label: "Gujarat",           bighaPerAcre: 2.5,    sqftPerBigha: 17424 },
  Haryana:     { label: "Haryana",           bighaPerAcre: 4,      sqftPerBigha: 10890 },
  Punjab:      { label: "Punjab",            bighaPerAcre: 4,      sqftPerBigha: 10890 },
};

function CopyBtn({ text }: { text: string }) {
  const [c, setC] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }}
      className="ml-2 p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-muted)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
      {c ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border-color)] last:border-0">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <div className="flex items-center gap-0.5">
        <span className="text-sm font-bold text-[var(--text-primary)]">{value}</span>
        <CopyBtn text={value} />
      </div>
    </div>
  );
}

// ── Standard conversions tab ───────────────────────────────────────────────────
const STD_CONVERSIONS = [
  { id: "sqft-sqm",  from: "Square Feet",   to: "Square Meters", rate: SQFT_TO_SQM,  rateRev: 1 / SQFT_TO_SQM },
  { id: "acre-sqft", from: "Acre",          to: "Square Feet",   rate: ACRE_TO_SQFT, rateRev: 1 / ACRE_TO_SQFT },
  { id: "acre-sqm",  from: "Acre",          to: "Square Meters", rate: ACRE_TO_SQM,  rateRev: 1 / ACRE_TO_SQM },
  { id: "acre-ha",   from: "Acre",          to: "Hectare",       rate: ACRE_TO_HA,   rateRev: HA_TO_ACRE },
  { id: "ha-acre",   from: "Hectare",       to: "Acre",          rate: HA_TO_ACRE,   rateRev: ACRE_TO_HA },
];

function StandardConverter() {
  const [sel, setSel] = useState("sqft-sqm");
  const [val, setVal] = useState("");
  const [rev, setRev] = useState(false);

  const conv = STD_CONVERSIONS.find((c) => c.id === sel)!;
  const rate = rev ? conv.rateRev : conv.rate;
  const from = rev ? conv.to : conv.from;
  const to   = rev ? conv.from : conv.to;
  const n = parseFloat(val);
  const result = !isNaN(n) && n >= 0 ? (n * rate).toLocaleString("en-IN", { maximumFractionDigits: 6 }) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="conv-select" className="text-sm font-semibold text-[var(--text-primary)]">Conversion Type</label>
        <select id="conv-select" value={sel} onChange={(e) => { setSel(e.target.value); setVal(""); }}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--link-color)]/40 transition-all">
          {STD_CONVERSIONS.map((c) => (
            <option key={c.id} value={c.id}>{c.from} → {c.to}</option>
          ))}
        </select>
      </div>

      <div className="flex items-end gap-3">
        <div className="flex-1 flex flex-col gap-1.5">
          <label htmlFor="std-val" className="text-sm font-semibold text-[var(--text-primary)]">Value in {from}</label>
          <input id="std-val" type="number" value={val} onChange={(e) => setVal(e.target.value)} placeholder="Enter value"
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--link-color)]/40 transition-all" />
        </div>
        <button id="swap-btn" onClick={() => setRev((r) => !r)}
          className="p-3 mb-0.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors">
          <ArrowLeftRight className="w-4 h-4" />
        </button>
      </div>

      {result && (
        <div className="mt-2 p-5 rounded-2xl border border-[var(--link-color)]/30 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-muted)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">{to}</p>
          <div className="flex items-center gap-1">
            <span className="text-3xl font-extrabold text-[var(--text-primary)]">{result}</span>
            <CopyBtn text={result} />
          </div>
          <p className="text-xs text-[var(--text-tertiary)] mt-2 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            Rate: 1 {from} = {rate.toFixed(6)} {to}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Bigha converter ─────────────────────────────────────────────────────────────
function BighaConverter() {
  const [val, setVal] = useState("");
  const [state, setState] = useState("UP");
  const [dir, setDir] = useState<"atob" | "btoa">("atob");

  const { bighaPerAcre, sqftPerBigha, label } = STATES[state];
  const n = parseFloat(val);
  const valid = !isNaN(n) && n > 0;

  const bigha = valid ? (dir === "atob" ? n * bighaPerAcre : n / bighaPerAcre).toFixed(4) : null;
  const sqft  = valid ? (dir === "atob" ? n * ACRE_TO_SQFT : n * sqftPerBigha).toFixed(2) : null;
  const sqm   = valid ? (dir === "atob" ? n * ACRE_TO_SQM  : n * sqftPerBigha * SQFT_TO_SQM).toFixed(2) : null;

  const fromUnit = dir === "atob" ? "Acre" : "Bigha";
  const toUnit   = dir === "atob" ? "Bigha" : "Acre";

  return (
    <div className="flex flex-col gap-4">
      {/* Direction */}
      <div className="flex rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-surface)]">
        {([["atob", "Acre → Bigha"], ["btoa", "Bigha → Acre"]] as const).map(([d, l]) => (
          <button key={d} id={`bigha-dir-${d}`} onClick={() => { setDir(d); setVal(""); }}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${dir === d ? "bg-[var(--link-color)] text-white" : "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="bigha-state" className="text-sm font-semibold text-[var(--text-primary)]">State</label>
        <select id="bigha-state" value={state} onChange={(e) => setState(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--link-color)]/40 transition-all">
          {Object.entries(STATES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1 mt-0.5">
          <Info className="w-3.5 h-3.5 flex-shrink-0" />
          1 Acre = {bighaPerAcre} Bigha in {label}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="bigha-val" className="text-sm font-semibold text-[var(--text-primary)]">Value in {fromUnit}</label>
        <input id="bigha-val" type="number" value={val} onChange={(e) => setVal(e.target.value)} placeholder={`e.g. ${dir === "atob" ? "2.5" : "4"}`}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--link-color)]/40 transition-all" />
      </div>

      {bigha && valid && (
        <div className="p-5 rounded-2xl border border-[var(--link-color)]/30 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-muted)] animate-fade-in-up">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-3">Conversion Results</p>
          <ResultRow label={toUnit} value={`${bigha} ${toUnit}`} />
          <ResultRow label="Square Feet" value={`${parseFloat(sqft!).toLocaleString("en-IN")} sqft`} />
          <ResultRow label="Square Meters" value={`${parseFloat(sqm!).toLocaleString("en-IN")} sqm`} />
        </div>
      )}
    </div>
  );
}

export default function AreaTool() {
  const [tab, setTab] = useState<"bigha" | "standard">("bigha");
  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm">
      <div className="flex bg-[var(--bg-muted)] rounded-xl p-1 gap-1 mb-6">
        {([["bigha", "Acre ↔ Bigha"], ["standard", "Standard Units"]] as const).map(([k, l]) => (
          <button key={k} id={`area-tab-${k}`} onClick={() => setTab(k)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === k ? "bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
            {l}
          </button>
        ))}
      </div>
      {tab === "bigha" ? <BighaConverter /> : <StandardConverter />}
    </div>
  );
}
