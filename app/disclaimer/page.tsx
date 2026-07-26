import Link from "next/link";
import { AlertTriangle, ShieldAlert, ExternalLink, HelpCircle, Scale, BarChart2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | LearnoBoy",
  description: "Read the general legal disclaimer and terms of content utilization on LearnoBoy.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">
            Disclaimer
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Important legal information regarding the educational nature, accuracy, and use of content on LearnoBoy.
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
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-bold text-[var(--text-primary)] mb-2">Educational Use</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              All guides, coding articles, and snippets are meant strictly for educational and reference purposes.
            </p>
          </div>

          <div 
            className="rounded-2xl border border-[var(--border-color)] p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
              <ShieldAlert size={24} />
            </div>
            <h3 className="font-bold text-[var(--text-primary)] mb-2">No Warranty</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Code and content is provided "as is" without warranty of correctness or applicability for production.
            </p>
          </div>

          <div 
            className="rounded-2xl border border-[var(--border-color)] p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
              <ExternalLink size={24} />
            </div>
            <h3 className="font-bold text-[var(--text-primary)] mb-2">External Links</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              We disclaim responsibility for the contents or security practices of external referenced websites.
            </p>
          </div>

        </div>

        {}
        <div className="space-y-12 text-[var(--text-secondary)] leading-relaxed">
          
          {}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <Scale className="text-amber-500" size={24} />
              1. General Information Only
            </h2>
            <p>
              The information provided on LearnoBoy is for general informational and educational purposes only. While we endeavor to keep the content accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, tutorials, products, or related graphics contained on the website.
            </p>
          </section>

          {}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <ShieldAlert className="text-red-500" size={24} />
              2. Code & Programming Snippets Liability
            </h2>
            <p className="mb-4">
              LearnoBoy features coding tutorials and code examples across multiple programming languages (C, C++, Java, Python, JavaScript, SQL, etc.). Any reliance you place on such code is strictly at your own risk.
            </p>
            <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] text-sm leading-relaxed space-y-2">
              <p>
                - You are solely responsible for verifying, testing, and reviewing any code snippets obtained from our platform in a isolated sandbox environment before deploying them to production environments.
              </p>
              <p>
                - Under no circumstances shall LearnoBoy or its creators be held liable for any loss or damage (including, without limitation, indirect or consequential loss or damage, data loss, server downtime, or software corruption) arising out of or in connection with the use of code snippets found on this platform.
              </p>
            </div>
          </section>

          {}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <ExternalLink className="text-blue-500" size={24} />
              3. External Links Disclaimer
            </h2>
            <p>
              Through this website, you are able to link to other websites that are not under the control of LearnoBoy. We have no control over the nature, content, security protocols, and availability of those external sites. The inclusion of any hyperlinks does not necessarily imply a recommendation or endorse the views expressed within them.
            </p>
          </section>

          {}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <HelpCircle className="text-emerald-500" size={24} />
              4. Changes to Content
            </h2>
            <p>
              Platform content, article categories, subcategory arrangements, and guides may be modified, updated, or removed at any time without prior notice. We make no commitments to continuously support or keep any specific article or code example online.
            </p>
          </section>

          {}
          <section className="pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <BarChart2 className="text-blue-500" size={24} />
              5. Third-Party Analytics &amp; Advertising Disclaimer
            </h2>
            <p className="mb-4">
              We utilize third-party services from Google LLC to support platform operations:
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] text-sm">
                <strong className="block mb-1">Google Analytics</strong>
                We use Google Analytics to collect anonymous, aggregated metrics about our visitors&apos; usage patterns. This service operates under Google&apos;s independent privacy policy and terms. While we implement this service securely, we offer no warranties regarding the accuracy of tracking data or Google&apos;s internal data processing compliance.
              </div>
              <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] text-sm">
                <strong className="block mb-1">Google AdSense</strong>
                We use Google AdSense to display advertisements on our platform. AdSense may use cookies and collect data about your browsing behavior to serve personalized or contextual ads. This service is governed entirely by <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline font-medium">Google&apos;s Privacy Policy</a>. LearnoBoy does not control how Google collects, processes, or uses advertising data. We disclaim all responsibility for Google&apos;s independent data practices.
              </div>
            </div>
          </section>

        </div>

        {}
        <div className="mt-16 pt-8 border-t border-[var(--border-color)] text-center text-sm text-[var(--text-tertiary)]">
          <p>If you have any questions about this disclaimer, please reach out to us at:</p>
          <a href="mailto:xtpdev@gmail.com" className="mt-2 inline-block font-semibold text-[var(--link-color)] hover:underline">
            xtpdev@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
}
