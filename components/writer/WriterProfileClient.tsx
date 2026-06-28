"use client";

import { useState, useRef } from "react";
import {
  Camera, Save, Globe, Loader2, CheckCircle, XCircle,
  MapPin, GraduationCap, Building2, Briefcase, Link2, Image as ImageIcon,
} from "lucide-react";
import { EXPERTISE_OPTIONS } from "@/types";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

interface AuthorProfile {
  _id: string;
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  bannerImage?: string;
  email: string;
  location?: string;
  qualification?: string;
  company?: string;
  experience?: number;
  expertise?: string[];
  isVerified?: boolean;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
    portfolio?: string;
  };
  articleCount: number;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function profileCompleteness(profile: AuthorProfile): number {
  const fields = [
    !!profile.avatar,
    !!profile.bio && profile.bio.trim().length > 0,
    !!profile.location,
    (profile.expertise?.length ?? 0) > 0,
    !!profile.social?.linkedin || !!profile.social?.github || !!profile.social?.twitter,
    !!profile.bannerImage,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

export default function WriterProfileClient({
  authorId,
  initial,
}: {
  authorId: string;
  initial: AuthorProfile;
}) {
  const [profile, setProfile] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"avatar" | "banner" | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpload = async (file: File, field: "avatar" | "banner") => {
    setUploading(field);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/avatar", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        if (field === "avatar") {
          setProfile((p) => ({ ...p, avatar: data.url }));
          await fetch("/api/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ avatar: data.url }),
          });
        } else {
          setProfile((p) => ({ ...p, bannerImage: data.url }));
        }
        showToast(`${field === "avatar" ? "Avatar" : "Banner"} updated!`);
      } else {
        showToast(data.error || "Upload failed.", false);
      }
    } catch {
      showToast("Upload failed.", false);
    } finally {
      setUploading(null);
    }
  };

  const toggleExpertise = (item: string) => {
    const current = profile.expertise || [];
    setProfile((p) => ({
      ...p,
      expertise: current.includes(item)
        ? current.filter((e) => e !== item)
        : [...current, item],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/writer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: profile.bio,
          avatar: profile.avatar,
          bannerImage: profile.bannerImage,
          location: profile.location,
          qualification: profile.qualification,
          company: profile.company,
          experience: profile.experience,
          expertise: profile.expertise,
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

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const wordCount = countWords(profile.bio);
  const completion = profileCompleteness(profile);

  return (
    <div className="space-y-6 max-w-2xl">
      {}
      {toast && (
        <div
          className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg"
          style={{
            background: toast.ok
              ? "linear-gradient(135deg,#10b981,#059669)"
              : "linear-gradient(135deg,#ef4444,#dc2626)",
            color: "#fff",
          }}
        >
          {toast.ok ? <CheckCircle size={15} /> : <XCircle size={15} />}
          {toast.msg}
        </div>
      )}

      {}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            Author Profile
            {profile.isVerified && <VerifiedBadge size="sm" />}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Your public author bio, avatar, and social links.
          </p>
        </div>
        <a
          href={`/author/${profile.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-[var(--link-color)] hover:underline flex items-center gap-1"
        >
          <Globe size={12} /> View public profile
        </a>
      </div>

      {}
      <div
        className="p-4 rounded-2xl border border-[var(--border-color)]"
        style={{ background: "var(--bg-surface)" }}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Profile Completeness</p>
          <span className="text-sm font-bold" style={{ color: completion >= 80 ? "#10b981" : completion >= 50 ? "#f59e0b" : "#2563eb" }}>
            {completion}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-muted)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${completion}%`,
              background: completion >= 80 ? "linear-gradient(90deg,#10b981,#059669)" : completion >= 50 ? "linear-gradient(90deg,#f59e0b,#d97706)" : "linear-gradient(90deg,#2563eb,#7c3aed)",
            }}
          />
        </div>
        <p className="text-xs text-[var(--text-tertiary)] mt-1.5">
          {completion < 100 ? "Add more details to complete your profile." : "Profile fully complete! 🎉"}
        </p>
      </div>

      {}
      <div
        className="rounded-2xl border border-[var(--border-color)] overflow-hidden"
        style={{ background: "var(--bg-surface)" }}
      >
        {}
        <div
          className="relative h-28 group cursor-pointer overflow-hidden"
          style={{
            background: profile.bannerImage
              ? `url(${profile.bannerImage}) center/cover no-repeat`
              : "linear-gradient(135deg, #1e3a5f, #2563eb, #7c3aed)",
          }}
          onClick={() => bannerRef.current?.click()}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-white text-sm font-medium">
              {uploading === "banner" ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
              {uploading === "banner" ? "Uploading…" : "Change Banner"}
            </div>
          </div>
          <input
            ref={bannerRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "banner")}
          />
        </div>

        {}
        <div className="px-6 pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <div className="relative group z-10">
              <div
                className="w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center text-white text-2xl font-bold border-2 border-[var(--bg-surface)] shadow-md"
                style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
              >
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <button
                onClick={() => avatarRef.current?.click()}
                disabled={!!uploading}
                className="absolute inset-0 rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                style={{ background: "rgba(0,0,0,0.5)" }}
              >
                {uploading === "avatar" ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
              </button>
              <input
                ref={avatarRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "avatar")}
              />
            </div>
            <div className="mb-1">
              <p className="font-semibold text-[var(--text-primary)]">{profile.name}</p>
              <p className="text-xs text-[var(--text-tertiary)]">{profile.email}</p>
            </div>
          </div>

          {}
          <button
            onClick={() => avatarRef.current?.click()}
            disabled={!!uploading}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-all flex items-center gap-1.5"
          >
            <Camera size={12} />
            {uploading === "avatar" ? "Uploading…" : "Change avatar"}
          </button>
        </div>

        {}
        <div className="p-6 border-b border-[var(--border-color)]">
          <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider block mb-2">
            Bio <span className="normal-case font-normal">(10–300 words)</span>
          </label>
          <textarea
            id="writer-bio"
            value={profile.bio}
            onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
            rows={4}
            placeholder="Write a short bio about yourself…"
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[var(--text-tertiary)]">
              {wordCount < 10 ? <span className="text-red-500">{wordCount} words — need at least 10</span> : `${wordCount} words`}
            </span>
            <span className="text-[10px] text-[var(--text-tertiary)]">max 300 words</span>
          </div>
        </div>

        {}
        <div className="p-6 border-b border-[var(--border-color)]">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-4">Personal Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: "location", icon: <MapPin size={13} />, label: "Location", placeholder: "City, Country" },
              { key: "qualification", icon: <GraduationCap size={13} />, label: "Highest Qualification", placeholder: "e.g. Bachelor's Degree" },
              { key: "company", icon: <Building2 size={13} />, label: "Current Company", placeholder: "e.g. Google" },
              { key: "experience", icon: <Briefcase size={13} />, label: "Work Experience (years)", placeholder: "0", type: "number" },
            ].map(({ key, icon, label, placeholder, type }) => (
              <div key={key}>
                <label className="flex items-center gap-1 text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1.5">
                  <span className="text-[var(--link-color)]">{icon}</span> {label}
                </label>
                <input
                  id={`writer-${key}`}
                  type={type || "text"}
                  placeholder={placeholder}
                  value={(profile as unknown as Record<string, unknown>)[key] as string ?? ""}
                  onChange={(e) =>
                    setProfile((p) => ({
                      ...p,
                      [key]: type === "number" ? parseInt(e.target.value) || 0 : e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="p-6 border-b border-[var(--border-color)]">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
            Areas of Expertise
          </p>
          <div className="flex flex-wrap gap-2">
            {EXPERTISE_OPTIONS.map((opt) => {
              const selected = (profile.expertise || []).includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleExpertise(opt)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                  style={
                    selected
                      ? { background: "rgba(16,185,129,0.12)", color: "#059669", borderColor: "rgba(16,185,129,0.3)" }
                      : { background: "var(--bg-muted)", color: "var(--text-secondary)", borderColor: "var(--border-color)" }
                  }
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {}
        <div className="p-6 border-b border-[var(--border-color)]">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Social Links</p>
          <div className="space-y-3">
            {[
              { key: "twitter", label: "Twitter / X", placeholder: "https://twitter.com/yourhandle" },
              { key: "github", label: "GitHub", placeholder: "https://github.com/yourusername" },
              { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourprofile" },
              { key: "website", label: "Personal Website", placeholder: "https://yourwebsite.com" },
              { key: "portfolio", label: "Portfolio", placeholder: "https://portfolio.dev" },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--bg-muted)" }}>
                  <Link2 size={13} className="text-[var(--text-tertiary)]" />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">{label}</label>
                  <input
                    id={`writer-social-${key}`}
                    type="url"
                    placeholder={placeholder}
                    value={profile.social?.[key as keyof typeof profile.social] || ""}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, social: { ...p.social, [key]: e.target.value } }))
                    }
                    className="w-full mt-0.5 px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="p-4 flex items-center justify-end" style={{ background: "var(--bg-muted)" }}>
          <button
            id="writer-profile-save"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
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
