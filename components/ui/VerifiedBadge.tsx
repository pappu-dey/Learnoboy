interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

const sizes = {
  sm: { icon: 13, px: "0.35rem 0.6rem", fontSize: "0.65rem", gap: "0.25rem" },
  md: { icon: 15, px: "0.4rem 0.75rem", fontSize: "0.7rem", gap: "0.3rem" },
  lg: { icon: 18, px: "0.5rem 0.9rem", fontSize: "0.8rem", gap: "0.35rem" },
};

export function VerifiedBadge({ size = "md", className = "", showLabel = true }: VerifiedBadgeProps) {
  const s = sizes[size];

  return (
    <span
      className={className}
      title="Verified Writer"
      aria-label="Verified Writer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        padding: showLabel ? s.px : "0.3rem",
        borderRadius: "999px",
        fontSize: s.fontSize,
        fontWeight: 700,
        letterSpacing: "0.03em",
        background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.10))",
        color: "var(--link-color)",
        border: "1px solid rgba(37,99,235,0.2)",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {/* Shield check icon */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
      {showLabel && <span>Verified</span>}
    </span>
  );
}
