"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, RotateCcw, Clock } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Mode = "basic" | "scientific";

interface CalcState {
  display: string;   // current number on display
  expr: string;      // expression row above display
  prev: number | null;
  op: string | null;
  fresh: boolean;    // next digit press clears display
  justEval: boolean; // just pressed =
  memory: number;
}

const INIT: CalcState = {
  display: "0",
  expr: "",
  prev: null,
  op: null,
  fresh: false,
  justEval: false,
  memory: 0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number): string {
  if (isNaN(n)) return "Error";
  if (!isFinite(n)) return n > 0 ? "∞" : "-∞";
  if (Math.abs(n) >= 1e15 || (Math.abs(n) < 1e-9 && n !== 0)) {
    return n.toExponential(6);
  }
  const s = parseFloat(n.toPrecision(12)).toString();
  return s;
}

function applyOp(a: number, op: string, b: number): number {
  switch (op) {
    case "+":  return a + b;
    case "−":  return a - b;
    case "×":  return a * b;
    case "÷":  return b === 0 ? NaN : a / b;
    case "^":  return Math.pow(a, b);
    default:   return b;
  }
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

// ─── Button config ─────────────────────────────────────────────────────────────
type BtnVariant = "digit" | "op" | "action" | "eq" | "fn" | "mem";

interface Btn {
  label: string;
  id: string;
  key?: string;
  variant: BtnVariant;
  wide?: boolean;
}

const BASIC_GRID: Btn[][] = [
  [
    { label: "AC",  id: "btn-ac",    key: "Escape", variant: "action" },
    { label: "±",   id: "btn-sign",  key: "F9",     variant: "action" },
    { label: "%",   id: "btn-pct",   key: "%",      variant: "action" },
    { label: "÷",   id: "btn-div",   key: "/",      variant: "op" },
  ],
  [
    { label: "7", id: "btn-7", key: "7", variant: "digit" },
    { label: "8", id: "btn-8", key: "8", variant: "digit" },
    { label: "9", id: "btn-9", key: "9", variant: "digit" },
    { label: "×", id: "btn-mul", key: "*", variant: "op" },
  ],
  [
    { label: "4", id: "btn-4", key: "4", variant: "digit" },
    { label: "5", id: "btn-5", key: "5", variant: "digit" },
    { label: "6", id: "btn-6", key: "6", variant: "digit" },
    { label: "−", id: "btn-sub", key: "-", variant: "op" },
  ],
  [
    { label: "1", id: "btn-1", key: "1", variant: "digit" },
    { label: "2", id: "btn-2", key: "2", variant: "digit" },
    { label: "3", id: "btn-3", key: "3", variant: "digit" },
    { label: "+", id: "btn-add", key: "+", variant: "op" },
  ],
  [
    { label: "0",  id: "btn-0",  key: "0",     variant: "digit", wide: true },
    { label: ".",  id: "btn-dot", key: ".",    variant: "digit" },
    { label: "=",  id: "btn-eq", key: "Enter", variant: "eq" },
  ],
];

const SCI_TOP: Btn[][] = [
  [
    { label: "sin",  id: "btn-sin",  variant: "fn" },
    { label: "cos",  id: "btn-cos",  variant: "fn" },
    { label: "tan",  id: "btn-tan",  variant: "fn" },
    { label: "π",    id: "btn-pi",   variant: "fn" },
  ],
  [
    { label: "sin⁻¹", id: "btn-asin", variant: "fn" },
    { label: "cos⁻¹", id: "btn-acos", variant: "fn" },
    { label: "tan⁻¹", id: "btn-atan", variant: "fn" },
    { label: "e",     id: "btn-e",    variant: "fn" },
  ],
  [
    { label: "log",  id: "btn-log",  variant: "fn" },
    { label: "ln",   id: "btn-ln",   variant: "fn" },
    { label: "√",    id: "btn-sqrt", variant: "fn" },
    { label: "xʸ",   id: "btn-pow",  variant: "op" },
  ],
  [
    { label: "x²",   id: "btn-sq",   variant: "fn" },
    { label: "x³",   id: "btn-cube", variant: "fn" },
    { label: "n!",   id: "btn-fact", variant: "fn" },
    { label: "1/x",  id: "btn-inv",  variant: "fn" },
  ],
  [
    { label: "MC",   id: "btn-mc",   variant: "mem" },
    { label: "MR",   id: "btn-mr",   variant: "mem" },
    { label: "M+",   id: "btn-mplus", variant: "mem" },
    { label: "M−",   id: "btn-mminus", variant: "mem" },
  ],
];

// ─── Variant styles ────────────────────────────────────────────────────────────
const VARIANT_STYLE: Record<BtnVariant, string> = {
  digit:  "bg-[var(--bg-base)] border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)] active:scale-95",
  op:     "bg-violet-100 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/60 active:scale-95 font-bold",
  action: "bg-[var(--bg-muted)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] active:scale-95",
  eq:     "bg-gradient-to-br from-violet-600 to-indigo-600 border-transparent text-white hover:from-violet-500 hover:to-indigo-500 active:scale-95 font-bold shadow-lg shadow-violet-500/20",
  fn:     "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 active:scale-95 text-xs",
  mem:    "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 active:scale-95 text-xs",
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function CalculatorClient() {
  const [mode, setMode] = useState<Mode>("basic");
  const [deg, setDeg] = useState(true); // degrees vs radians
  const [calc, setCalc] = useState<CalcState>(INIT);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // ── Core logic ──────────────────────────────────────────────────────────────
  const pressDigit = useCallback((d: string) => {
    setCalc((c) => {
      if (c.fresh || c.justEval) {
        return { ...c, display: d === "." ? "0." : d, fresh: false, justEval: false };
      }
      if (d === "." && c.display.includes(".")) return c;
      const next = c.display === "0" && d !== "." ? d : c.display + d;
      return { ...c, display: next };
    });
  }, []);

  const pressOp = useCallback((op: string) => {
    setCalc((c) => {
      const cur = parseFloat(c.display);
      if (c.prev !== null && c.op && !c.fresh && !c.justEval) {
        const result = applyOp(c.prev, c.op, cur);
        return {
          ...c,
          display: fmt(result),
          expr: `${fmt(result)} ${op}`,
          prev: result,
          op,
          fresh: true,
          justEval: false,
        };
      }
      return {
        ...c,
        expr: `${fmt(cur)} ${op}`,
        prev: cur,
        op,
        fresh: true,
        justEval: false,
      };
    });
  }, []);

  const pressEq = useCallback(() => {
    setCalc((c) => {
      if (c.prev === null || !c.op) return c;
      const cur = parseFloat(c.display);
      const result = applyOp(c.prev, c.op, cur);
      const entry = `${c.expr} ${fmt(cur)} = ${fmt(result)}`;
      setHistory((h) => [entry, ...h].slice(0, 20));
      return {
        ...c,
        display: fmt(result),
        expr: entry,
        prev: null,
        op: null,
        fresh: true,
        justEval: true,
      };
    });
  }, []);

  const pressAC = useCallback(() => {
    setCalc(INIT);
  }, []);

  const pressSign = useCallback(() => {
    setCalc((c) => ({ ...c, display: fmt(-parseFloat(c.display)) }));
  }, []);

  const pressPct = useCallback(() => {
    setCalc((c) => {
      const n = parseFloat(c.display);
      const result = c.prev !== null ? (c.prev * n) / 100 : n / 100;
      return { ...c, display: fmt(result), fresh: true };
    });
  }, []);

  // Unary scientific functions
  const pressFn = useCallback(
    (fn: string) => {
      setCalc((c) => {
        const n = parseFloat(c.display);
        const toRad = deg ? (x: number) => (x * Math.PI) / 180 : (x: number) => x;
        const fromRad = deg ? (x: number) => (x * 180) / Math.PI : (x: number) => x;
        let result: number;
        let label = "";
        switch (fn) {
          case "sin":    result = Math.sin(toRad(n));  label = `sin(${fmt(n)})`; break;
          case "cos":    result = Math.cos(toRad(n));  label = `cos(${fmt(n)})`; break;
          case "tan":    result = Math.tan(toRad(n));  label = `tan(${fmt(n)})`; break;
          case "asin":   result = fromRad(Math.asin(n)); label = `sin⁻¹(${fmt(n)})`; break;
          case "acos":   result = fromRad(Math.acos(n)); label = `cos⁻¹(${fmt(n)})`; break;
          case "atan":   result = fromRad(Math.atan(n)); label = `tan⁻¹(${fmt(n)})`; break;
          case "log":    result = Math.log10(n);       label = `log(${fmt(n)})`; break;
          case "ln":     result = Math.log(n);         label = `ln(${fmt(n)})`; break;
          case "sqrt":   result = Math.sqrt(n);        label = `√(${fmt(n)})`; break;
          case "sq":     result = n * n;               label = `(${fmt(n)})²`; break;
          case "cube":   result = n * n * n;           label = `(${fmt(n)})³`; break;
          case "fact":   result = factorial(n);        label = `${fmt(n)}!`; break;
          case "inv":    result = 1 / n;               label = `1/${fmt(n)}`; break;
          case "pi":     result = Math.PI;             label = "π"; break;
          case "e":      result = Math.E;              label = "e"; break;
          default:       return c;
        }
        if (!isNaN(result)) {
          setHistory((h) => [`${label} = ${fmt(result)}`, ...h].slice(0, 20));
        }
        return { ...c, display: fmt(result), expr: `${label} =`, fresh: true, justEval: true };
      });
    },
    [deg]
  );

  // Memory ops
  const pressMem = useCallback((op: string) => {
    setCalc((c) => {
      const n = parseFloat(c.display);
      switch (op) {
        case "mc":     return { ...c, memory: 0 };
        case "mr":     return { ...c, display: fmt(c.memory), fresh: true };
        case "mplus":  return { ...c, memory: c.memory + n };
        case "mminus": return { ...c, memory: c.memory - n };
        default:       return c;
      }
    });
  }, []);

  // Handle any button press by label
  const handleBtn = useCallback(
    (btn: Btn) => {
      const { label, id } = btn;

      if (btn.variant === "digit") { pressDigit(label); return; }
      if (btn.variant === "eq")    { pressEq();         return; }
      if (btn.variant === "op")    {
        if (label === "xʸ") { pressOp("^"); return; }
        pressOp(label);
        return;
      }
      if (btn.variant === "mem") {
        const map: Record<string, string> = { "btn-mc": "mc", "btn-mr": "mr", "btn-mplus": "mplus", "btn-mminus": "mminus" };
        pressMem(map[id] || "mc");
        return;
      }
      // action or fn
      switch (id) {
        case "btn-ac":     pressAC();           break;
        case "btn-sign":   pressSign();         break;
        case "btn-pct":    pressPct();          break;
        case "btn-sin":    pressFn("sin");      break;
        case "btn-cos":    pressFn("cos");      break;
        case "btn-tan":    pressFn("tan");      break;
        case "btn-asin":   pressFn("asin");     break;
        case "btn-acos":   pressFn("acos");     break;
        case "btn-atan":   pressFn("atan");     break;
        case "btn-log":    pressFn("log");      break;
        case "btn-ln":     pressFn("ln");       break;
        case "btn-sqrt":   pressFn("sqrt");     break;
        case "btn-sq":     pressFn("sq");       break;
        case "btn-cube":   pressFn("cube");     break;
        case "btn-fact":   pressFn("fact");     break;
        case "btn-inv":    pressFn("inv");      break;
        case "btn-pi":     pressFn("pi");       break;
        case "btn-e":      pressFn("e");        break;
        case "btn-pow":    pressOp("^");        break;
      }
    },
    [pressDigit, pressEq, pressOp, pressMem, pressAC, pressSign, pressPct, pressFn]
  );

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const keyMap: Record<string, string> = {
        "0": "btn-0", "1": "btn-1", "2": "btn-2", "3": "btn-3",
        "4": "btn-4", "5": "btn-5", "6": "btn-6", "7": "btn-7",
        "8": "btn-8", "9": "btn-9", ".": "btn-dot",
        "+": "btn-add", "-": "btn-sub", "*": "btn-mul", "/": "btn-div",
        "Enter": "btn-eq", "=": "btn-eq",
        "Escape": "btn-ac", "Backspace": "btn-ac",
        "%": "btn-pct",
      };
      const id = keyMap[e.key];
      if (!id) return;
      e.preventDefault();
      const all = [...BASIC_GRID.flat(), ...SCI_TOP.flat()];
      const btn = all.find((b) => b.id === id);
      if (btn) {
        handleBtn(btn);
        // flash the button
        const el = document.getElementById(id);
        if (el) { el.classList.add("scale-90"); setTimeout(() => el.classList.remove("scale-90"), 100); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleBtn]);

  // ── Display font size ────────────────────────────────────────────────────────
  const displayLen = calc.display.length;
  const displaySize =
    displayLen > 14 ? "text-2xl" :
    displayLen > 10 ? "text-3xl" :
    displayLen > 7  ? "text-4xl" : "text-5xl";

  // ── Render a grid of buttons ─────────────────────────────────────────────────
  const renderGrid = (grid: Btn[][]) =>
    grid.map((row, ri) => (
      <div key={ri} className="flex gap-2">
        {row.map((btn) => (
          <button
            key={btn.id}
            id={btn.id}
            onClick={() => handleBtn(btn)}
            className={`flex-1 transition-all duration-100 border rounded-xl font-semibold text-base py-4 select-none ${
              btn.wide ? "flex-[2]" : ""
            } ${VARIANT_STYLE[btn.variant]}`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    ));

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 50% -5%, rgba(109,40,217,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] mb-8" aria-label="Breadcrumb">
          <Link href="/tools" className="hover:text-[var(--link-color)] transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--text-primary)] font-semibold">Calculator</span>
        </nav>

        {/* Mode tabs */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-1 gap-1">
            {(["basic", "scientific"] as Mode[]).map((m) => (
              <button
                key={m}
                id={`tab-${m}`}
                onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
                  mode === m
                    ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Deg/Rad toggle (only in scientific) */}
            {mode === "scientific" && (
              <button
                id="btn-deg-rad"
                onClick={() => setDeg((d) => !d)}
                className="px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors"
              >
                {deg ? "DEG" : "RAD"}
              </button>
            )}
            {/* History toggle */}
            <button
              id="btn-history"
              onClick={() => setShowHistory((s) => !s)}
              title="History"
              className={`p-2 rounded-lg border border-[var(--border-color)] transition-colors ${
                showHistory
                  ? "bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400"
                  : "bg-[var(--bg-surface)] text-[var(--text-tertiary)] hover:bg-[var(--bg-muted)]"
              }`}
            >
              <Clock className="w-4 h-4" />
            </button>
            {/* Reset */}
            <button
              id="btn-reset"
              onClick={pressAC}
              title="Reset"
              className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-tertiary)] hover:bg-[var(--bg-muted)] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* History panel */}
        {showHistory && (
          <div className="mb-4 p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] max-h-48 overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">History</p>
              <button
                id="btn-clear-history"
                onClick={() => setHistory([])}
                className="text-xs text-red-500 hover:text-red-400 font-semibold"
              >
                Clear
              </button>
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-[var(--text-tertiary)] text-center py-3">No calculations yet</p>
            ) : (
              <div className="space-y-1.5">
                {history.map((h, i) => (
                  <div key={i} className="text-sm text-[var(--text-secondary)] font-mono truncate py-1 border-b border-[var(--border-color)] last:border-0">
                    {h}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Calculator body */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xl overflow-hidden">
          {/* Display */}
          <div
            className="px-6 pt-6 pb-5 text-right select-none"
            style={{ background: "linear-gradient(135deg, var(--bg-surface), var(--bg-muted))" }}
          >
            {/* Memory indicator */}
            {calc.memory !== 0 && (
              <div className="text-xs font-bold text-emerald-500 mb-1">M: {fmt(calc.memory)}</div>
            )}
            {/* Expression */}
            <div className="h-5 mb-1 text-sm text-[var(--text-tertiary)] font-mono truncate">
              {calc.expr || "\u00A0"}
            </div>
            {/* Main display */}
            <div
              id="calc-display"
              className={`font-mono font-bold text-[var(--text-primary)] tracking-tight truncate transition-all ${displaySize}`}
            >
              {calc.display}
            </div>
          </div>

          {/* Buttons */}
          <div className="p-4 flex flex-col gap-2">
            {/* Scientific rows (shown only in scientific mode) */}
            {mode === "scientific" && (
              <div className="flex flex-col gap-2 pb-3 mb-1 border-b border-[var(--border-color)]">
                {renderGrid(SCI_TOP)}
              </div>
            )}

            {/* Basic rows */}
            {renderGrid(BASIC_GRID)}
          </div>

          {/* Keyboard hint */}
          <div className="px-4 pb-3 text-center">
            <p className="text-[10px] text-[var(--text-tertiary)]">
              Keyboard supported · Esc to clear
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
