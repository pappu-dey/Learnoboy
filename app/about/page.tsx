import Link from "next/link";
import { BookOpen, Heart, Sparkles, Code2, Users, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About LearnoBoy",
  description: "Learn more about the mission, values, and vision behind LearnoBoy, an independent educational platform.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-[fadeIn_0.5s_ease-out]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[var(--link-color)] bg-[rgba(37,99,235,0.08)] mb-4 border border-[rgba(37,99,235,0.15)]">
            <Sparkles size={12} className="animate-pulse" />
            Welcome to LearnoBoy
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] mb-6 tracking-tight leading-tight">
            Making Tech Education Simple & Accessible
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            LearnoBoy is an independent educational platform created to make programming and technology easier to learn. Our goal is to provide clear, practical, and beginner-friendly content that helps students, developers, and curious learners build real-world skills.
          </p>
          <p className="mt-4 text-sm text-[var(--text-tertiary)] italic">
            Every article is written with a focus on simplicity, accuracy, and practical understanding, making technical concepts accessible to everyone.
          </p>
        </div>

        {/* Mission & Vision cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-2xl border border-[var(--border-color)] p-8 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-[var(--link-color)]/30 bg-[var(--bg-surface)] relative overflow-hidden">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                <BookOpen size={24} />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Our Mission</h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Our mission is to make quality programming education freely accessible to learners around the world. We believe that anyone should be able to learn modern technology without unnecessary barriers.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-color)] p-8 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-[var(--link-color)]/30 bg-[var(--bg-surface)] relative overflow-hidden">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
                <Code2 size={24} />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Our Vision</h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Our vision is to build LearnoBoy into a trusted learning platform where people can discover high-quality educational content, useful developer tools, and practical resources that support continuous learning and professional growth.
              </p>
            </div>
          </div>
        </div>

        {/* Creator Identity */}
        <div className="rounded-2xl border border-[var(--border-color)] p-8 mb-16 shadow-sm bg-[var(--bg-surface)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
              <Users size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                Who Runs LearnoBoy?
              </h2>
              <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold mb-4">
                Solo Developer Identity
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                LearnoBoy is independently created and maintained by a solo developer under the developer brand <strong>XTPDEV</strong>.
              </p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-muted)] p-4 rounded-xl border border-[var(--border-color)]">
                XTPDEV is a personal developer identity and <strong>is not a registered company or organization</strong>. The website is designed, developed, managed, and maintained by a single individual who is passionate about building educational resources and useful developer tools.
              </p>
            </div>
          </div>
        </div>

        {/* Commitment Cards */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6 text-center">Our Commitment</h2>
          <p className="text-center text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Every piece of content is engineered to help you learn and grow in your career. Here is our promise to you:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { title: "Accurate", desc: "Accurate and well-researched content.", emoji: "🔬" },
              { title: "Understandable", desc: "Easy to follow and digest.", emoji: "💡" },
              { title: "Practical", desc: "Beginner-friendly and actionable.", emoji: "🛠" },
              { title: "Up-to-date", desc: "Regularly reviewed and improved.", emoji: "🔄" },
              { title: "Learning-first", desc: "Focused on effective knowledge transfer.", emoji: "🎓" }
            ].map((item, index) => (
              <div key={index} className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-center flex flex-col items-center hover:border-[var(--link-color)]/30 transition-all duration-300">
                <span className="text-2xl mb-3 block">{item.emoji}</span>
                <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1">{item.title}</h3>
                <p className="text-xs text-[var(--text-tertiary)] leading-normal">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-sm text-[var(--text-secondary)] flex gap-4 items-start">
            <div className="text-amber-500 shrink-0 mt-0.5">⚠️</div>
            <p className="leading-relaxed">
              While we make every effort to ensure accuracy, technology changes rapidly, and some information may become outdated over time. We encourage readers to verify important technical information when necessary.
            </p>
          </div>
        </div>

        {/* Advertising & Monetization */}
        <div className="rounded-2xl border border-[var(--border-color)] p-8 mb-16 shadow-sm bg-[var(--bg-surface)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <Heart size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                Advertising & Monetization
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 mb-4 border border-emerald-200 dark:border-emerald-900/30">
                LearnoBoy is currently ad-free
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                At the time of writing, we do not display advertisements on the website, allowing visitors to enjoy a clean and distraction-free learning experience.
              </p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-muted)] p-4 rounded-xl border border-[var(--border-color)]">
                As LearnoBoy grows, we may introduce advertising, affiliate partnerships, sponsorships, premium features, or other monetization methods to help support the ongoing development and maintenance of the platform. If this happens, our Privacy Policy, Cookie Policy, and other relevant policies will be updated accordingly. Any future advertising will be implemented responsibly with the aim of maintaining a positive user experience.
              </p>
            </div>
          </div>
        </div>

        {/* Get in Touch */}
        <div className="text-center mt-16 pt-8 border-t border-[var(--border-color)]">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Get in Touch</h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
            Questions, suggestions, or feedback are always welcome. We appreciate every visitor and every piece of feedback that helps us improve LearnoBoy.
          </p>
          <a
            href="mailto:xtpdev@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow-sm"
            style={{ background: "var(--link-color)" }}
          >
            <Mail size={16} />
            xtpdev@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
}
