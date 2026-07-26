import Link from "next/link";
import { BookOpen, Shield, Mail, Award, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | LearnoBoy",
  description: "Terms and conditions for writers and readers on the LearnoBoy platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Please read these terms carefully before using LearnoBoy. They outline your rights as a reader, writer, and account holder.
          </p>
          <div className="mt-4 text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
            Last Updated: July 2026
          </div>
        </div>

        {}
        <div 
          className="rounded-2xl border border-[var(--border-color)] p-6 sm:p-8 mb-12 shadow-sm relative overflow-hidden"
          style={{ background: "var(--bg-surface)" }}
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-blue-500" size={20} />
            Quick Summary of Key Terms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[var(--text-secondary)]">
            <div className="flex items-start gap-3">
              <span className="p-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mt-0.5">✔</span>
              <span><strong>Writers retain ownership</strong> but grant LearnoBoy a commercial license to promote and distribute their articles.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="p-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mt-0.5">✔</span>
              <span>We may use your email to send you <strong>educational and promotional updates</strong>.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="p-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mt-0.5">✔</span>
              <span>We share data with <strong>Google AdSense &amp; Analytics</strong> to serve ads and measure performance. We never <em>sell</em> your personal data.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="p-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mt-0.5">✔</span>
              <span>All your data is protected with <strong>robust industry-grade security</strong>.</span>
            </div>
          </div>
        </div>

        {}
        <div className="space-y-12 text-[var(--text-secondary)] leading-relaxed">
          
          {}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-base">1</span>
              Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or using the LearnoBoy platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, with updates taking effect immediately upon posting.
            </p>
          </section>

          {}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-base">2</span>
              Writers & Content Licensing
            </h2>
            <p className="mb-4">
              At LearnoBoy, we deeply value and respect the hard work and intellectual property of our writers. As an author publishing on our platform, the following terms apply to your content:
            </p>
            <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] space-y-4 mb-4">
              <div className="flex gap-4">
                <Award className="text-emerald-500 shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">Ownership Rights</h3>
                  <p className="text-sm">
                    <strong>You retain full ownership</strong> of the copyright to any original articles, tutorials, or guides you write and publish on LearnoBoy.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <BookOpen className="text-emerald-500 shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">Commercial License Grant</h3>
                  <p className="text-sm">
                    By submitting and publishing articles on LearnoBoy, you grant LearnoBoy a worldwide, non-exclusive, royalty-free, perpetual, transferable, and sub-licensable license to use, host, store, reproduce, modify, translate, distribute, publish, and publicly display your content for **commercial and promotional purposes**.
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-2">
                    *This commercial license allows us to include your articles in educational packages, promotional newsletters, premium compilations, paid newsletters, platform advertising, and social media campaigns to reach a wider audience and support platform operations.
                  </p>
                </div>
              </div>
            </div>
            <p>
              You represent and warrant that you own or have the necessary licenses and permissions to publish the content you submit, and that it does not infringe on the rights of any third party.
            </p>
          </section>

          {}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-base">3</span>
              User Accounts, Communication & Analytics
            </h2>
            <p className="mb-4">
              To write articles or access certain features on LearnoBoy, you may need to register an account. During registration, you agree to provide accurate and complete information.
            </p>
            <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] flex gap-4 mb-4">
              <Mail className="text-indigo-500 shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">Email Usage & Promotional Messages</h3>
                <p className="text-sm">
                  By creating an account, you consent to receive communications from LearnoBoy. This includes critical account alerts, transaction receipts, and <strong>occasional newsletters, promotional offers, course recommendations, and educational updates</strong>.
                </p>
                <p className="text-sm mt-2">
                  You can opt out of promotional emails at any time by clicking the "unsubscribe" link included at the bottom of our emails.
                </p>
              </div>
            </div>
            <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] flex gap-4">
              <div className="shrink-0 mt-1 text-xl">📊</div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">Platform Analytics &amp; Advertising</h3>
                <p className="text-sm">
                  We use <strong>Google Analytics</strong> to measure traffic, usability, and visitor patterns. We also use <strong>Google AdSense</strong> to display advertisements, which may use cookies to serve personalized ads based on your browsing behavior. Consent to analytics and advertising cookies is managed via our Cookie Consent banner. Our full data practices are described in our <a href="/privacy" className="underline font-semibold">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </section>

          {}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-base">4</span>
              Our Commitment to Protecting Your Information
            </h2>
            <p className="mb-4">
              We value your privacy and are committed to protecting your personal information. Under these terms:
            </p>
            <ul className="list-disc pl-6 space-y-4 mb-4 text-sm">
              <li>
                <strong>No Sale of Personal Information:</strong> We do not sell, rent, or lease your personal information, including your email address, to third-party advertisers or marketers.
              </li>
              <li>
                <strong>Security Measures:</strong> We implement reasonable technical and organizational measures to help protect your personal information. Passwords are securely hashed, and our infrastructure uses industry-standard security practices, including secure database access controls where applicable.
              </li>
              <li>
                <strong>No Absolute Guarantee:</strong> While we take reasonable steps to safeguard your information, no method of electronic storage, transmission, or internet-based service is completely secure. As a result, we cannot guarantee absolute security against unauthorized access, data breaches, or other security incidents.
              </li>
              <li>
                <strong>Security Incidents:</strong> If we become aware of a security incident affecting your personal information, we will investigate the matter, take appropriate steps to mitigate the impact, and, where required by applicable law, notify affected users.
              </li>
            </ul>
            <p>
              For more details on how we collect, use, and protect your data, please review our full <Link href="/privacy" className="underline font-semibold text-[var(--link-color)] hover:text-[var(--link-hover)]">Privacy Policy</Link>.
            </p>
          </section>

          {}
          <section className="pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-base">5</span>
              Limitation of Liability
            </h2>
            <p>
              LearnoBoy and its materials are provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the accuracy, completeness, or reliability of any educational content published on the platform. In no event shall LearnoBoy be liable for any direct, indirect, incidental, or consequential damages resulting from your use of, or inability to use, our services.
            </p>
          </section>

        </div>

        {}
        <div className="mt-16 pt-8 border-t border-[var(--border-color)] text-center text-sm text-[var(--text-tertiary)]">
          <p>If you have any questions or clarifications regarding our Terms of Service, please contact us at:</p>
          <a href="mailto:xtpdev@gmail.com" className="mt-2 inline-block font-semibold text-[var(--link-color)] hover:text-[var(--link-hover)]">
            xtpdev@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
}
