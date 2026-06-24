"use client";

import { useState, useEffect } from "react";
import { Cookie, X, ChevronDown, Shield, BarChart2, Megaphone } from "lucide-react";

// ── Cookie helpers ────────────────────────────────────────────────────────────
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

interface CookiePrefs {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_NAME = "lb_cookie_consent";
const COOKIE_DAYS = 365;

// ── Main component ─────────────────────────────────────────────────────────────
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>({ necessary: true, analytics: false, marketing: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = getCookie(COOKIE_NAME);
    if (!stored) {
      const t = setTimeout(() => setVisible(true), 700);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  function save(accepted: CookiePrefs) {
    setSaving(true);
    setCookie(COOKIE_NAME, JSON.stringify(accepted), COOKIE_DAYS);
    setTimeout(() => { setSaving(false); setVisible(false); }, 350);
  }

  const handleAcceptAll  = () => save({ necessary: true, analytics: true, marketing: true });
  const handleRejectAll  = () => save({ necessary: true, analytics: false, marketing: false });
  const handleSavePrefs  = () => save(prefs);
  const toggle = (key: keyof Omit<CookiePrefs, "necessary">) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={handleRejectAll}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          animation: "fadeIn 0.3s ease",
        }}
      />

      {/* Banner */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cookie consent"
        style={{
          position: "fixed",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          width: "min(520px, calc(100vw - 32px))",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          borderRadius: "20px",
          padding: "20px 22px 18px",
          boxShadow: "0 20px 60px -10px rgba(0,0,0,0.25), 0 4px 16px -4px rgba(0,0,0,0.15)",
          animation: "cookieSlideUp 0.38s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          {/* Icon badge */}
          <span style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: "color-mix(in srgb, var(--link-color) 12%, transparent)",
            color: "var(--link-color)",
          }}>
            <Cookie size={16} />
          </span>

          <h2 style={{ flex: 1, margin: 0, fontSize: 15, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
            We use cookies
          </h2>

          <button
            aria-label="Reject all and close"
            onClick={handleRejectAll}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 28, height: 28, borderRadius: 8, border: "none",
              background: "transparent", color: "var(--text-tertiary)", cursor: "pointer",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-muted)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-tertiary)"; }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--text-secondary)", margin: "0 0 14px" }}>
          Learno-Boy uses cookies to give you the best experience. Essential cookies keep the
          site running. Optional cookies help us understand how you use the site and improve our content.
        </p>

        {/* Manage toggle */}
        <button
          onClick={() => setManageOpen(v => !v)}
          aria-expanded={manageOpen}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 600, color: "var(--link-color)",
            background: "none", border: "none", padding: 0, cursor: "pointer",
            marginBottom: 14, letterSpacing: "0.01em", opacity: 1,
          }}
        >
          <span>Manage preferences</span>
          <ChevronDown size={14} style={{ transform: manageOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }} />
        </button>

        {/* Preferences panel */}
        {manageOpen && (
          <div style={{
            display: "flex", flexDirection: "column", gap: 2,
            marginBottom: 16, paddingTop: 4, paddingBottom: 4,
            borderTop: "1px solid var(--border-color)",
            borderBottom: "1px solid var(--border-color)",
            animation: "fadeIn 0.2s ease",
          }}>
            <PrefRow icon={<Shield size={14} />}    label="Necessary" description="Required for login, security, and core features." checked={true} locked />
            <PrefRow icon={<BarChart2 size={14} />} label="Analytics"  description="Help us understand page performance and traffic." checked={prefs.analytics} onChange={() => toggle("analytics")} />
            <PrefRow icon={<Megaphone size={14} />} label="Marketing"  description="Allow personalised content and advertisement tracking." checked={prefs.marketing} onChange={() => toggle("marketing")} />
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <BannerBtn variant="ghost"   onClick={handleRejectAll}  disabled={saving}>Reject all</BannerBtn>
          {manageOpen && (
            <BannerBtn variant="outline" onClick={handleSavePrefs} disabled={saving}>Save preferences</BannerBtn>
          )}
          <BannerBtn variant="primary" onClick={handleAcceptAll}  disabled={saving} minWidth={100}>
            {saving ? <UiverseLoader size={16} /> : "Accept all"}
          </BannerBtn>
        </div>
      </div>
    </>
  );
}

// ── Button ─────────────────────────────────────────────────────────────────────
interface BannerBtnProps {
  variant: "ghost" | "outline" | "primary";
  onClick: () => void;
  disabled?: boolean;
  minWidth?: number;
  children: React.ReactNode;
}

function BannerBtn({ variant, onClick, disabled, minWidth, children }: BannerBtnProps) {
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    height: 34, padding: "0 16px", borderRadius: 10,
    fontSize: 13, fontWeight: 600, cursor: "pointer",
    transition: "all 0.15s ease", border: "1px solid transparent",
    whiteSpace: "nowrap", minWidth: minWidth,
    opacity: disabled ? 0.65 : 1, pointerEvents: disabled ? "none" : "auto",
  };

  const styles: Record<string, React.CSSProperties> = {
    ghost:   { ...base, background: "transparent", color: "var(--text-secondary)", borderColor: "var(--border-color)" },
    outline: { ...base, background: "transparent", color: "var(--link-color)",     borderColor: "var(--link-color)" },
    primary: { ...base, background: "var(--link-color)", color: "#fff",             borderColor: "var(--link-color)" },
  };

  return (
    <button style={styles[variant]} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

// ── Preference row ─────────────────────────────────────────────────────────────
interface PrefRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  locked?: boolean;
  onChange?: () => void;
}

function PrefRow({ icon, label, description, checked, locked, onChange }: PrefRowProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 4px" }}>
      <span style={{ color: "var(--text-tertiary)", flexShrink: 0, display: "flex" }}>{icon}</span>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{label}</span>
        <span style={{ fontSize: 11, color: "var(--text-tertiary)", lineHeight: 1.4 }}>{description}</span>
      </div>

      {/* Toggle switch */}
      <label
        style={{
          display: "flex", alignItems: "center", gap: 7, flexShrink: 0,
          cursor: locked ? "not-allowed" : "pointer", opacity: locked ? 0.65 : 1,
        }}
        title={locked ? "Always on" : undefined}
      >
        {locked ? (
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Always on
          </span>
        ) : (
          <>
            <input
              type="checkbox"
              checked={checked}
              disabled={locked}
              onChange={onChange}
              aria-label={`${label} cookies`}
              style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: "relative", display: "block",
                width: 38, height: 22, borderRadius: 11,
                background: checked ? "var(--link-color)" : "var(--bg-muted)",
                border: `1px solid ${checked ? "var(--link-color)" : "var(--border-color)"}`,
                transition: "background 0.2s, border-color 0.2s",
                flexShrink: 0,
              }}
              onClick={onChange}
              role="switch"
              aria-checked={checked}
            >
              <span style={{
                position: "absolute", top: 2,
                left: checked ? 18 : 2,
                width: 16, height: 16, borderRadius: "50%",
                background: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                transition: "left 0.2s cubic-bezier(0.34,1.56,0.64,1)",
              }} />
            </span>
          </>
        )}
      </label>
    </div>
  );
}

// ── Uiverse SVG loader (Lissy07) ───────────────────────────────────────────────
function UiverseLoader({ size = 18 }: { size?: number }) {
  const d =
    "M29.760000000000005 18.72 c0 7.28 -3.9200000000000004 13.600000000000001 -9.840000000000002 16.96 c -2.8800000000000003 1.6800000000000002 -6.24 2.64 -9.840000000000002 2.64 c -3.6 0 -6.88 -0.96 -9.76 -2.64 c0 -7.28 3.9200000000000004 -13.52 9.840000000000002 -16.96 c2.8800000000000003 -1.6800000000000002 6.24 -2.64 9.76 -2.64 S26.880000000000003 17.040000000000003 29.760000000000005 18.72 c5.84 3.3600000000000003 9.76 9.68 9.840000000000002 16.96 c -2.8800000000000003 1.6800000000000002 -6.24 2.64 -9.76 2.64 c -3.6 0 -6.88 -0.96 -9.840000000000002 -2.64 c -5.84 -3.3600000000000003 -9.76 -9.68 -9.76 -16.96 c0 -7.28 3.9200000000000004 -13.600000000000001 9.76 -16.96 C25.84 5.120000000000001 29.760000000000005 11.440000000000001 29.760000000000005 18.72z";
  return (
    <svg viewBox="0 0 40 40" height={size} width={size} preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "visible", display: "inline-block", verticalAlign: "middle" }} aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeOpacity={0.25} strokeWidth="4" pathLength="100" d={d} />
      <path fill="none" stroke="currentColor" strokeWidth="4" pathLength="100" d={d}
        style={{ strokeDasharray: "15, 85", strokeDashoffset: 0, strokeLinecap: "round", animation: "uiverse-travel 2s linear infinite" }} />
    </svg>
  );
}
