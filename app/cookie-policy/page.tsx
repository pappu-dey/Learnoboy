import Link from "next/link";
import { Info, Lock, Settings, Eye, HelpCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | LearnoBoy",
  description: "Learn how we use essential session and preference cookies on the LearnoBoy technical developer platform.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Transparent explanations on how and why we use cookies to provide a premium, secure learning experience at LearnoBoy.
          </p>
          <div className="mt-4 text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
            Last Updated: July 2026
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div 
            className="rounded-2xl border border-[var(--border-color)] p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
              <Lock size={24} />
            </div>
            <h3 className="font-bold text-[var(--text-primary)] mb-2">Authentication</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              We store session tokens strictly to keep you authenticated and securely logged into your profile.
            </p>
          </div>

          <div 
            className="rounded-2xl border border-[var(--border-color)] p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
              <Settings size={24} />
            </div>
            <h3 className="font-bold text-[var(--text-primary)] mb-2">Preferences</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Used to remember your preferences, such as keeping your chosen dark or light mode theme active.
            </p>
          </div>

          <div 
            className="rounded-2xl border border-[var(--border-color)] p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <Eye size={24} />
            </div>
            <h3 className="font-bold text-[var(--text-primary)] mb-2">Analytics &amp; Advertising</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Analytics and advertising cookies (Google Analytics &amp; AdSense) are optional. We only activate them with your explicit consent.
            </p>
          </div>

        </div>

        {}
        <div className="space-y-12 text-[var(--text-secondary)] leading-relaxed">
          
          {}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <Info className="text-blue-500" size={24} />
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are small text files placed on your computer or mobile device by websites that you visit. They are widely used to make websites work, or work more efficiently, as well as to store user choices, settings, and credentials.
            </p>
          </section>

          {}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <Lock className="text-purple-500" size={24} />
              2. Cookies We Use
            </h2>
            <p className="mb-4">
              We use necessary and optional cookies that fall into the following categories:
            </p>
            <ul className="list-disc pl-6 space-y-4 text-sm mb-4">
              <li>
                <strong>Strictly Necessary Session Cookies</strong>: These are essential to let you navigate the site, log in, write articles, submit donor updates, and access secure member sections. We store a session identifier in these cookies, which is cleared when you log out.
              </li>
              <li>
                <strong>Preference Cookies</strong>: These cookies allow the platform to remember settings you chose, specifically your color theme preference (Light, Dark, or System) so that the correct theme displays instantly on page load.
              </li>
              <li>
                <strong>Analytics Cookies (Google Analytics)</strong>: If explicitly accepted by you, we use Google Analytics cookies (such as <code>_ga</code> and <code>_ga_*</code>) to compile aggregated, anonymous metrics. These help us understand how users find the platform, which pages they visit, and how long they stay, allowing us to optimize site performance and features.
              </li>
              <li>
                <strong>Advertising Cookies (Google AdSense)</strong>: If you consent to advertising cookies, Google AdSense may set cookies (such as <code>__gads</code>, <code>__gpi</code>) to serve you personalized or contextual advertisements based on your browsing interests. AdSense data is processed by Google LLC under their own <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline font-medium">Privacy Policy</a>. You can opt out of personalized ads at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="underline font-medium">Google Ad Settings</a>.
              </li>
            </ul>
          </section>

          {}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <Settings className="text-indigo-500" size={24} />
              3. Managing Your Choices
            </h2>
            <p className="mb-4">
              You have the right to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer.
            </p>
            <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] text-sm">
              <strong>Please Note:</strong> If you choose to decline or block essential cookies, you will not be able to log in, write articles, or access your creator profile on LearnoBoy, as authentication relies completely on secure session cookies.
            </div>
          </section>

          {}
          <section className="pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <HelpCircle className="text-emerald-500" size={24} />
              4. Changes to This Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time to reflect modifications in our platform operations or legal requirements. We encourage you to check this page periodically to remain informed about our cookie usage protocols.
            </p>
          </section>

        </div>

        {}
        <div className="mt-16 pt-8 border-t border-[var(--border-color)] text-center text-sm text-[var(--text-tertiary)]">
          <p>For more details on how we protect your personal data, read our <Link href="/privacy" className="font-semibold text-[var(--link-color)] hover:underline">Privacy Policy</Link>, or contact us at:</p>
          <a href="mailto:xtpdev@gmail.com" className="mt-2 inline-block font-semibold text-[var(--link-color)] hover:underline">
            xtpdev@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
}
