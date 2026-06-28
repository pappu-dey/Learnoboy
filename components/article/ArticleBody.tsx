"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github.css";

interface ArticleBodyProps {
  content: string;
}


function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy code"
      style={{
        position: "absolute",
        top: "0.75rem",
        right: "0.75rem",
        padding: "0.25rem 0.6rem",
        borderRadius: "6px",
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.03em",
        cursor: "pointer",
        transition: "all 0.15s ease",
        background: copied
          ? "color-mix(in srgb, var(--link-color) 15%, transparent)"
          : "var(--bg-base)",
        color: copied ? "var(--link-color)" : "var(--text-secondary)",
        border: "1px solid var(--border-color)",
        zIndex: 10,
      }}
    >
      <span role="status" aria-live="polite">
        {copied ? "✓ Copied" : "Copy"}
      </span>
    </button>
  );
}


function CodeBlock({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(getTextContent).join("");
    if (
      node &&
      typeof node === "object" &&
      "props" in node
    ) {
      const element = node as React.ReactElement<{ children?: React.ReactNode }>;
      return getTextContent(element.props.children);
    }
    return "";
  };

  const rawText = getTextContent(children);

  return (
    <div style={{ position: "relative", margin: "1.75rem 0" }}>
      <pre
        {...props}
        style={{
          background: "var(--code-bg)",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
          padding: "1.25rem 3.5rem 1.25rem 1.25rem",
          overflowX: "auto",
          margin: 0,
          fontSize: "0.875rem",
          lineHeight: 1.7,
        }}
      >
        {children}
      </pre>
      <CopyButton text={rawText} />
    </div>
  );
}

export function ArticleBody({ content }: ArticleBodyProps) {
  return (
    <div
      className="article-content"
      style={{
        
        maxWidth: "72ch",
        
        fontSize: "1rem",
        lineHeight: 1.75,
        color: "var(--text-primary)",
      }}
    >
      <style>{`
        /* Paragraph spacing */
        .article-content p {
          margin: 0 0 0.9rem 0;
        }
        /* List spacing */
        .article-content ul,
        .article-content ol {
          margin: 0.25rem 0 0.9rem 0;
          padding-left: 1.5rem;
        }
        .article-content li {
          margin-bottom: 0.35rem;
          line-height: 1.7;
          color: var(--text-secondary);
        }
        /* Custom bullets */
        .article-content ul > li {
          list-style: none;
          position: relative;
          padding-left: 1.1rem;
        }
        .article-content ul > li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.65em;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--link-color);
          opacity: 0.7;
        }
        /* Ordered list */
        .article-content ol > li {
          list-style: decimal;
          color: var(--text-secondary);
        }
        .article-content ol > li::marker {
          color: var(--link-color);
          font-weight: 600;
        }
        /* Nested lists */
        .article-content li ul,
        .article-content li ol {
          margin-top: 0.4rem;
          margin-bottom: 0;
        }
        /* Heading spacing and styles */
        .article-content h1 {
          font-size: 1.875rem;
          font-weight: 800;
          line-height: 1.25;
          margin: 2.5rem 0 1rem 0;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }
        .article-content h2 {
          font-size: 1.4rem;
          font-weight: 700;
          line-height: 1.3;
          margin: 2.5rem 0 0.85rem 0;
          color: var(--text-primary);
          letter-spacing: -0.015em;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        .article-content h3 {
          font-size: 1.15rem;
          font-weight: 700;
          line-height: 1.4;
          margin: 2rem 0 0.6rem 0;
          color: var(--text-primary);
        }
        .article-content h4 {
          font-size: 1rem;
          font-weight: 700;
          margin: 1.5rem 0 0.5rem 0;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-size: 0.8rem;
        }
        /* First heading no top margin */
        .article-content > :first-child {
          margin-top: 0;
        }
        /* HR */
        .article-content hr {
          border: none;
          border-top: 1px solid var(--border-color);
          margin: 2rem 0;
        }
        /* Strong & em */
        .article-content strong {
          font-weight: 700;
          color: var(--text-primary);
        }
        .article-content em {
          font-style: italic;
          color: var(--text-secondary);
        }
        /* highlight.js theme fix for light/dark */
        .article-content .hljs {
          background: transparent !important;
        }
      `}</style>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          p: (props) => {
            const { children, node, ...rest } = props as any;
            const hasImage = node?.children?.some(
              (child: any) => child.type === "element" && child.tagName === "img"
            );
            if (hasImage) {
              return (
                <div {...rest} suppressHydrationWarning style={{ display: "block", margin: "0 0 0.9rem 0" }}>
                  {children}
                </div>
              );
            }
            return (
              <p {...rest} suppressHydrationWarning style={{ display: "block", margin: "0 0 0.9rem 0" }}>
                {children}
              </p>
            );
          },

          
          pre: ({ children, ...props }) => (
            <CodeBlock {...props}>{children}</CodeBlock>
          ),

          
          code: (props) => {
            const { children, className, ...rest } = props;
            const isBlock = className?.includes("language-");
            if (!isBlock) {
              return (
                <code
                  {...(rest as React.HTMLAttributes<HTMLElement>)}
                  className={className}
                  style={{
                    background: "color-mix(in srgb, var(--link-color) 6%, var(--bg-muted))",
                    color: "var(--link-color)",
                    border: "1px solid var(--border-color)",
                    padding: "0.15em 0.45em",
                    borderRadius: "5px",
                    fontSize: "0.855em",
                    fontWeight: 600,
                  }}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                {...(rest as React.HTMLAttributes<HTMLElement>)}
                className={className}
              >
                {children}
              </code>
            );
          },

          
          h2: ({ children, id, ...props }) => (
            <h2 id={id} {...props} className="scroll-mt-24 group flex items-center gap-2">
              {children}
              {id && (
                <a
                  href={`#${id}`}
                  className="opacity-0 group-hover:opacity-60 transition-opacity"
                  style={{ color: "var(--link-color)", fontSize: "1rem", textDecoration: "none" }}
                  aria-label={`Link to ${id}`}
                >
                  #
                </a>
              )}
            </h2>
          ),

          
          h3: ({ children, id, ...props }) => (
            <h3 id={id} {...props} className="scroll-mt-24 group flex items-center gap-2">
              {children}
              {id && (
                <a
                  href={`#${id}`}
                  className="opacity-0 group-hover:opacity-60 transition-opacity"
                  style={{ color: "var(--link-color)", fontSize: "0.875rem", textDecoration: "none" }}
                  aria-label={`Link to ${id}`}
                >
                  #
                </a>
              )}
            </h3>
          ),

          
          blockquote: ({ children, ...props }) => (
            <blockquote
              {...props}
              style={{
                borderLeft: "3px solid var(--link-color)",
                background: "color-mix(in srgb, var(--link-color) 6%, var(--bg-surface))",
                borderRadius: "0 10px 10px 0",
                padding: "1rem 1.25rem",
                margin: "1.75rem 0",
                color: "var(--text-secondary)",
                fontStyle: "italic",
              }}
            >
              {children}
            </blockquote>
          ),

          
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              {...props}
              style={{
                color: "var(--link-color)",
                textDecoration: "underline",
                textDecorationStyle: "dotted",
                textUnderlineOffset: "3px",
                fontWeight: 500,
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.textDecorationStyle = "solid")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.textDecorationStyle = "dotted")
              }
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),

          
          img: ({ src, alt, ...props }) => (
            <figure style={{ margin: "2rem 0" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt || ""}
                {...props}
                style={{
                  borderRadius: "10px",
                  maxWidth: "100%",
                  border: "1px solid var(--border-color)",
                  display: "block",
                }}
                loading="lazy"
              />
              {alt && (
                <figcaption
                  style={{
                    textAlign: "center",
                    fontSize: "0.8rem",
                    color: "var(--text-tertiary)",
                    marginTop: "0.6rem",
                    fontStyle: "italic",
                  }}
                >
                  {alt}
                </figcaption>
              )}
            </figure>
          ),

          
          table: ({ children, ...props }) => (
            <div
              style={{
                overflowX: "auto",
                margin: "1.75rem 0",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
              }}
            >
              <table
                {...props}
                style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead {...props} style={{ background: "var(--bg-surface)" }}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th
              {...props}
              style={{
                padding: "0.75rem 1rem",
                textAlign: "left",
                fontWeight: 700,
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: "var(--text-primary)",
                borderBottom: "2px solid var(--border-color)",
              }}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              {...props}
              style={{
                padding: "0.7rem 1rem",
                color: "var(--text-secondary)",
                borderTop: "1px solid var(--border-color)",
                lineHeight: 1.6,
              }}
            >
              {children}
            </td>
          ),
          tr: ({ children, ...props }) => (
            <tr
              {...props}
              onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "var(--bg-surface)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "")
              }
              style={{ transition: "background 0.15s" }}
            >
              {children}
            </tr>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}