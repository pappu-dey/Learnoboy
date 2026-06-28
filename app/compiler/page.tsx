import type { Metadata } from "next";
import Link from "next/link";
import { Code2, Terminal, ArrowRight, Settings, Braces, Sparkles, HelpCircle, Share2, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Online Coding Compilers & Playgrounds",
  description: "Run, compile, and share your code online. Access real-time editors for HTML, CSS, JS, and explore upcoming playgrounds.",
};

const COMPILERS = [
  {
    name: "HTML, CSS, JS Playground",
    slug: "html",
    description: "Build frontend web pages with live real-time rendering, dynamic preview sandboxing, and console log output capture.",
    active: true,
    color: "from-cyan-500 to-blue-600",
    shadowColor: "rgba(6, 182, 212, 0.15)",
    icon: <Code2 className="w-8 h-8 text-cyan-400" />,
  },
  {
    name: "Python Compiler",
    slug: "python",
    description: "Write and execute Python script engines online. Standard libraries, system outputs, and error handling logs.",
    active: false,
    color: "from-yellow-500 to-green-600",
    shadowColor: "rgba(234, 179, 8, 0.1)",
    icon: <Terminal className="w-8 h-8 text-yellow-400" />,
  },
  {
    name: "Java Compiler",
    slug: "java",
    description: "Compile and run Java class hierarchies online. Access standard stream outputs and standard libraries.",
    active: false,
    color: "from-red-500 to-orange-600",
    shadowColor: "rgba(239, 68, 68, 0.1)",
    icon: <Settings className="w-8 h-8 text-red-400" />,
  },
  {
    name: "C & C++ Compiler",
    slug: "cpp",
    description: "High-performance low-level memory compiled logic. Standard STL support, clean memory diagnostics.",
    active: false,
    color: "from-blue-500 to-indigo-600",
    shadowColor: "rgba(59, 130, 246, 0.1)",
    icon: <Braces className="w-8 h-8 text-blue-400" />,
  },
];

export default function CompilersPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300">
      {}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(37, 99, 235, 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative">
        {}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--link-color)] mb-4 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Interactive Developer Sandboxes
          </div>
          <h1 
            id="compiler-hub-title" 
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
          >
            Online{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Coding Compilers
            </span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg sm:text-xl leading-relaxed">
            Write, execute, test, and share code directly from your browser. Ideal for testing snippets, quick mockups, and learning new concepts.
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {COMPILERS.map((compiler) => {
            const Content = (
              <div
                className={`relative flex flex-col justify-between h-full p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] transition-all duration-300 ${
                  compiler.active
                    ? "hover:border-[var(--link-color)] hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                    : "opacity-85 cursor-not-allowed"
                }`}
                style={{
                  boxShadow: compiler.active ? `0 10px 30px -10px ${compiler.shadowColor}` : "none",
                }}
              >
                {}
                {compiler.active && (
                  <div
                    aria-hidden="true"
                    className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(6, 182, 212, 0.15))`,
                      zIndex: -1,
                    }}
                  />
                )}

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)]">
                      {compiler.icon}
                    </div>
                    {compiler.active ? (
                      <span className="px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 rounded-full">
                        Live Sandbox
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-xs font-semibold text-[var(--text-tertiary)] bg-[var(--bg-muted)] rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                    {compiler.name}
                  </h2>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
                    {compiler.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-bold mt-4 transition-colors">
                  {compiler.active ? (
                    <>
                      <span className="text-[var(--link-color)] hover:text-[var(--link-hover)] flex items-center gap-1.5">
                        Open Playground <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </>
                  ) : (
                    <span className="text-[var(--text-tertiary)]">Under Development</span>
                  )}
                </div>
              </div>
            );

            return compiler.active ? (
              <Link 
                key={compiler.slug} 
                href={`/compiler/${compiler.slug}`}
                className="group select-none"
                id={`compiler-card-${compiler.slug}`}
              >
                {Content}
              </Link>
            ) : (
              <div 
                key={compiler.slug}
                className="select-none"
                id={`compiler-card-${compiler.slug}`}
              >
                {Content}
              </div>
            );
          })}
        </div>

        {}
        <section className="mt-24 border-t border-[var(--border-color)] pt-16" id="compiler-features-section">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--link-color)] mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Advanced Playground Capabilities
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[var(--text-primary)]">
              Powerful Sandbox Features
            </h2>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base">
              Explore the advanced utilities built directly into our playgrounds to streamline your coding workflow.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]" id="feature-instant-compile">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 w-fit mb-4">
                <Zap className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Instant Execution</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                See rendering changes in real-time as you type, or run code manually with the hot-reload execution engine.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]" id="feature-console-log">
              <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 w-fit mb-4">
                <Terminal className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Console Interception</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Debug scripts easily with an integrated output console that captures logs, warnings, errors, and info streams.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]" id="feature-snippet-share">
              <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 w-fit mb-4">
                <Share2 className="w-5 h-5 text-cyan-500" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Shareable Playgrounds</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Encode and compress codebases into lightweight URL shares, allowing you to instantly share code with colleagues.
              </p>
            </div>
          </div>
        </section>

        {}
        <section className="mt-20 border-t border-[var(--border-color)] pt-16 mb-8" id="compiler-faq-section">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center justify-center gap-2 text-[var(--text-primary)]">
              <HelpCircle className="w-6 h-6 text-indigo-500" />
              Frequently Asked Questions
            </h2>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base">
              Got questions about LearnoBoy compilers? We have got answers.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="group border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-xl p-4 transition-all duration-200" id="faq-languages">
              <summary className="flex items-center justify-between font-bold text-base cursor-pointer list-none select-none text-[var(--text-primary)]">
                <span>What languages are supported on LearnoBoy Compilers?</span>
                <span className="transition-transform group-open:rotate-180">
                  <ArrowRight className="w-4 h-4 rotate-90 text-[var(--text-tertiary)]" />
                </span>
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] border-t border-[var(--border-color)] pt-3">
                Currently, we fully support HTML, CSS, and JavaScript through our real-time interactive sandbox. We are actively developing compilation engines for Python, Java, and C/C++ which will be released soon.
              </div>
            </details>

            <details className="group border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-xl p-4 transition-all duration-200" id="faq-pricing">
              <summary className="flex items-center justify-between font-bold text-base cursor-pointer list-none select-none text-[var(--text-primary)]">
                <span>Do I need to sign up or pay to use the playground?</span>
                <span className="transition-transform group-open:rotate-180">
                  <ArrowRight className="w-4 h-4 rotate-90 text-[var(--text-tertiary)]" />
                </span>
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] border-t border-[var(--border-color)] pt-3">
                No, all LearnoBoy compilers and code playgrounds are 100% free, open, and require no account setup or sign up. You can start writing code immediately.
              </div>
            </details>

            <details className="group border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-xl p-4 transition-all duration-200" id="faq-rendering">
              <summary className="flex items-center justify-between font-bold text-base cursor-pointer list-none select-none text-[var(--text-primary)]">
                <span>How does the Live Output rendering work?</span>
                <span className="transition-transform group-open:rotate-180">
                  <ArrowRight className="w-4 h-4 rotate-90 text-[var(--text-tertiary)]" />
                </span>
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] border-t border-[var(--border-color)] pt-3">
                The sandbox editor captures your HTML, CSS, and JS input and compiles it into an isolated, secure iframe. Any console log calls inside your code are intercepted and streamed straight to the built-in developer console panel below the preview.
              </div>
            </details>

            <details className="group border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-xl p-4 transition-all duration-200" id="faq-sharing">
              <summary className="flex items-center justify-between font-bold text-base cursor-pointer list-none select-none text-[var(--text-primary)]">
                <span>Can I share my code snippets with others?</span>
                <span className="transition-transform group-open:rotate-180">
                  <ArrowRight className="w-4 h-4 rotate-90 text-[var(--text-tertiary)]" />
                </span>
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] border-t border-[var(--border-color)] pt-3">
                Yes! Clicking the "Share" button encodes your active code states into a shareable URL query. Anyone opening the link will see your code pre-populated in their sandbox editor.
              </div>
            </details>

            <details className="group border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-xl p-4 transition-all duration-200" id="faq-environment">
              <summary className="flex items-center justify-between font-bold text-base cursor-pointer list-none select-none text-[var(--text-primary)]">
                <span>Is the code compiled on the server or client?</span>
                <span className="transition-transform group-open:rotate-180">
                  <ArrowRight className="w-4 h-4 rotate-90 text-[var(--text-tertiary)]" />
                </span>
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] border-t border-[var(--border-color)] pt-3">
                The frontend HTML, CSS, and JS editor compiles fully on the client-side inside your browser for instant rendering and high performance, without sending data to any servers.
              </div>
            </details>
          </div>
        </section>
      </div>
    </div>
  );
}
