"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EXPERTISE_OPTIONS } from "@/types";
import {
  User,
  Mail,
  GraduationCap,
  Building2,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Send,
  BookOpen,
} from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  qualification: string;
  college: string;
  company: string;
  experience: string;
  expertise: string[];
  whyWrite: string;
}

const QUALIFICATIONS = [
  "High School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Self-taught",
  "Other",
];

const STEPS = ["Personal Info", "Expertise", "Review & Submit"];

export function WriterApplicationForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    qualification: "",
    college: "",
    company: "",
    experience: "",
    expertise: [],
    whyWrite: "",
  });

  const set = (key: keyof FormData, value: string | string[]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleExpertise = (item: string) => {
    set(
      "expertise",
      form.expertise.includes(item)
        ? form.expertise.filter((e) => e !== item)
        : [...form.expertise, item]
    );
  };

  const validateStep = (): string => {
    if (step === 0) {
      if (!form.fullName.trim()) return "Full name is required.";
      if (!form.email.trim() || !form.email.includes("@")) return "Valid email is required.";
      if (!form.qualification) return "Please select your highest qualification.";
    }
    if (step === 1) {
      if (form.expertise.length === 0) return "Select at least one area of expertise.";
      if (!form.whyWrite.trim() || form.whyWrite.trim().length < 20)
        return "Please write at least 20 characters explaining your motivation.";
    }
    return "";
  };

  const next = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => Math.min(s + 1, 2));
  };

  const back = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = async () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/writer/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          experience: form.experience ? parseInt(form.experience) : 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  
  if (submitted) {
    return (
      <div className="text-center py-12 px-6 max-w-lg mx-auto">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 8px 24px rgba(16,185,129,0.35)" }}
        >
          <Check size={38} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
          Application Submitted! 🎉
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
          Thank you for applying! Our team will review your application and get back to you soon.
          You can check your application status in your profile.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 4px 12px rgba(37,99,235,0.35)" }}
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {}
      <div className="mb-8">
        <div className="flex items-center gap-0">
          {STEPS.map((label, idx) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                  style={
                    idx < step
                      ? { background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", boxShadow: "0 2px 8px rgba(16,185,129,0.35)" }
                      : idx === step
                      ? { background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "#fff", boxShadow: "0 2px 8px rgba(37,99,235,0.35)" }
                      : { background: "var(--bg-muted)", color: "var(--text-tertiary)", border: "1px solid var(--border-color)" }
                  }
                >
                  {idx < step ? <Check size={14} /> : idx + 1}
                </div>
                <span
                  className="text-[10px] font-medium mt-1 text-center whitespace-nowrap"
                  style={{ color: idx <= step ? "var(--text-primary)" : "var(--text-tertiary)" }}
                >
                  {label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all duration-500"
                  style={{ background: idx < step ? "linear-gradient(90deg, #10b981, #059669)" : "var(--border-color)" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {}
      <div
        className="rounded-2xl border border-[var(--border-color)] overflow-hidden"
        style={{ background: "var(--bg-surface)" }}
      >
        {}
        {step === 0 && (
          <div className="p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Personal Information</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">Tell us a bit about yourself.</p>
            </div>

            {}
            <Field icon={<User size={14} />} label="Full Name *">
              <input
                type="text"
                id="apply-fullname"
                placeholder="Your full name"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </Field>

            {}
            <Field icon={<Mail size={14} />} label="Email Address *">
              <input
                type="email"
                id="apply-email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </Field>

            {}
            <Field icon={<GraduationCap size={14} />} label="Highest Qualification *">
              <select
                id="apply-qualification"
                value={form.qualification}
                onChange={(e) => set("qualification", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] text-sm outline-none focus:ring-2 focus:ring-blue-500/30 appearance-none cursor-pointer"
              >
                <option value="">Select qualification…</option>
                {QUALIFICATIONS.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </Field>

            {}
            <Field icon={<BookOpen size={14} />} label="College / University (optional)">
              <input
                type="text"
                id="apply-college"
                placeholder="e.g. Delhi University"
                value={form.college}
                onChange={(e) => set("college", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </Field>

            {/* Company + Experience — side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field icon={<Building2 size={14} />} label="Current Company (optional)">
                <input
                  type="text"
                  id="apply-company"
                  placeholder="e.g. Google"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </Field>
              <Field icon={<Briefcase size={14} />} label="Work Experience (years, optional)">
                <input
                  type="number"
                  id="apply-experience"
                  placeholder="0"
                  min="0"
                  max="50"
                  value={form.experience}
                  onChange={(e) => set("experience", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </Field>
            </div>
          </div>
        )}

        {/* Step 2 — Expertise & Motivation */}
        {step === 1 && (
          <div className="p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Expertise & Motivation</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                What topics do you want to write about?
              </p>
            </div>

            {/* Expertise chips */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">
                Areas of Expertise * <span className="normal-case font-normal">({form.expertise.length} selected)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {EXPERTISE_OPTIONS.map((opt) => {
                  const selected = form.expertise.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      id={`expertise-${opt.replace(/\s+/g, "-").toLowerCase()}`}
                      onClick={() => toggleExpertise(opt)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150"
                      style={
                        selected
                          ? {
                              background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.10))",
                              color: "var(--link-color)",
                              borderColor: "rgba(37,99,235,0.35)",
                            }
                          : {
                              background: "var(--bg-muted)",
                              color: "var(--text-secondary)",
                              borderColor: "var(--border-color)",
                            }
                      }
                    >
                      {selected && <Check size={10} style={{ display: "inline", marginRight: "0.3rem" }} />}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Why write */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">
                Why do you want to write for Learno-Boy? *
              </label>
              <textarea
                id="apply-why-write"
                rows={5}
                placeholder="Tell us about your motivation, what topics excite you, and what value you'd bring to our readers…"
                value={form.whyWrite}
                onChange={(e) => set("whyWrite", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] text-sm outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
              />
              <p className="text-[10px] text-[var(--text-tertiary)] mt-1 text-right">
                {form.whyWrite.length} characters
              </p>
            </div>
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 2 && (
          <div className="p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Review Your Application</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">Please double-check everything before submitting.</p>
            </div>

            <div className="space-y-3">
              <ReviewRow label="Full Name" value={form.fullName} />
              <ReviewRow label="Email" value={form.email} />
              <ReviewRow label="Qualification" value={form.qualification} />
              {form.college && <ReviewRow label="College" value={form.college} />}
              {form.company && <ReviewRow label="Company" value={form.company} />}
              {form.experience && <ReviewRow label="Experience" value={`${form.experience} year(s)`} />}
              <ReviewRow
                label="Expertise"
                value={
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {form.expertise.map((e) => (
                      <span
                        key={e}
                        className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                        style={{ background: "rgba(37,99,235,0.1)", color: "var(--link-color)" }}
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                }
              />
              <div>
                <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Why I want to write</p>
                <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed p-3 rounded-xl" style={{ background: "var(--bg-muted)" }}>
                  &ldquo;{form.whyWrite}&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="px-6 py-3 text-sm text-red-600 font-medium" style={{ background: "rgba(239,68,68,0.06)" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Footer nav */}
        <div
          className="flex items-center justify-between p-4 border-t border-[var(--border-color)]"
          style={{ background: "var(--bg-muted)" }}
        >
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-all disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronLeft size={15} /> Back
          </button>

          {step < 2 ? (
            <button
              type="button"
              id="apply-next-btn"
              onClick={next}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 4px 12px rgba(37,99,235,0.35)" }}
            >
              Next <ChevronRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              id="apply-submit-btn"
              onClick={submit}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 4px 12px rgba(16,185,129,0.35)" }}
            >
              {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Helper sub-components ──

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1.5">
        <span className="text-[var(--link-color)]">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="text-xs font-semibold text-[var(--text-tertiary)] w-28 shrink-0 pt-0.5 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm text-[var(--text-primary)] flex-1">{value}</span>
    </div>
  );
}
