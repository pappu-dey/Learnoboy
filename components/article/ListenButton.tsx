"use client";

import { useState, useEffect, useCallback } from "react";

interface ListenButtonProps {
  title: string;
  content: string;
  variant?: "button" | "text";
  size?: "small" | "normal";
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

interface TTSState {
  playState: PlayState;
  text: string;
  charIndex: number;
  totalChars: number;
}

class TTSService {
  private subscribers: Set<(state: TTSState) => void> = new Set();
  private playState: PlayState = "idle";
  private text: string = "";
  private charIndex: number = 0;
  private totalChars: number = 0;
  private utterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => this.stop());
    }
  }

  public subscribe(callback: (state: TTSState) => void) {
    this.subscribers.add(callback);
    callback(this.getState());
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify() {
    const state = this.getState();
    this.subscribers.forEach((callback) => callback(state));
  }

  public play(title: string, content: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (this.playState === "paused" && this.utterance) {
      window.speechSynthesis.resume();
      this.playState = "playing";
      this.notify();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const plainText = stripMarkdown(content);
      this.text = `${title}. ${plainText}`;
      this.charIndex = 0;
      this.totalChars = this.text.length;

      const utterance = new SpeechSynthesisUtterance(this.text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.lang = "en-US";

      utterance.onboundary = (event) => {
        if (event.name === "word" || event.name === "sentence") {
          this.charIndex = event.charIndex;
          this.notify();
        }
      };

      utterance.onend = () => {
        this.playState = "idle";
        this.charIndex = this.totalChars;
        this.notify();
        this.utterance = null;
      };

      utterance.onerror = (e) => {
        // Interrupted/removed happens on manual stop, log status and clear state
        console.log("TTS status:", e.error);
        this.playState = "idle";
        this.notify();
        this.utterance = null;
      };

      this.utterance = utterance;
      this.playState = "playing";
      this.notify();
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Speech Synthesis failed:", err);
      this.playState = "idle";
      this.notify();
    }
  }

  public pause() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.pause();
      this.playState = "paused";
      this.notify();
    }
  }

  public stop() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.playState = "idle";
      this.charIndex = 0;
      this.notify();
      this.utterance = null;
    }
  }

  public getState(): TTSState {
    return {
      playState: this.playState,
      text: this.text,
      charIndex: this.charIndex,
      totalChars: this.totalChars,
    };
  }
}

const ttsServiceInstance = new TTSService();

const srOnlyStyle: React.CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: "0",
};

export function ListenButton({ title, content, variant = "button", size = "normal" }: ListenButtonProps) {
  const [supported, setSupported] = useState(false);
  const [ttsState, setTtsState] = useState<TTSState>(() => ttsServiceInstance.getState());

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSupported(true);
    }
    
    // Subscribe to singleton TTS state updates
    const unsubscribe = ttsServiceInstance.subscribe((state) => {
      setTtsState(state);
    });

    return unsubscribe;
  }, []);

  const buildText = useCallback(() => {
    const plain = stripMarkdown(content);
    return `${title}. ${plain}`;
  }, [title, content]);

  const myText = buildText();
  const isCurrentPlaying = ttsState.text === myText;
  
  const isPlaying = ttsState.playState === "playing" && isCurrentPlaying;
  const isPaused = ttsState.playState === "paused" && isCurrentPlaying;
  const isActive = isCurrentPlaying && (ttsState.playState === "playing" || ttsState.playState === "paused");

  const handlePlay = useCallback(() => {
    ttsServiceInstance.play(title, content);
  }, [title, content]);

  const handlePause = useCallback(() => {
    ttsServiceInstance.pause();
  }, []);

  const handleStop = useCallback(() => {
    ttsServiceInstance.stop();
  }, []);

  if (!supported) return null;

  const progressPercent = ttsState.totalChars > 0 ? (ttsState.charIndex / ttsState.totalChars) * 100 : 0;

  if (variant === "text") {
    return (
      <div style={{ display: "inline-flex", flexDirection: "column", gap: "0.25rem", position: "relative" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: size === "small" ? "0.3rem" : "0.4rem" }}>
          <button
            id="article-listen-btn"
            onClick={isPlaying ? handlePause : handlePlay}
            className="hover:text-[var(--link-color)] transition-colors cursor-pointer flex items-center gap-1 font-semibold focus:outline-none"
            aria-label={isPlaying ? "Pause listening" : isPaused ? "Resume listening" : "Listen to article"}
            title={isPlaying ? "Pause" : isPaused ? "Resume" : "Listen to article"}
            style={{ fontSize: size === "small" ? "0.75rem" : undefined }}
          >
            {isPlaying ? (
              <WaveformIcon size={size} />
            ) : (
              <HeadphonesIcon paused={isPaused} size={size} />
            )}
            <span>
              {isPlaying ? "Listening…" : isPaused ? "Paused" : "Listen"}
            </span>
          </button>
          {isActive && (
            <button
              id="article-stop-listen-btn"
              onClick={handleStop}
              className="flex items-center justify-center cursor-pointer text-[var(--text-tertiary)] hover:text-red-500 transition-colors focus:outline-none"
              aria-label="Stop listening"
              title="Stop"
            >
              <StopIcon size={size} />
              <span style={srOnlyStyle}>Stop</span>
            </button>
          )}
        </div>
        {isActive && (
          <div 
            style={{ 
              position: "absolute", 
              bottom: "-4px", 
              left: 0, 
              right: 0, 
              height: "2px", 
              background: "var(--border-color)", 
              borderRadius: "999px", 
              overflow: "hidden" 
            }}
          >
            <div 
              className="h-full bg-[var(--link-color)] transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%`, height: "100%" }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: size === "small" ? "0.25rem" : "0.35rem",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: size === "small" ? "0.35rem" : "0.5rem",
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
            gap: size === "small" ? "0.3rem" : "0.45rem",
            padding: size === "small" ? "0.25rem 0.65rem" : "0.4rem 0.9rem",
            borderRadius: "999px",
            fontSize: size === "small" ? "0.75rem" : "0.8rem",
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
            <WaveformIcon size={size} />
          ) : (
            <HeadphonesIcon paused={isPaused} size={size} />
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
              width: size === "small" ? "1.6rem" : "2rem",
              height: size === "small" ? "1.6rem" : "2rem",
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
            <StopIcon size={size} />
            <span style={srOnlyStyle}>Stop</span>
          </button>
        )}
      </div>

      {isActive && (
        <div 
          className="h-1 rounded-full overflow-hidden" 
          style={{ background: "var(--border-color)", minWidth: size === "small" ? "80px" : "120px" }}
        >
          <div 
            className="h-full transition-all duration-300 ease-out"
            style={{ 
              width: `${progressPercent}%`,
              background: "var(--link-color)",
            }}
          />
        </div>
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

function WaveformIcon({ size = "normal" }: { size?: "small" | "normal" }) {
  const iconSize = size === "small" ? 14 : 18;
  return (
    <svg
      width={iconSize}
      height={iconSize}
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

function HeadphonesIcon({ paused, size = "normal" }: { paused: boolean; size?: "small" | "normal" }) {
  const iconSize = size === "small" ? 13 : 16;
  const playSize = size === "small" ? 12 : 15;
  if (paused) {
    // Play triangle for "resume"
    return (
      <svg
        width={playSize}
        height={playSize}
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
      width={iconSize}
      height={iconSize}
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

function StopIcon({ size = "normal" }: { size?: "small" | "normal" }) {
  const iconSize = size === "small" ? 8 : 10;
  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 10 10"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="10" height="10" rx="1.5" />
    </svg>
  );
}
