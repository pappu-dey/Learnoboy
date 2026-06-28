"use client";

import { useState, useTransition } from "react";
import { Mail, Phone, MessageSquare, Send, CheckCircle2, AlertCircle, Heart } from "lucide-react";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [type, setType] = useState("General Feedback");
  const [message, setMessage] = useState("");
  
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !email.trim()) return;

    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            message: message.trim(),
            email: email.trim(),
          }),
        });
        const json = await res.json();
        
        if (!res.ok) {
          setError(json.error ?? "Failed to send message. Please try again.");
        } else {
          setSuccess(true);
          setEmail("");
          setMessage("");
        }
      } catch {
        setError("Network error. Please check your connection.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] py-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">
            Contact Us
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Have questions, feedback, or suggestion? Get in touch with us using the form below or reach out directly.
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {}
          <div className="lg:col-span-5 space-y-6">
            
            {}
            <div 
              className="rounded-2xl border border-[var(--border-color)] p-6 flex items-start gap-4 transition-all hover:shadow-md"
              style={{ background: "var(--bg-surface)" }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(37,99,235,0.08)", color: "var(--link-color)" }}
              >
                <Mail size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-[var(--text-primary)]">Email Address</h3>
                <p className="text-xs text-[var(--text-tertiary)]">For official queries and updates</p>
                <a 
                  href="mailto:xtpdev@gmail.com" 
                  className="block text-sm font-semibold text-[var(--link-color)] hover:underline mt-2"
                >
                  xtpdev@gmail.com
                </a>
              </div>
            </div>

            {}
            <div 
              className="rounded-2xl border border-[var(--border-color)] p-6 flex items-start gap-4 transition-all hover:shadow-md"
              style={{ background: "var(--bg-surface)" }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(16,185,129,0.08)", color: "#10b981" }}
              >
                <Phone size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-[var(--text-primary)]">WhatsApp / Call</h3>
                <p className="text-xs text-[var(--text-tertiary)]">Direct developer support lines</p>
                <a 
                  href="https://wa.me/918695882645" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-sm font-semibold text-[#10b981] hover:underline mt-2"
                >
                  +91 86958 82645
                </a>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-[#10b981] font-semibold px-2 py-0.5 rounded-full inline-block mt-1">
                  wp/call supported
                </span>
              </div>
            </div>

            {}
            <div 
              className="rounded-2xl border border-[var(--border-color)] p-6 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.03), rgba(139,92,246,0.02))" }}
            >
              <h3 className="font-bold text-sm text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
                Under the Hood
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                LearnoBoy is kept alive entirely by community support and voluntary donation updates. We guarantee a response to all valid queries within 24-48 business hours.
              </p>
            </div>

          </div>

          {}
          <div 
            className="lg:col-span-7 rounded-2xl border border-[var(--border-color)] p-8 shadow-sm"
            style={{ background: "var(--bg-surface)" }}
          >
            {success ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Message Sent!</h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                  Thank you for reaching out. We have safely received your submission and will get back to you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer mt-4"
                  style={{ background: "var(--link-color)" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={18} style={{ color: "var(--link-color)" }} />
                  <h2 className="font-bold text-lg text-[var(--text-primary)]">Write to Us</h2>
                </div>

                {}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                    Your Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--link-color)]/30 focus:border-[var(--link-color)] transition-all text-sm"
                  />
                </div>

                {}
                <div>
                  <label htmlFor="type" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                    Subject / Topic <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--link-color)]/30 focus:border-[var(--link-color)] transition-all text-sm"
                  >
                    <option value="General Feedback">General Feedback / Inquiry</option>
                    <option value="Bug Report">Report a Platform Bug</option>
                    <option value="Content Suggestion">Suggest Content or Tutorials</option>
                    <option value="Feature Request">Request a New Feature</option>
                  </select>
                </div>

                {}
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry or support request here…"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--link-color)]/30 focus:border-[var(--link-color)] transition-all text-sm resize-none"
                  />
                </div>

                {}
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 text-xs text-red-600 dark:text-red-400 font-semibold animate-shake">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {}
                <button
                  type="submit"
                  disabled={isPending || !message.trim() || !email.trim()}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
                  style={{ background: "var(--link-color)" }}
                >
                  {isPending ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending Message…
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
