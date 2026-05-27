import Link from "next/link";
import { Shield, EyeOff, Mail, Lock, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | LearnoBoy",
  description: "Learn how we collect, protect, and safely handle your personal data on LearnoBoy.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Your privacy is our priority. This document outlines exactly how we manage, protect, and utilize your personal data at LearnoBoy.
          </p>
          <div className="mt-4 text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
            Last Updated: May 2026
          </div>
        </div>

        {/* Core Promises Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div 
            className="rounded-2xl border border-[var(--border-color)] p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
              <Mail size={24} />
            </div>
            <h3 className="font-bold text-[var(--text-primary)] mb-2">Promotional Use</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              We use your email to send platform updates, educational newsletters, and promotional campaign offers.
            </p>
          </div>

          <div 
            className="rounded-2xl border border-[var(--border-color)] p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <EyeOff size={24} />
            </div>
            <h3 className="font-bold text-[var(--text-primary)] mb-2">No 3rd-Party Sharing</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              We strictly **never share, sell, or rent** your email address or personal details with any external advertisers or corporations.
            </p>
          </div>

          <div 
            className="rounded-2xl border border-[var(--border-color)] p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
              <Lock size={24} />
            </div>
            <h3 className="font-bold text-[var(--text-primary)] mb-2">Safe Hands Guarantee</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Your passwords are encrypted, and all database interactions are secured via industry-standard protocols.
            </p>
          </div>

        </div>

        {/* Detailed Privacy Sections */}
        <div className="space-y-12 text-[var(--text-secondary)] leading-relaxed">
          
          {/* Section 1 */}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <Shield className="text-blue-500" size={24} />
              1. Information We Collect
            </h2>
            <p className="mb-4">
              To provide a rich, premium educational experience, we collect specific information when you interact with our platform:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm mb-4">
              <li>
                <strong>Account Information</strong>: Your name, email address, password (stored as a secure hash), and registration timestamps when you sign up.
              </li>
              <li>
                <strong>Writer Application Profile</strong>: Bio, avatar pictures, social media links (GitHub, Twitter), and messages submitted to become a writer.
              </li>
              <li>
                <strong>Article Metadata</strong>: Title, content, category mappings, and view count stats on articles you write.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <Mail className="text-emerald-500" size={24} />
              2. Promotional Email & Newsletter Consent
            </h2>
            <p className="mb-4">
              At LearnoBoy, we aim to provide high-quality educational resources, tutorials, and community updates.
            </p>
            <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] space-y-3">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Email Promotion Guidelines:
              </p>
              <p className="text-sm">
                - When you create an account, you consent to receive periodic promotional emails from us. This includes new course announcements, platform features, specialized tutorials, developer compilations, and marketing newsletters.
              </p>
              <p className="text-sm">
                - <strong>Opt-Out Policy</strong>: You maintain full control. If at any time you wish to stop receiving these promotional emails, you can unsubscribe instantly by clicking the "unsubscribe" link located at the bottom of any of our messages.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <EyeOff className="text-indigo-500" size={24} />
              3. Strict Third-Party Non-Disclosure
            </h2>
            <p className="mb-4">
              We take an uncompromising stance on data sharing:
            </p>
            <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] flex items-start gap-4">
              <CheckCircle2 className="text-indigo-500 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">Our Anti-Sharing Promise</h3>
                <p className="text-sm">
                  We **never sell, trade, rent, or lease** your email address, password, personal profile details, or writing history to third-party marketing companies, advertisers, or data brokers.
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-2">
                  *Your personal information is accessed exclusively by LearnoBoy platform services to deliver features and platform communications, and is kept strictly confidential.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <Lock className="text-purple-500" size={24} />
              4. Data Security: You Are in Safe Hands
            </h2>
            <p className="mb-4">
              We employ robust administrative, technical, and physical safeguards designed to keep your personal data strictly protected and secure:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Cryptographic Hashing
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Your passwords are hashed cryptographically using industry-leading algorithms (bcryptjs). We never store raw passwords.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Secure Storage
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  All databases are hosted in fully secure MongoDB Atlas clusters, utilizing strict firewall rules and active database protection logs.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  SSL/TLS Encryption
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Data transferred between your browser and our platform server endpoints is fully encrypted using HTTPS secure protocols.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Session Integrity
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Sessions are authenticated using secure JSON Web Tokens (JWT) encrypted with high-entropy cryptographic keys.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              5. Your Rights & Choice
            </h2>
            <p>
              As a valued member of the LearnoBoy community, you have the right to request access to the personal data we hold about you, request corrections to your information, or delete your account. You also retain full rights to update your newsletter preference or opt out of promotional lists at any time.
            </p>
          </section>

        </div>

        {/* Footer Contact */}
        <div className="mt-16 pt-8 border-t border-[var(--border-color)] text-center text-sm text-[var(--text-tertiary)]">
          <p>If you have any questions or concerns regarding our privacy policies, please reach out to our privacy compliance officer at:</p>
          <a href="mailto:privacy@learnoboy.dev" className="mt-2 inline-block font-semibold text-[var(--link-color)] hover:text-[var(--link-hover)]">
            privacy@learnoboy.dev
          </a>
        </div>

      </div>
    </div>
  );
}
