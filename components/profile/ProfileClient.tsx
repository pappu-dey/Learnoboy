"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Camera,
  Loader2,
  Copy,
  Check,
  LogOut,
  User,
  Mail,
  Calendar,
  LayoutDashboard,
  PenLine,
  ShieldCheck,
  Send,
  AlertCircle,
  Clock,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────
export interface Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    writerStatus?: string;
    writerApplicationMessage?: string;
    joinedAt?: string;
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const ROLE_CONFIG = {
  superadmin: {
    label: "Super Admin",
    gradient: "linear-gradient(135deg, #7c3aed, #2563eb)",
    bg: "rgba(124,58,237,0.1)",
    color: "#7c3aed",
    darkColor: "#a78bfa",
    icon: ShieldCheck,
  },
  writer: {
    label: "Writer",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    bg: "rgba(16,185,129,0.1)",
    color: "#059669",
    darkColor: "#34d399",
    icon: PenLine,
  },
  reader: {
    label: "Reader",
    gradient: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    bg: "rgba(37,99,235,0.1)",
    color: "#2563eb",
    darkColor: "#60a5fa",
    icon: User,
  },
} as const;

// ─── Component ─────────────────────────────────────────────────────────────
export function ProfileClient({ session }: { session: Session }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(session.user.image || null);
  const [uploadMsg, setUploadMsg] = useState<{ text: string; ok: boolean } | null>(null);
  
  // Writer application states
  const [writerStatus, setWriterStatus] = useState<string>(session.user.writerStatus || "none");
  const [writerMsg, setWriterMsg] = useState<string>(session.user.writerApplicationMessage || "");
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const user = session.user;
  const role = (user.role ?? "reader") as keyof typeof ROLE_CONFIG;
  const roleConf = ROLE_CONFIG[role] || ROLE_CONFIG.reader;
  const RoleIcon = roleConf.icon;
  const initials = user.name ? getInitials(user.name) : "??";

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      setLoggingOut(false);
    }
  }

  function copyEmail() {
    if (user.email) {
      navigator.clipboard.writeText(user.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  async function handleSubmitApplication(e: React.FormEvent) {
    e.preventDefault();
    if (!writerMsg.trim()) {
      setApplyError("Please write a short application message.");
      return;
    }
    setApplying(true);
    setApplyError(null);
    setApplySuccess(null);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: writerMsg.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWriterStatus("pending");
        setApplySuccess("Application submitted successfully!");
        setTimeout(() => setApplySuccess(null), 5000);
      } else {
        setApplyError(data.error || "Submission failed. Please try again.");
      }
    } catch {
      setApplyError("Network error. Please check your connection.");
    } finally {
      setApplying(false);
    }
  }

  async function handleAvatarFile(file: File) {
    setUploading(true);
    setUploadMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const upRes = await fetch("/api/upload/avatar", { method: "POST", body: fd });
      const upData = await upRes.json();
      if (!upData.success) {
        setUploadMsg({ text: upData.error || "Upload failed.", ok: false });
        return;
      }
      const saveRes = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: upData.url }),
      });
      const saveData = await saveRes.json();
      if (saveData.success) {
        setAvatarUrl(upData.url);
        // Also sync Author document's avatar if they are a writer/superadmin
        if (role === "writer" || role === "superadmin") {
          // Find the active author ID from header or DB in page - 
          // profile PATCH route now handles auto-syncing User and Author documents,
          // so this triggers the sync on backend automatically!
        }
        setUploadMsg({ text: "Profile photo updated!", ok: true });
        setTimeout(() => setUploadMsg(null), 3000);
      } else {
        setUploadMsg({ text: "Uploaded but couldn't save.", ok: false });
      }
    } catch {
      setUploadMsg({ text: "Upload failed. Try again.", ok: false });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1rem",
        background: "var(--bg-base)",
      }}
    >
      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleAvatarFile(file);
          e.target.value = "";
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          borderRadius: "24px",
          border: "1px solid var(--border-color)",
          background: "var(--bg-surface)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          overflow: "hidden",
          animation: "profileRise 0.4s cubic-bezier(.22,1,.36,1) both",
        }}
      >
        <style>{`
          @keyframes profileRise {
            from { opacity:0; transform:translateY(20px); }
            to   { opacity:1; transform:translateY(0); }
          }
          @keyframes profileSpin { to { transform: rotate(360deg); } }
          .profile-avatar-wrap:hover .profile-avatar-overlay { opacity: 1 !important; }
        `}</style>

        {/* ── Gradient header banner ── */}
        <div
          style={{
            background: roleConf.gradient,
            height: "100px",
            position: "relative",
          }}
        >
          {/* Decorative blobs */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 60% 80% at 100% 0%, rgba(255,255,255,0.15) 0%, transparent 60%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 40% 60% at 0% 100%, rgba(0,0,0,0.15) 0%, transparent 60%)",
          }} />

          {/* Avatar — positioned half inside the banner */}
          <div
            className="profile-avatar-wrap"
            style={{
              position: "absolute",
              bottom: "-44px",
              left: "50%",
              transform: "translateX(-50%)",
              cursor: "pointer",
            }}
            onClick={() => !uploading && fileRef.current?.click()}
            title="Click to change profile photo"
          >
            {/* Spinning ring */}
            <div style={{
              position: "absolute",
              inset: "-6px",
              borderRadius: "50%",
              border: "1.5px dashed rgba(255,255,255,0.5)",
              animation: "profileSpin 16s linear infinite",
              pointerEvents: "none",
            }} />

            {/* Avatar circle */}
            <div style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              border: "3px solid var(--bg-surface)",
              background: roleConf.gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.7rem",
              fontWeight: 700,
              color: "#fff",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}>
              {avatarUrl
                ? <img src={avatarUrl} alt={user.name ?? "avatar"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : initials
              }
            </div>

            {/* Hover overlay */}
            <div
              className="profile-avatar-overlay"
              style={{
                position: "absolute",
                inset: "3px",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity .2s",
              }}
            >
              {uploading
                ? <Loader2 size={22} color="#fff" style={{ animation: "spin 0.7s linear infinite" }} />
                : <Camera size={22} color="#fff" />
              }
            </div>
          </div>
        </div>

        {/* ── Card body ── */}
        <div style={{ padding: "60px 28px 28px", textAlign: "center" }}>

          {/* Name */}
          <h1 style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            margin: 0,
          }}>
            {user.name ?? "Anonymous User"}
          </h1>

          {/* Role badge */}
          <div style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "4px 12px",
              borderRadius: "999px",
              background: roleConf.bg,
              color: roleConf.color,
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              border: `1px solid ${roleConf.color}30`,
            }}>
              <RoleIcon size={11} />
              {roleConf.label}
            </span>
          </div>

          {/* Upload feedback */}
          {uploadMsg && (
            <p style={{
              marginTop: "10px",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: uploadMsg.ok ? "#059669" : "#dc2626",
            }}>
              {uploadMsg.ok ? "✓ " : "✗ "}{uploadMsg.text}
            </p>
          )}

          {/* Panel shortcut links */}
          {(role === "superadmin" || role === "writer") && (
            <div style={{ marginTop: "16px", display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
              {role === "superadmin" && (
                <Link
                  href="/admin"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 16px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                    color: "#fff",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "opacity .15s, transform .12s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  <LayoutDashboard size={13} /> Admin Panel
                </Link>
              )}
              <Link
                href="/writer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 16px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg,#10b981,#059669)",
                  color: "#fff",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "opacity .15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                <PenLine size={13} /> Writer Panel
              </Link>
            </div>
          )}

          {/* ── Info rows ── */}
          <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>

            {/* Email */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 14px",
              borderRadius: "14px",
              background: "var(--bg-base)",
              border: "1px solid var(--border-color)",
              transition: "border-color .15s",
            }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "var(--bg-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "var(--link-color)",
              }}>
                <Mail size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--text-tertiary)", margin: 0 }}>
                  Email
                </p>
                <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-primary)", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.email ?? "—"}
                </p>
              </div>
              {user.email && (
                <button
                  onClick={copyEmail}
                  title="Copy email"
                  style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "var(--link-color)" : "var(--text-tertiary)", padding: "4px", borderRadius: "6px", display: "flex", transition: "color .15s" }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                </button>
              )}
            </div>

            {/* Change photo row */}
            <button
              onClick={() => !uploading && fileRef.current?.click()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 14px",
                borderRadius: "14px",
                background: "var(--bg-base)",
                border: "1px solid var(--border-color)",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
                transition: "border-color .15s, background .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-muted)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-base)"; }}
            >
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "var(--bg-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "var(--link-color)",
              }}>
                {uploading ? <Loader2 size={16} style={{ animation: "profileSpin .7s linear infinite" }} /> : <Camera size={16} />}
              </div>
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--text-tertiary)", margin: 0 }}>
                  Profile Photo
                </p>
                <p style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--link-color)", margin: "2px 0 0" }}>
                  {uploading ? "Uploading…" : "Click to change photo"}
                </p>
              </div>
            </button>

            {/* Joined */}
            {user.joinedAt && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 14px",
                borderRadius: "14px",
                background: "var(--bg-base)",
                border: "1px solid var(--border-color)",
              }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "var(--bg-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "var(--link-color)",
                }}>
                  <Calendar size={16} />
                </div>
                <div>
                  <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--text-tertiary)", margin: 0 }}>
                    Member since
                  </p>
                  <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-primary)", margin: "2px 0 0" }}>
                    {user.joinedAt}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Writer Application Section (Reader Only) ── */}
          {role === "reader" && (
            <div
              style={{
                marginTop: "24px",
                padding: "20px",
                borderRadius: "18px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-muted)",
                textAlign: "left",
                animation: "profileRise 0.3s ease both",
              }}
            >
              {writerStatus === "pending" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#f59e0b",
                        animation: "profilePulse 1.5s infinite ease-in-out",
                      }}
                    />
                    <style>{`
                      @keyframes profilePulse {
                        0% { transform: scale(0.9); opacity: 0.5; }
                        50% { transform: scale(1.2); opacity: 1; }
                        100% { transform: scale(0.9); opacity: 0.5; }
                      }
                    `}</style>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#d97706", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Clock size={14} /> Pending Review
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                    Application Under Review
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                    Our administrators are reviewing your request to become a writer. We will update your role as soon as it's processed!
                  </p>
                  {writerMsg && (
                    <div
                      style={{
                        marginTop: "4px",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        background: "var(--bg-base)",
                        borderLeft: "3.5px solid #f59e0b",
                        fontSize: "0.8rem",
                        fontStyle: "italic",
                        color: "var(--text-secondary)",
                        lineHeight: 1.4,
                      }}
                    >
                      "{writerMsg}"
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                    <PenLine size={16} style={{ color: "var(--link-color)" }} /> Apply to be a Writer
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                    Share your coding knowledge and write premium development tutorials directly on Learno-Boy.
                  </p>

                  {writerStatus === "rejected" && (
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        background: "rgba(239, 68, 68, 0.08)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        color: "#ef4444",
                        fontSize: "0.78rem",
                        fontWeight: 500,
                        lineHeight: 1.4,
                      }}
                    >
                      <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "1px" }} />
                      <div>
                        Your previous application was not approved. You are welcome to revise your message and re-apply!
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <label style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)" }}>
                      Your Message / Bio
                    </label>
                    <textarea
                      placeholder="Tell us about yourself, your development experience, and what topics you would love to write about..."
                      value={writerMsg}
                      onChange={(e) => setWriterMsg(e.target.value)}
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1.5px solid var(--border-color)",
                        background: "var(--bg-base)",
                        color: "var(--text-primary)",
                        fontSize: "0.82rem",
                        outline: "none",
                        resize: "none",
                        lineHeight: 1.4,
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--link-color)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                    />
                  </div>

                  {applyError && (
                    <div style={{ fontSize: "0.78rem", color: "#ef4444", fontWeight: 500 }}>
                      ✗ {applyError}
                    </div>
                  )}

                  {applySuccess && (
                    <div style={{ fontSize: "0.78rem", color: "#10b981", fontWeight: 500 }}>
                      ✓ {applySuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={applying}
                    style={{
                      marginTop: "4px",
                      padding: "10px 16px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, var(--link-color), #1d4ed8)",
                      color: "#fff",
                      border: "none",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: applying ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      transition: "opacity 0.2s",
                      opacity: applying ? 0.75 : 1,
                      boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
                    }}
                    onMouseEnter={(e) => { if (!applying) e.currentTarget.style.opacity = "0.9"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                  >
                    {applying ? (
                      <>
                        <Loader2 size={13} style={{ animation: "profileSpin 0.7s linear infinite" }} />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        Submit Application
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ── Divider ── */}
          <div style={{ margin: "24px 0", borderTop: "1px solid var(--border-color)" }} />

          {/* ── Sign out ── */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "14px",
              border: "1.5px solid var(--border-color)",
              background: "transparent",
              color: "#ef4444",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: loggingOut ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "background .2s, border-color .2s, transform .12s",
              opacity: loggingOut ? 0.6 : 1,
            }}
            onMouseEnter={e => {
              if (!loggingOut) {
                e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                e.currentTarget.style.borderColor = "#ef4444";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "var(--border-color)";
            }}
          >
            {loggingOut ? (
              <>
                <Loader2 size={16} style={{ animation: "profileSpin .7s linear infinite" }} />
                Signing out…
              </>
            ) : (
              <>
                <LogOut size={16} />
                Sign out
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
