import Link from "next/link";
import { BookOpen, Users, PenTool, RefreshCw, Sparkles, ShieldCheck, HelpCircle, Mail, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Policy | LearnoBoy",
  description: "Learn about LearnoBoy's editorial standards, review process, and commitment to high-quality technical content.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">
            Editorial Policy
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Our guidelines and standards for producing clear, accurate, and high-quality educational material.
          </p>
          <div className="mt-4 text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
            Last Updated: July 2026
          </div>
        </div>

        {/* Quick Summary Section */}
        <div 
          className="rounded-2xl border border-[var(--border-color)] p-6 sm:p-8 mb-12 shadow-sm relative overflow-hidden"
          style={{ background: "var(--bg-surface)" }}
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-blue-500" size={20} />
            Quick Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[var(--text-secondary)]">
            <div className="flex items-start gap-3">
              <span className="p-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mt-0.5">✔</span>
              <span><strong>Independent ownership</strong> under personal developer identity <strong>XTPDEV</strong>.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="p-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mt-0.5">✔</span>
              <span><strong>Strict review process</strong> for technical accuracy, formatting, and originality.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="p-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mt-0.5">✔</span>
              <span><strong>Human-reviewed AI content</strong>, with human judgment guiding all final articles.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="p-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mt-0.5">✔</span>
              <span><strong>Ad-supported platform</strong> via Google AdSense — ads never influence editorial decisions or content.</span>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-12 text-[var(--text-secondary)] leading-relaxed">
          
          {/* Section 1 */}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <BookOpen className="text-blue-500" size={24} />
              1. Our Editorial Commitment
            </h2>
            <p className="mb-4">
              At LearnoBoy, we are committed to publishing educational content that is accurate, clear, practical, and helpful for learners of all experience levels. This Editorial Policy explains how our content is created, reviewed, and maintained.
            </p>
            <p>
              Our goal is to build a trusted learning platform where readers can confidently explore programming, technology, and software development topics.
            </p>
          </section>

          {/* Section 2 */}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <Users className="text-purple-500" size={24} />
              2. Independent Ownership & Contributors
            </h2>
            <div className="space-y-4">
              <p>
                LearnoBoy is independently owned and operated under the developer brand <strong>XTPDEV</strong>. XTPDEV is a personal developer identity and <strong>is not a registered company or organization</strong>. All editorial decisions are made independently with the primary goal of serving our readers.
              </p>
              <p>
                LearnoBoy welcomes contributions from developers, educators, technical writers, and other knowledgeable individuals. Contributing to LearnoBoy does <strong>not</strong> guarantee publication. Every submission is evaluated against our editorial standards before it is published.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <PenTool className="text-emerald-500" size={24} />
              3. Editorial Review Process
            </h2>
            <p className="mb-4">
              Every article published on LearnoBoy is reviewed before publication, regardless of who wrote it. Our review process may include checking for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm mb-4">
              <li>Technical accuracy of concepts and code</li>
              <li>Clear explanations and logical build-up</li>
              <li>Originality and plagiarism prevention</li>
              <li>Grammar, formatting, and high readability standards</li>
              <li>Relevance to our student and developer audience</li>
              <li>Compliance with our platform guidelines</li>
            </ul>
            <p className="text-sm bg-[var(--bg-muted)] p-4 rounded-xl border border-[var(--border-color)]">
              We may edit submissions to improve clarity, formatting, grammar, consistency, or user experience while preserving the author's intended meaning. LearnoBoy reserves the right to accept, reject, revise, or remove content at its editorial discretion.
            </p>
          </section>

          {/* Section 4 */}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <RefreshCw className="text-teal-500" size={24} />
              4. Accuracy & Content Updates
            </h2>
            <p className="mb-4">
              We strive to ensure that every article is accurate at the time it is published. However, technology changes rapidly, and some information may become outdated over time. Despite our review process, occasional errors may occur.
            </p>
            <p className="mb-4">
              If you notice an error or outdated information, we encourage you to contact us so we can review and update the content where appropriate. To keep our content useful and relevant, articles may be updated periodically to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Correct factual or technical errors</li>
              <li>Reflect changes in technologies, frameworks, or tools</li>
              <li>Improve explanations, diagrams, and coding examples</li>
              <li>Enhance readability and general user experience</li>
            </ul>
            <p className="mt-4 text-xs text-[var(--text-tertiary)] italic">
              *Where applicable, updated articles will display a "Last Updated" date.
            </p>
          </section>

          {/* Section 5 */}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <Sparkles className="text-amber-500" size={24} />
              5. AI-Assisted Content Policy
            </h2>
            <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)]">
              <p className="text-sm leading-relaxed">
                Some content may be created or refined with the assistance of AI tools to improve drafting, organization, grammar, or readability. Regardless of whether AI tools are used during the writing process, every article is reviewed by LearnoBoy before publication. Human editorial judgment is responsible for the final published content.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="border-b border-[var(--border-color)] pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <ShieldCheck className="text-indigo-500" size={24} />
              6. Editorial Independence & Ads Policy
            </h2>
            <p className="mb-4">
              Our editorial decisions are based on educational value, accuracy, and usefulness—not on commercial interests. Current or future advertisers, sponsors, affiliates, or partners do <strong>not</strong> control our editorial decisions or influence the information presented in our content.
            </p>
            <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-sm space-y-3">
              <span className="font-bold text-amber-600 dark:text-amber-400 block">
                LearnoBoy is ad-supported via Google AdSense.
              </span>
              <p>
                To help fund ongoing platform operations and keep content free for all readers, LearnoBoy displays advertisements served by <strong>Google AdSense</strong>. These ads are algorithmically served by Google based on your browsing context and preferences — they are <strong>not</strong> handpicked or editorially influenced by LearnoBoy.
              </p>
              <p>
                Advertisements are clearly separated from editorial content at all times. No advertiser has any influence over what topics we cover, how articles are written, or the conclusions our writers reach. Our editorial integrity is fully independent of our advertising relationships.
              </p>
              <p>
                If we introduce sponsored content, affiliate links, or paid partnerships in the future, these will be <strong>clearly and prominently labeled</strong> to distinguish them from organic editorial content.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="pb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <HelpCircle className="text-rose-500" size={24} />
              7. External Links & Reader Feedback
            </h2>
            <p className="mb-4">
              Our articles may include links to official documentation, educational resources, or other third-party websites for additional information. LearnoBoy is not responsible for the content, accuracy, availability, or privacy practices of external websites.
            </p>
            <p>
              We value feedback from our readers. If you discover inaccurate information, broken links, outdated content, or have suggestions for improvement, we encourage you to contact us. Reader feedback plays an important role in helping us maintain high-quality educational content.
            </p>
          </section>

        </div>

        {/* Contact Section */}
        <div className="mt-16 pt-8 border-t border-[var(--border-color)] text-center text-sm text-[var(--text-tertiary)]">
          <p>For editorial questions, corrections, content suggestions, or contributor inquiries, please contact us at:</p>
          <a href="mailto:xtpdev@gmail.com" className="mt-2 inline-block font-semibold text-[var(--link-color)] hover:text-[var(--link-hover)]">
            xtpdev@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
}
