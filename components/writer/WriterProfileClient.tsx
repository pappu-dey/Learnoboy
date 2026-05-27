"use client";

import { useState, useRef } from "react";
import { Camera, Save, ExternalLink, Link2, Globe, Loader2, CheckCircle, XCircle } from "lucide-react";

interface AuthorProfile {
  _id: string;
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  email: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  articleCount: number;
}

export default function WriterProfileClient({ authorId, initial }: { authorId: string; initial: AuthorProfile }) {
  const [profile, setProfile] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAvatarUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/avatar", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setProfile((p) => ({ ...p, avatar: data.url }));
        // Also save to /api/profile (user record)
        await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar: data.url }),
        });
        showToast("Avatar updated!");
      } else {
        showToast(data.error || "Upload failed.", false);
      }
    } catch {
      showToast("Upload failed.", false);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/authors/${authorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: profile.bio,
          avatar: profile.avatar,
          social: profile.social,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Profile saved!");
      } else {
        showToast(data.error || "Save failed.", false);
      }
    } catch {
      showToast("Network error.", false);
    } finally {
      setSaving(false);
    }
  };

  const initials = profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg"
          style={{
            background: toast.ok ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#ef4444,#dc2626)",
            color: "#fff",
          }}
        >
          {toast.ok ? <CheckCircle size={15} /> : <XCircle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Author Profile</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Your public author bio, avatar, and social links.
        </p>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl border border-[var(--border-color)] overflow-hidden" style={{ background: "var(--bg-surface)" }}>
        {/* Avatar section */}
        <div className="p-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                {profile.avatar
                  ? <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                  : initials
                }
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                style={{ background: "rgba(0,0,0,0.5)" }}
              >
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
              />
            </div>
            <div>
              <p className="font-semibold text-[var(--text-primary)]">{profile.name}</p>
              <p className="text-sm text-[var(--text-tertiary)]">{profile.email}</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{profile.articleCount} article{profile.articleCount !== 1 ? "s" : ""} published</p>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="mt-2 text-xs font-medium px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-all flex items-center gap-1.5"
              >
                <Camera size={12} />
                {uploading ? "Uploading…" : "Change avatar"}
              </button>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="p-6 border-b border-[var(--border-color)]">
          <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
            rows={4}
            placeholder="Write a short bio about yourself…"
            className="mt-2 w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
          />
        </div>

        {/* Social links */}
        <div className="p-6 border-b border-[var(--border-color)]">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Social Links</p>
          <div className="space-y-3">
            {[
              { key: "twitter", icon: Link2, placeholder: "https://twitter.com/yourhandle", label: "Twitter / X" },
              { key: "github", icon: Link2, placeholder: "https://github.com/yourusername", label: "GitHub" },
              { key: "linkedin", icon: Link2, placeholder: "https://linkedin.com/in/yourprofile", label: "LinkedIn" },
              { key: "website", icon: Globe, placeholder: "https://yourwebsite.com", label: "Website" },
            ].map(({ key, icon: Icon, placeholder, label }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--bg-muted)" }}>
                  <Icon size={14} className="text-[var(--text-tertiary)]" />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">{label}</label>
                  <input
                    type="url"
                    placeholder={placeholder}
                    value={profile.social?.[key as keyof typeof profile.social] || ""}
                    onChange={(e) => setProfile((p) => ({ ...p, social: { ...p.social, [key]: e.target.value } }))}
                    className="w-full mt-0.5 px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View public profile link */}
        <div className="p-4 flex items-center justify-between" style={{ background: "var(--bg-muted)" }}>
          <a
            href={`/author/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-[var(--link-color)] hover:underline"
          >
            <ExternalLink size={12} />
            View public profile
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 2px 8px rgba(16,185,129,0.3)" }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
