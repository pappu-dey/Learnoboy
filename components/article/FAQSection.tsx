"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs?: FAQItem[];
}

export function FAQSection({ faqs = [] }: FAQSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (faqs.length === 0) return null;

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="mt-8 pt-8 border-t border-[var(--border-color)]" aria-label="Frequently Asked Questions">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle size={18} style={{ color: "var(--link-color)" }} />
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          Frequently Asked Questions (FAQ)
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = activeIndex === index;
          const buttonId = `faq-btn-${index}`;
          const panelId = `faq-panel-${index}`;

          return (
            <div
              key={index}
              className="rounded-xl border border-[var(--border-color)] overflow-hidden transition-all duration-200 bg-[var(--bg-surface)]"
            >
              <button
                id={buttonId}
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between text-left p-4 cursor-pointer focus:outline-none"
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="text-sm md:text-base font-bold text-[var(--text-primary)] pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  size={16}
                  className="text-[var(--text-secondary)] transition-transform duration-300 flex-shrink-0"
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[500px] border-t border-[var(--border-color)] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <div className="p-4 text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
