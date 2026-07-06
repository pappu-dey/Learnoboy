"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

function CopyBtn({ text }: { text: string }) {
  const [c, setC] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }}
      className="ml-2 p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-muted)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
      {c ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function zodiacSign(d: Date): string {
  const m = d.getMonth() + 1, day = d.getDate();
  if ((m === 3 && day >= 21) || (m === 4 && day <= 19))  return "Aries ♈";
  if ((m === 4 && day >= 20) || (m === 5 && day <= 20))  return "Taurus ♉";
  if ((m === 5 && day >= 21) || (m === 6 && day <= 20))  return "Gemini ♊";
  if ((m === 6 && day >= 21) || (m === 7 && day <= 22))  return "Cancer ♋";
  if ((m === 7 && day >= 23) || (m === 8 && day <= 22))  return "Leo ♌";
  if ((m === 8 && day >= 23) || (m === 9 && day <= 22))  return "Virgo ♍";
  if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return "Libra ♎";
  if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return "Scorpio ♏";
  if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return "Sagittarius ♐";
  if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return "Capricorn ♑";
  if ((m === 1 && day >= 20) || (m === 2 && day <= 18))  return "Aquarius ♒";
  return "Pisces ♓";
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AgeTool() {
  const [dob, setDob] = useState("");
  const [refDate, setRefDate] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ref = refDate ? new Date(refDate) : new Date(today);
  ref.setHours(0, 0, 0, 0);
  const birth = dob ? new Date(dob) : null;
  if (birth) birth.setHours(0, 0, 0, 0);

  let age: { y: number; m: number; d: number } | null = null;
  let totalDays = 0, totalWeeks = 0, totalHours = 0, nextBdDays = 0;
  let dayBorn = "", zodiac = "";
  let error = "";

  if (birth) {
    if (birth > ref) {
      error = "Date of birth cannot be after the reference date.";
    } else {
      let y = ref.getFullYear() - birth.getFullYear();
      let m = ref.getMonth() - birth.getMonth();
      let d = ref.getDate() - birth.getDate();
      if (d < 0) { m--; d += new Date(ref.getFullYear(), ref.getMonth(), 0).getDate(); }
      if (m < 0) { y--; m += 12; }
      age = { y, m, d };

      totalDays  = Math.floor((ref.getTime() - birth.getTime()) / 86400000);
      totalWeeks = Math.floor(totalDays / 7);
      totalHours = totalDays * 24;

      const nextBd = new Date(ref.getFullYear(), birth.getMonth(), birth.getDate());
      if (nextBd <= ref) nextBd.setFullYear(ref.getFullYear() + 1);
      nextBdDays = Math.ceil((nextBd.getTime() - ref.getTime()) / 86400000);

      dayBorn = DAY_NAMES[birth.getDay()];
      zodiac  = zodiacSign(birth);
    }
  }

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="dob-input" className="text-sm font-semibold text-[var(--text-primary)]">Date of Birth</label>
          <input id="dob-input" type="date" value={dob} onChange={(e) => setDob(e.target.value)}
            max={today.toISOString().split("T")[0]}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--link-color)]/40 focus:border-[var(--link-color)] transition-all" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ref-date" className="text-sm font-semibold text-[var(--text-primary)]">
            Reference Date <span className="font-normal text-[var(--text-tertiary)]">(defaults to today)</span>
          </label>
          <input id="ref-date" type="date" value={refDate} onChange={(e) => setRefDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--link-color)]/40 focus:border-[var(--link-color)] transition-all" />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-500 font-medium">⚠ {error}</p>}

      {age && !error && (
        <div className="mt-6 space-y-3 animate-fade-in-up">
          {/* Main age */}
          <div className="p-5 rounded-2xl border border-[var(--link-color)]/30 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-muted)]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-3">Your Age</p>
            <div className="flex items-end gap-5 flex-wrap">
              {[{ v: age.y, u: "Years" }, { v: age.m, u: "Months" }, { v: age.d, u: "Days" }].map(({ v, u }) => (
                <div key={u} className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[var(--text-primary)] leading-none">{v}</span>
                  <span className="text-sm font-semibold text-[var(--text-secondary)] mb-0.5">{u}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Days", value: totalDays.toLocaleString("en-IN") },
              { label: "Total Weeks", value: totalWeeks.toLocaleString("en-IN") },
              { label: "Total Hours", value: totalHours.toLocaleString("en-IN") },
              { label: "Next Birthday", value: `${nextBdDays}d away` },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-center">
                <div className="flex items-center justify-center gap-0.5">
                  <p className="text-lg font-extrabold text-[var(--text-primary)] leading-tight">{value}</p>
                  <CopyBtn text={value} />
                </div>
                <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5 font-medium">{label}</p>
              </div>
            ))}
          </div>

          {/* Fun facts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1">Born On</p>
              <p className="text-base font-bold text-[var(--text-primary)]">{dayBorn}</p>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1">Zodiac Sign</p>
              <p className="text-base font-bold text-[var(--text-primary)]">{zodiac}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
