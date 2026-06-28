import Link from "next/link";
import { Shield, EyeOff, Mail, Lock, CheckCircle2, BarChart2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | LearnoBoy",
  description: "Learn how we collect, protect, and safely handle your personal data on LearnoBoy.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Your privacy is our priority. This document outlines exactly how we manage, protect, and utilize your personal data at LearnoBoy.
          </p>
          <div className="mt-4 text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
            Last Updated: June 2026
          </div>
        </div>

        {}
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

        {}
        <div className="space-y-12 text-[var(--text-secondary)] leading-relaxed">
          
          {}
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
              <li>
                <strong>Usage and Tracking Data</strong>: If you consent to Analytics cookies, we collect details about your visits to and interaction with our website (e.g., page views, scroll depth, session duration, and device/browser details) via Google Analytics.
              </li>
            </ul>
          </section>

          {}
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

          {}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <EyeOff className="text-indigo-500" size={24} />
              3. Sharing of Personal Information
            </h2>
            <p className="mb-4">
              We do not sell your personal information to third parties. We value your privacy and restrict access to details about you according to the following principles:
            </p>
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  Independent Promotion Only
                </h3>
                <p className="text-sm">
                  We may use your information to promote LearnoBoy and our own products or services. However, we do not sell, rent, or provide your personal information to third-party advertisers or marketers for their independent marketing purposes.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  Trusted Service Providers
                </h3>
                <p className="text-sm">
                  We may share information with trusted service providers (such as hosting, analytics, email delivery, or payment providers) only as necessary to operate and improve our services, subject to appropriate contractual and security obligations.
                </p>
              </div>
            </div>
          </section>

          {}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <Lock className="text-purple-500" size={24} />
              4. Our Commitment to Protecting Your Information
            </h2>
            <p className="mb-6">
              We value your privacy and are committed to protecting your personal information.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                <h3 className="font-bold text-sm text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  No Sale of Personal Information
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  We do not sell, rent, or lease your personal information, including your email address, to third-party advertisers or marketers.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                <h3 className="font-bold text-sm text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Security Measures
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  We implement reasonable technical and organizational measures to help protect your personal information. Passwords are securely hashed using cryptographic algorithms, and our infrastructure uses industry-standard security practices, including secure database access controls where applicable (such as SSL/TLS encryption and secure MongoDB clusters).
                </p>
              </div>

              <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                <h3 className="font-bold text-sm text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  No Absolute Guarantee
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  While we take reasonable steps to safeguard your information, no method of electronic storage, transmission, or internet-based service is completely secure. As a result, we cannot guarantee absolute security against unauthorized access, data breaches, or other security incidents.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                <h3 className="font-bold text-sm text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Security Incidents
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  If we become aware of a security incident affecting your personal information, we will investigate the matter, take appropriate steps to mitigate the impact, and, where required by applicable law, notify affected users.
                </p>
              </div>
            </div>
          </section>

          {}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <BarChart2 className="text-teal-500" size={24} />
              5. Third-Party Analytics Tools (Google Analytics)
            </h2>
            <p className="mb-4">
              We use <strong>Google Analytics</strong>, a web analytics service provided by Google LLC ("Google"), to analyze platform usage and traffic. Google Analytics uses cookies to gather standard internet log information and visitor behavior details in an anonymous format.
            </p>
            <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] space-y-3">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Key Analytics Terms & Opt-Out:
              </p>
              <p className="text-sm">
                - The information generated by the cookies about your use of the website is transmitted to Google. This data helps us evaluate website activity, compile reports, and improve the overall LearnoBoy user experience.
              </p>
              <p className="text-sm">
                - <strong>Consent & Choice</strong>: You can choose to allow or decline Google Analytics tracking at any time by toggling the "Analytics" option in our Cookie Consent preferences banner. You can also install the official Google Analytics Opt-out Browser Add-on to prevent your data from being used by Google Analytics.
              </p>
            </div>
          </section>

          {}
          <section className="pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              6. Your Rights & Choice
            </h2>
            <p>
              As a valued member of the LearnoBoy community, you have the right to request access to the personal data we hold about you, request corrections to your information, or delete your account. You also retain full rights to update your newsletter preference or opt out of promotional lists at any time.
            </p>
          </section>

        </div>

        {}
        <div className="mt-16 pt-8 border-t border-[var(--border-color)] text-center text-sm text-[var(--text-tertiary)]">
          <p>If you have any questions or concerns regarding our privacy policies, please reach out to our privacy compliance officer at:</p>
          <a href="mailto:xtpdev@gmail.com" className="mt-2 inline-block font-semibold text-[var(--link-color)] hover:text-[var(--link-hover)]">
            xtpdev@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
}
