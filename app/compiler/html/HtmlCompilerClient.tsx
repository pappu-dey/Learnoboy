"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Play, 
  RotateCcw, 
  Trash2, 
  Copy, 
  Download, 
  Share2, 
  Columns, 
  Rows, 
  Eye, 
  Terminal as TerminalIcon,
  Maximize2,
  Minimize2,
  Check,
  Code2
} from "lucide-react";


const BOILERPLATE = {
  html: `<!-- LearnoBoy HTML Compiler Playground -->
<div class="card">
  <div class="avatar">👦</div>
  <h1>Hello LearnoBoy!</h1>
  <p>Start writing HTML, CSS, and JS to see changes in real-time.</p>
  <button id="action-btn">Click Me!</button>
</div>`,
  css: `/* Custom Styles for Preview */
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
}

.card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.avatar {
  font-size: 48px;
  margin-bottom: 16px;
}

h1 {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #60a5fa, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
}

p {
  color: #94a3b8;
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 24px;
}

button {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #ffffff;
  border: none;
  font-weight: 600;
  padding: 12px 28px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
}

button:active {
  transform: translateY(0);
}`,
  js: `// Custom Scripting Actions
const btn = document.getElementById("action-btn");

if (btn) {
  btn.addEventListener("click", () => {
    console.log("👦 Action button clicked!");
    
    // Add custom interaction effect
    const colors = ["#2563eb", "#7c3aed", "#ec4899", "#10b981", "#f59e0b"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    console.log("🎨 Updating button shadow to matches: " + randomColor);
    btn.style.boxShadow = "0 6px 20px " + randomColor;
    
    // Alert or update text
    const title = document.querySelector("h1");
    if (title) {
      title.style.background = "linear-gradient(135deg, " + randomColor + ", #c084fc)";
      title.style.webkitBackgroundClip = "text";
    }
  });
}

console.log("🚀 HTML compiler template loaded successfully!");`
};

interface ConsoleLog {
  type: "log" | "error" | "warn" | "info";
  content: string;
  timestamp: string;
}

export default function HtmlCompilerClient() {
  
  const [htmlCode, setHtmlCode] = useState(BOILERPLATE.html);
  const [cssCode, setCssCode] = useState(BOILERPLATE.css);
  const [jsCode, setJsCode] = useState(BOILERPLATE.js);
  
  
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [autoRun, setAutoRun] = useState(true);
  const [layout, setLayout] = useState<"side" | "stack">("side");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  
  const [srcDoc, setSrcDoc] = useState("");

  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const shareCode = searchParams.get("code");
      if (shareCode) {
        const decoded = JSON.parse(atob(shareCode));
        if (decoded.html !== undefined) setHtmlCode(decoded.html);
        if (decoded.css !== undefined) setCssCode(decoded.css);
        if (decoded.js !== undefined) setJsCode(decoded.js);
        console.log("📂 Loaded shared playground project successfully.");
      }
    } catch (e) {
      console.error("Failed to parse shared code query", e);
    }
  }, []);

  
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textarea.scrollTop;
    }
  };

  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      const newVal = val.substring(0, start) + "  " + val.substring(end);

      if (activeTab === "html") setHtmlCode(newVal);
      else if (activeTab === "css") setCssCode(newVal);
      else if (activeTab === "js") setJsCode(newVal);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  
  const getCompiledSource = (html: string, css: string, js: string) => {
    const consoleInterceptor = `
      <script>
        (function() {
          const _log = console.log;
          const _error = console.error;
          const _warn = console.warn;
          const _info = console.info;

          function formatArg(arg) {
            if (arg === null) return "null";
            if (arg === undefined) return "undefined";
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg);
              } catch(e) {
                return String(arg);
              }
            }
            return String(arg);
          }

          function sendLog(type, args) {
            const formattedArgs = Array.from(args).map(formatArg).join(' ');
            window.parent.postMessage({ type: 'COMPILER_CONSOLE_LOG', logType: type, content: formattedArgs }, '*');
          }

          console.log = function() {
            sendLog('log', arguments);
            _log.apply(console, arguments);
          };
          console.error = function() {
            sendLog('error', arguments);
            _error.apply(console, arguments);
          };
          console.warn = function() {
            sendLog('warn', arguments);
            _warn.apply(console, arguments);
          };
          console.info = function() {
            sendLog('info', arguments);
            _info.apply(console, arguments);
          };

          window.addEventListener('error', function(e) {
            window.parent.postMessage({ type: 'COMPILER_CONSOLE_LOG', logType: 'error', content: e.message }, '*');
          });
        })();
      </script>
    `;

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            ${css}
          </style>
          ${consoleInterceptor}
        </head>
        <body>
          ${html}
          <script>
            try {
              ${js}
            } catch (err) {
              console.error(err.message);
            }
          </script>
        </body>
      </html>
    `;
  };

  
  const runCode = () => {
    setSrcDoc(getCompiledSource(htmlCode, cssCode, jsCode));
  };

  
  useEffect(() => {
    const handleLogMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "COMPILER_CONSOLE_LOG") {
        const { logType, content } = event.data;
        const newLog: ConsoleLog = {
          type: logType,
          content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
        setConsoleLogs((prev) => [...prev, newLog]);
      }
    };

    window.addEventListener("message", handleLogMessage);
    return () => window.removeEventListener("message", handleLogMessage);
  }, []);

  
  useEffect(() => {
    if (autoRun) {
      const delayDebounce = setTimeout(() => {
        runCode();
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [htmlCode, cssCode, jsCode, autoRun]);

  
  const handleReset = () => {
    if (confirm("Reset code back to standard templates? All current changes will be lost.")) {
      setHtmlCode(BOILERPLATE.html);
      setCssCode(BOILERPLATE.css);
      setJsCode(BOILERPLATE.js);
      setConsoleLogs([]);
    }
  };

  const handleClear = () => {
    if (confirm("Wipe all editor canvases clean?")) {
      setHtmlCode("");
      setCssCode("");
      setJsCode("");
      setConsoleLogs([]);
    }
  };

  const handleCopyCode = () => {
    const combined = `/* HTML */\n${htmlCode}\n\n/* CSS */\n${cssCode}\n\n/* JS */\n${jsCode}`;
    navigator.clipboard.writeText(combined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const combinedHtml = getCompiledSource(htmlCode, cssCode, jsCode);
    const blob = new Blob([combinedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    try {
      const codes = { html: htmlCode, css: cssCode, js: jsCode };
      const base64 = btoa(JSON.stringify(codes));
      const shareUrl = `${window.location.origin}${window.location.pathname}?code=${base64}`;
      navigator.clipboard.writeText(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch (e) {
      console.error("Failed to generate share URL", e);
    }
  };

  
  const activeCode = activeTab === "html" ? htmlCode : activeTab === "css" ? cssCode : jsCode;
  const linesCount = (activeCode.match(/\n/g) || []).length + 1;
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);

  return (
    <div 
      className={`flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] border-t border-[var(--border-color)] transition-all ${
        isFullscreen ? "fixed inset-0 z-[9999] h-screen" : "h-[calc(100vh-64px)] w-full"
      }`}
    >
      {}
      <h1 className="sr-only">Online HTML, CSS, and JavaScript Sandbox Compiler</h1>

      {}
      <div 
        className="flex flex-wrap items-center justify-between px-4 py-2 bg-[var(--bg-surface)] border-b border-[var(--border-color)] gap-3 shrink-0"
        style={{ zIndex: 10 }}
      >
        {}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0">
            <Code2 size={16} />
          </div>
          <span className="font-bold text-sm tracking-tight hidden sm:inline-block">HTML Sandbox Editor</span>
        </div>

        {}
        <div className="flex items-center flex-wrap gap-2">
          {}
          <button
            id="compiler-run-btn"
            onClick={runCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer"
            title="Compile & Render Code"
          >
            <Play size={12} fill="white" />
            <span>Run</span>
          </button>

          {}
          <label className="flex items-center gap-2 px-2.5 py-1.5 border border-[var(--border-color)] rounded-lg text-xs font-medium cursor-pointer bg-[var(--bg-base)] select-none">
            <input 
              id="compiler-autorun-checkbox"
              type="checkbox" 
              checked={autoRun} 
              onChange={() => setAutoRun(!autoRun)} 
              className="accent-blue-600 w-3.5 h-3.5"
            />
            <span>Auto-run</span>
          </label>

          <div className="w-px h-6 bg-[var(--border-color)] hidden xs:block" />

          {}
          <button
            id="compiler-copy-btn"
            onClick={handleCopyCode}
            className="p-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-surface)] bg-[var(--bg-base)] transition-colors cursor-pointer text-[var(--text-secondary)]"
            title="Copy Combined Code"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>

          <button
            id="compiler-download-btn"
            onClick={handleDownload}
            className="p-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-surface)] bg-[var(--bg-base)] transition-colors cursor-pointer text-[var(--text-secondary)]"
            title="Download index.html File"
          >
            <Download size={14} />
          </button>

          <button
            id="compiler-share-btn"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-surface)] bg-[var(--bg-base)] transition-colors cursor-pointer text-[var(--text-secondary)] font-medium text-xs"
            title="Share Playground Link"
          >
            <Share2 size={13} />
            <span>{shared ? "Copied Link!" : "Share"}</span>
          </button>
        </div>

        {}
        <div className="flex items-center gap-2">
          {}
          <button
            id="compiler-layout-btn"
            onClick={() => setLayout(layout === "side" ? "stack" : "side")}
            className="p-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-surface)] bg-[var(--bg-base)] transition-colors cursor-pointer text-[var(--text-secondary)]"
            title={layout === "side" ? "Switch to Stack layout" : "Switch to Split layout"}
          >
            {layout === "side" ? <Rows size={14} /> : <Columns size={14} />}
          </button>

          {}
          <button
            id="compiler-fullscreen-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-surface)] bg-[var(--bg-base)] transition-colors cursor-pointer text-[var(--text-secondary)]"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          <div className="w-px h-6 bg-[var(--border-color)]" />

          {}
          <button
            id="compiler-reset-btn"
            onClick={handleReset}
            className="p-2 border border-[var(--border-color)] rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors cursor-pointer"
            title="Reset to boilerplate"
          >
            <RotateCcw size={14} />
          </button>

          <button
            id="compiler-clear-btn"
            onClick={handleClear}
            className="p-2 border border-[var(--border-color)] rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
            title="Clear all text fields"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {}
      <div className={`flex-1 flex overflow-hidden ${layout === "side" ? "flex-col lg:flex-row" : "flex-col"}`}>
        
        {}
        <div className={`flex flex-col bg-[var(--bg-base)] border-r border-[var(--border-color)] min-h-[30%] ${
          layout === "side" ? "w-full lg:w-1/2" : "w-full h-1/2 border-b"
        }`}>
          {}
          <div className="flex items-center justify-between px-2 bg-[var(--bg-surface)] border-b border-[var(--border-color)] select-none shrink-0 h-10">
            <div className="flex items-center gap-1">
              {[
                { id: "html", label: "HTML", dot: "bg-orange-500" },
                { id: "css", label: "CSS", dot: "bg-blue-500" },
                { id: "js", label: "JavaScript", dot: "bg-yellow-500" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`compiler-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-t-lg border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600 bg-[var(--bg-base)]"
                      : "border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-base)]/50"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${tab.dot}`} />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="text-[10px] uppercase font-semibold text-[var(--text-tertiary)] px-2">
              Editor
            </div>
          </div>

          {}
          <div className="flex-1 relative flex overflow-hidden">
            {}
            <div 
              ref={lineNumbersRef}
              className="w-12 bg-[var(--bg-surface)] border-r border-[var(--border-color)] text-right py-3 select-none overflow-hidden font-mono text-xs text-[var(--text-tertiary)] flex flex-col items-stretch shrink-0"
              style={{ lineHeight: "1.7", boxSizing: "border-box" }}
            >
              {lineNumbers.map((num) => (
                <div key={num} className="pr-3 leading-6">
                  {num}
                </div>
              ))}
            </div>

            {}
            <div className="flex-1 relative h-full">
              {}
              <textarea
                ref={activeTab === "html" ? textareaRef : null}
                id="compiler-html-textarea"
                aria-label="HTML Code Input"
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                onScroll={activeTab === "html" ? handleScroll : undefined}
                onKeyDown={handleKeyDown}
                spellCheck="false"
                autoCapitalize="none"
                autoComplete="off"
                className={`absolute inset-0 w-full h-full p-3 font-mono text-sm leading-6 resize-none bg-transparent text-[var(--text-primary)] border-none outline-none focus:ring-0 ${
                  activeTab === "html" ? "z-10 opacity-100" : "z-0 opacity-0 pointer-events-none"
                }`}
                placeholder="<!-- Write HTML code here -->"
                style={{ 
                  fontFamily: "var(--font-mono)",
                  tabSize: 2,
                  WebkitTextFillColor: "inherit"
                }}
              />

              {}
              <textarea
                ref={activeTab === "css" ? textareaRef : null}
                id="compiler-css-textarea"
                aria-label="CSS Code Input"
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                onScroll={activeTab === "css" ? handleScroll : undefined}
                onKeyDown={handleKeyDown}
                spellCheck="false"
                autoCapitalize="none"
                autoComplete="off"
                className={`absolute inset-0 w-full h-full p-3 font-mono text-sm leading-6 resize-none bg-transparent text-[var(--text-primary)] border-none outline-none focus:ring-0 ${
                  activeTab === "css" ? "z-10 opacity-100" : "z-0 opacity-0 pointer-events-none"
                }`}
                placeholder="/* Write CSS styles here */"
                style={{ 
                  fontFamily: "var(--font-mono)",
                  tabSize: 2,
                  WebkitTextFillColor: "inherit"
                }}
              />

              {}
              <textarea
                ref={activeTab === "js" ? textareaRef : null}
                id="compiler-js-textarea"
                aria-label="JavaScript Code Input"
                value={jsCode}
                onChange={(e) => setJsCode(e.target.value)}
                onScroll={activeTab === "js" ? handleScroll : undefined}
                onKeyDown={handleKeyDown}
                spellCheck="false"
                autoCapitalize="none"
                autoComplete="off"
                className={`absolute inset-0 w-full h-full p-3 font-mono text-sm leading-6 resize-none bg-transparent text-[var(--text-primary)] border-none outline-none focus:ring-0 ${
                  activeTab === "js" ? "z-10 opacity-100" : "z-0 opacity-0 pointer-events-none"
                }`}
                placeholder="// Write JavaScript code here"
                style={{ 
                  fontFamily: "var(--font-mono)",
                  tabSize: 2,
                  WebkitTextFillColor: "inherit"
                }}
              />
            </div>
          </div>
        </div>

        {}
        <div className={`flex-1 flex flex-col bg-white overflow-hidden relative min-h-[30%] ${
          layout === "side" ? "w-full lg:w-1/2" : "w-full h-1/2"
        }`}>
          {}
          <div className="flex items-center justify-between px-3 bg-[var(--bg-surface)] border-b border-[var(--border-color)] select-none shrink-0 h-10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)]">
              <Eye size={13} className="text-blue-600" />
              <span>Live Output Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                id="compiler-console-toggle-btn"
                onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                  isConsoleOpen 
                    ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900" 
                    : "bg-[var(--bg-base)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
                }`}
              >
                <TerminalIcon size={12} />
                <span>Console ({consoleLogs.length})</span>
              </button>
            </div>
          </div>

          {}
          <div className="flex-1 bg-white relative">
            {srcDoc ? (
              <iframe
                srcDoc={srcDoc}
                title="Sandbox Preview Viewport"
                sandbox="allow-scripts"
                className="w-full h-full border-none bg-white"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2 select-none">
                <Play size={32} className="opacity-40 animate-pulse text-blue-500" />
                <span className="text-xs font-semibold">Click Run to initialize preview</span>
              </div>
            )}
          </div>

          {}
          {isConsoleOpen && (
            <div className="h-44 border-t border-[var(--border-color)] bg-[#0f172a] text-[#f8fafc] flex flex-col shrink-0">
              {}
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#1e293b] border-b border-slate-800 shrink-0 select-none">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <TerminalIcon size={12} className="text-yellow-400" />
                  <span>Developer Console</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    id="compiler-console-clear-btn"
                    onClick={() => setConsoleLogs([])}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-100 hover:underline cursor-pointer bg-transparent border-none"
                  >
                    Clear Logs
                  </button>
                  <button
                    id="compiler-console-collapse-btn"
                    onClick={() => setIsConsoleOpen(false)}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-100 hover:underline cursor-pointer bg-transparent border-none"
                  >
                    Collapse
                  </button>
                </div>
              </div>

              {}
              <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-2.5">
                {consoleLogs.length === 0 ? (
                  <div className="text-slate-500 text-center py-6 italic select-none">
                    Console stream is empty. Output logs will appear here.
                  </div>
                ) : (
                  consoleLogs.map((log, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-start gap-2 border-b border-slate-800 pb-1.5 last:border-none ${
                        log.type === "error" 
                          ? "text-rose-400" 
                          : log.type === "warn" 
                            ? "text-amber-400" 
                            : log.type === "info" 
                              ? "text-sky-400" 
                              : "text-slate-200"
                      }`}
                    >
                      <span className="text-slate-500 text-[10px] shrink-0 select-none">{log.timestamp}</span>
                      <span className="font-semibold text-[10px] shrink-0 uppercase select-none">
                        [{log.type}]
                      </span>
                      <span className="flex-1 break-all whitespace-pre-wrap leading-relaxed">{log.content}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
