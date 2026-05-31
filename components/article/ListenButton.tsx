"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface ListenButtonProps {
  title: string;
  content: string;
}

// Strip markdown syntax to get plain text for TTS
function stripMarkdown(md: string): string {
  return md
    // Remove headings
    .replace(/#{1,6}\s+/g, "")
    // Remove bold / italic
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    // Remove inline code
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    // Remove fenced code blocks
    .replace(/```[\s\S]*?```/g, " [code block] ")
    // Remove links, keep label
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove images
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    // Remove blockquote markers
    .replace(/^>\s*/gm, "")
    // Remove HTML tags
    .replace(/<[^>]+>/g, "")
    // Collapse whitespace
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

type PlayState = "idle" | "playing" | "paused";

export function ListenButton({ title, content }: ListenButtonProps) {
  const [playState, setPlayState] = useState<PlayState>("idle");
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
    }
    // Cleanup on unmount
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const buildText = useCallback(() => {
    const plain = stripMarkdown(content);
    return `${title}. ${plain}`;
  }, [title, content]);

  const handlePlay = useCallback(() => {
    if (!supported) return;

    if (playState === "paused") {
      window.speechSynthesis.resume();
      setPlayState("playing");
      return;
    }

    // Cancel any existing
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(buildText());
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    utterance.onend = () => setPlayState("idle");
    utterance.onerror = () => setPlayState("idle");

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setPlayState("playing");
  }, [supported, playState, buildText]);

  const handlePause = useCallback(() => {
    window.speechSynthesis.pause();
    setPlayState("paused");
  }, []);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setPlayState("idle");
  }, []);

  if (!supported) return null;

  const isPlaying = playState === "playing";
  const isPaused = playState === "paused";
  const isActive = isPlaying || isPaused;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      {/* Main listen / pause button */}
      <button
        id="article-listen-btn"
        onClick={isPlaying ? handlePause : handlePlay}
        aria-label={isPlaying ? "Pause listening" : isPaused ? "Resume listening" : "Listen to article"}
        title={isPlaying ? "Pause" : isPaused ? "Resume" : "Listen to article"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.45rem",
          padding: "0.4rem 0.9rem",
          borderRadius: "999px",
          fontSize: "0.8rem",
          fontWeight: 600,
          letterSpacing: "0.02em",
          cursor: "pointer",
          border: "1.5px solid",
          transition: "all 0.2s ease",
          background: isActive
            ? "color-mix(in srgb, var(--link-color) 12%, var(--bg-surface))"
            : "var(--bg-surface)",
          borderColor: isActive ? "var(--link-color)" : "var(--border-color)",
          color: isActive ? "var(--link-color)" : "var(--text-secondary)",
          boxShadow: isActive
            ? "0 0 0 3px color-mix(in srgb, var(--link-color) 15%, transparent)"
            : "none",
        }}
      >
        {/* Animated waveform or icon */}
        {isPlaying ? (
          <WaveformIcon />
        ) : (
          <HeadphonesIcon paused={isPaused} />
        )}
        <span>
          {isPlaying ? "Listening…" : isPaused ? "Paused" : "Listen"}
        </span>
      </button>

      {/* Stop button — only visible when active */}
      {isActive && (
        <button
          id="article-stop-listen-btn"
          onClick={handleStop}
          aria-label="Stop listening"
          title="Stop"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "2rem",
            height: "2rem",
            borderRadius: "50%",
            border: "1.5px solid var(--border-color)",
            background: "var(--bg-surface)",
            color: "var(--text-tertiary)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--link-color)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--link-color)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--border-color)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-tertiary)";
          }}
        >
          <StopIcon />
        </button>
      )}

      {/* Inline keyframe styles */}
      <style>{`
        @keyframes lb-bar {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1); }
        }
        .lb-bar-1 { animation: lb-bar 0.9s ease-in-out infinite; animation-delay: 0s; }
        .lb-bar-2 { animation: lb-bar 0.9s ease-in-out infinite; animation-delay: 0.15s; }
        .lb-bar-3 { animation: lb-bar 0.9s ease-in-out infinite; animation-delay: 0.3s; }
        .lb-bar-4 { animation: lb-bar 0.9s ease-in-out infinite; animation-delay: 0.45s; }
      `}</style>
    </div>
  );
}

function WaveformIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <g style={{ transformOrigin: "50% 50%" }}>
        <rect
          className="lb-bar-1"
          x="1"
          y="5"
          width="2.5"
          height="8"
          rx="1.25"
          fill="currentColor"
          style={{ transformOrigin: "2.25px 9px" }}
        />
        <rect
          className="lb-bar-2"
          x="5.25"
          y="2"
          width="2.5"
          height="14"
          rx="1.25"
          fill="currentColor"
          style={{ transformOrigin: "6.5px 9px" }}
        />
        <rect
          className="lb-bar-3"
          x="9.5"
          y="4"
          width="2.5"
          height="10"
          rx="1.25"
          fill="currentColor"
          style={{ transformOrigin: "10.75px 9px" }}
        />
        <rect
          className="lb-bar-4"
          x="13.75"
          y="6"
          width="2.5"
          height="6"
          rx="1.25"
          fill="currentColor"
          style={{ transformOrigin: "15px 9px" }}
        />
      </g>
    </svg>
  );
}

function HeadphonesIcon({ paused }: { paused: boolean }) {
  if (paused) {
    // Play triangle for "resume"
    return (
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="currentColor"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <path d="M3 2.5l9 5-9 5V2.5z" />
      </svg>
    );
  }
  // Headphones icon
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="10" height="10" rx="1.5" />
    </svg>
  );
}
