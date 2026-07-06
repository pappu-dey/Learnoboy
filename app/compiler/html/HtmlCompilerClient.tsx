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
  Code2,
  Sparkles,
  MoreVertical
} from "lucide-react";


interface ProjectFile {
  name: string;
  type: "html" | "css" | "js";
  content: string;
  isDeletable?: boolean;
}

const INITIAL_FILES: ProjectFile[] = [
  {
    name: "index.html",
    type: "html",
    content: `<!DOCTYPE html>
<html>
  <head>
    <title>My LearnoBoy Sandbox</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <h1>Hello LearnoBoy!</h1>
    <p>Start writing HTML, CSS, and JS to see changes in real-time.</p>
    <button id="click-me">Click Me!</button>

    <script src="script.js"></script>
  </body>
</html>`,
    isDeletable: false
  },
  {
    name: "styles.css",
    type: "css",
    content: `/* Custom Styles for Preview */
body {
  font-family: system-ui, sans-serif;
  text-align: center;
  background-color: #f0f2f5;
  color: #333;
  padding: 50px;
}

button {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #1d4ed8;
}`,
    isDeletable: false
  },
  {
    name: "script.js",
    type: "js",
    content: `// Custom Scripting Actions
const btn = document.getElementById("click-me");

if (btn) {
  btn.addEventListener("click", () => {
    console.log("Button clicked! 🎉");
    alert("Button clicked! 🎉");
  });
}

console.log("HTML compiler template loaded successfully!");`,
    isDeletable: false
  }
];

interface ConsoleLog {
  type: "log" | "error" | "warn" | "info";
  content: string;
  timestamp: string;
}

export default function HtmlCompilerClient() {
  const [files, setFiles] = useState<ProjectFile[]>(INITIAL_FILES);
  const [activeFileName, setActiveFileName] = useState("index.html");
  
  const [autoRun, setAutoRun] = useState(true);
  const [layout, setLayout] = useState<"side" | "stack">("side");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Mobile layout state
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileView, setActiveMobileView] = useState<"code" | "output">("code");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Add File modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState<"html" | "css" | "js">("html");

  const handleNewFileNameChange = (val: string) => {
    setNewFileName(val);
    if (val.endsWith(".html")) setNewFileType("html");
    else if (val.endsWith(".css")) setNewFileType("css");
    else if (val.endsWith(".js")) setNewFileType("js");
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    let name = newFileName.trim();
    if (!name) return;

    const ext = `.${newFileType}`;
    if (!name.endsWith(ext)) {
      name += ext;
    }

    if (files.some(f => f.name.toLowerCase() === name.toLowerCase())) {
      alert("A file with this name already exists.");
      return;
    }

    let defaultContent = "";
    if (newFileType === "html") {
      defaultContent = `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <h1>New Page: ${name}</h1>
    <script src="script.js"></script>
  </body>
</html>`;
    } else if (newFileType === "css") {
      defaultContent = `/* Styles for ${name} */`;
    } else if (newFileType === "js") {
      defaultContent = `// Script for ${name}
console.log("Loaded script: ${name}");`;
    }

    const newFile: ProjectFile = {
      name,
      type: newFileType,
      content: defaultContent,
      isDeletable: true
    };

    setFiles(prev => [...prev, newFile]);
    setActiveFileName(name);
    setIsAddModalOpen(false);
    setNewFileName("");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [srcDoc, setSrcDoc] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const shareCode = searchParams.get("code");
      if (shareCode) {
        const decoded = JSON.parse(atob(shareCode));
        if (Array.isArray(decoded) && decoded.length > 0) {
          setFiles(decoded);
          setActiveFileName(decoded[0].name);
        } else if (decoded && (decoded.html !== undefined || decoded.css !== undefined || decoded.js !== undefined)) {
          setFiles([
            { name: "index.html", type: "html", content: decoded.html || "", isDeletable: false },
            { name: "styles.css", type: "css", content: decoded.css || "", isDeletable: false },
            { name: "script.js", type: "js", content: decoded.js || "", isDeletable: false }
          ]);
          setActiveFileName("index.html");
        }
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

      setFiles(prev => prev.map(f => f.name === activeFileName ? { ...f, content: newVal } : f));

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const val = textarea.value;
    const selectionStart = textarea.selectionStart;

    if (activeFileName.endsWith(".html") && selectionStart > 0 && val[selectionStart - 1] === ">") {
      const beforeCursor = val.substring(0, selectionStart - 1);
      const match = beforeCursor.match(/<([a-zA-Z0-9\-]+)(?:\s+[^>]*)?$/);
      if (match) {
        const tagName = match[1];
        const selfClosing = ["img", "input", "br", "hr", "meta", "link", "source", "embed"];
        if (!selfClosing.includes(tagName.toLowerCase())) {
          const closeTag = `</${tagName}>`;
          const newVal = val.substring(0, selectionStart) + closeTag + val.substring(selectionStart);
          
          setFiles(prev => prev.map(f => f.name === activeFileName ? { ...f, content: newVal } : f));
          
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = textareaRef.current.selectionEnd = selectionStart;
            }
          }, 0);
          return;
        }
      }
    }

    setFiles(prev => prev.map(f => f.name === activeFileName ? { ...f, content: val } : f));
  };

  const getCompiledSource = () => {
    const activeFile = files.find(f => f.name === activeFileName);
    const entryHtmlFile = activeFile?.type === "html" 
      ? activeFile 
      : (files.find(f => f.type === "html") || files[0]);

    if (!entryHtmlFile) return "";

    let html = entryHtmlFile.content;

    // Resolve CSS links: <link rel="stylesheet" href="styles.css">
    const cssLinkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>|<link[^>]*href=["']([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*>/g;
    html = html.replace(cssLinkRegex, (match, href1, href2) => {
      const href = href1 || href2;
      const cssFile = files.find(f => f.name === href && f.type === "css");
      if (cssFile) {
        return `<style data-file="${href}">${cssFile.content}</style>`;
      }
      return match;
    });

    // Resolve JS scripts: <script src="script.js"></script>
    const jsScriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*><\/script>/g;
    html = html.replace(jsScriptRegex, (match, src) => {
      const jsFile = files.find(f => f.name === src && f.type === "js");
      if (jsFile) {
        return `<script data-file="${src}">
          try {
            ${jsFile.content}
          } catch (err) {
            console.error("[${src}] " + err.message);
          }
        </script>`;
      }
      return match;
    });

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

    if (html.includes("<head>")) {
      html = html.replace("<head>", `<head>\n${consoleInterceptor}`);
    } else if (html.includes("<html>")) {
      html = html.replace("<html>", `<html>\n<head>\n${consoleInterceptor}</head>`);
    } else {
      html = consoleInterceptor + html;
    }

    return html;
  };

  const runCode = () => {
    setSrcDoc(getCompiledSource());
  };

  const runCodeMobile = () => {
    runCode();
    setActiveMobileView("output");
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
  }, [files, autoRun]);

  const handleReset = () => {
    if (confirm("Reset code back to standard templates? All current changes will be lost.")) {
      setFiles(INITIAL_FILES);
      setActiveFileName("index.html");
      setConsoleLogs([]);
    }
  };

  const handleClear = () => {
    if (confirm("Wipe all editor files clean? All code will be deleted.")) {
      setFiles(prev => prev.map(f => ({ ...f, content: "" })));
      setConsoleLogs([]);
    }
  };

  const handleCopyCode = () => {
    const activeFile = files.find(f => f.name === activeFileName);
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const combinedHtml = getCompiledSource();
    const blob = new Blob([combinedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFileName.endsWith(".html") ? activeFileName : "index.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    try {
      const base64 = btoa(JSON.stringify(files));
      const shareUrl = `${window.location.origin}${window.location.pathname}?code=${base64}`;
      navigator.clipboard.writeText(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch (e) {
      console.error("Failed to generate share URL", e);
    }
  };

  const activeFile = files.find(f => f.name === activeFileName);
  const activeCode = activeFile ? activeFile.content : "";
  const linesCount = (activeCode.match(/\n/g) || []).length + 1;
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);

  return (
    <div className={`w-full bg-[var(--bg-base)] text-[var(--text-primary)] overflow-y-auto ${isFullscreen ? "h-screen" : "h-[calc(100vh-64px)] scroll-smooth"}`}>
      <div 
        className={`flex flex-col bg-[var(--bg-base)] transition-all shrink-0 ${
          isFullscreen ? "fixed inset-0 z-[9999] h-screen" : "h-full w-full border-t border-[var(--border-color)]"
        }`}
      >
      <h1 className="sr-only">Online HTML, CSS, and JavaScript Sandbox Compiler</h1>

      {/* Desktop Toolbar Header */}
      <div 
        className="hidden md:flex flex-wrap items-center justify-between px-4 py-2 bg-[var(--bg-surface)] border-b border-[var(--border-color)] gap-3 shrink-0"
        style={{ zIndex: 10 }}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0">
            <Code2 size={16} />
          </div>
          <span className="font-bold text-sm tracking-tight hidden sm:inline-block">HTML Sandbox Editor</span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            id="compiler-run-btn"
            onClick={runCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer"
            title="Compile & Render Code"
          >
            <Play size={12} fill="white" />
            <span>Run</span>
          </button>

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


        </div>

        <div className="flex items-center gap-2">
          <button
            id="compiler-layout-btn"
            onClick={() => setLayout(layout === "side" ? "stack" : "side")}
            className="p-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-surface)] bg-[var(--bg-base)] transition-colors cursor-pointer text-[var(--text-secondary)]"
            title={layout === "side" ? "Switch to Stack layout" : "Switch to Split layout"}
          >
            {layout === "side" ? <Rows size={14} /> : <Columns size={14} />}
          </button>

          <button
            id="compiler-fullscreen-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-surface)] bg-[var(--bg-base)] transition-colors cursor-pointer text-[var(--text-secondary)]"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          <div className="w-px h-6 bg-[var(--border-color)]" />

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

      {/* Mobile Toolbar Header */}
      <div 
        className="flex md:hidden items-center justify-between px-3 py-2 bg-[#121316] border-b border-[#1f2026] shrink-0 h-14 relative"
        style={{ zIndex: 50 }}
      >
        {/* Left: Code vs Output Switcher */}
        <div className="flex items-center bg-[#1c1d22] p-0.5 rounded-lg border border-[#2b2c35]">
          <button
            onClick={() => setActiveMobileView("code")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeMobileView === "code"
                ? "bg-[#2b2d35] text-white"
                : "text-[#888aa0] hover:text-[#a0a2b8]"
            }`}
          >
            Code
          </button>
          <button
            onClick={() => setActiveMobileView("output")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeMobileView === "output"
                ? "bg-[#2b2d35] text-white"
                : "text-[#888aa0] hover:text-[#a0a2b8]"
            }`}
          >
            Output
          </button>
        </div>

        {/* Right: RUN, Dropdown Menu */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={runCodeMobile}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#f43f5e] hover:bg-[#db2777] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <Play size={10} fill="white" className="mt-[1px]" />
            <span>RUN</span>
          </button>

          {/* Three-dots menu button */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 text-[#888aa0] hover:text-white transition-colors cursor-pointer"
              aria-label="More options"
            >
              <MoreVertical size={18} />
            </button>

            {isMenuOpen && (
              <>
                {/* Backdrop overlay to close menu */}
                <div 
                  className="fixed inset-0 z-40 bg-transparent" 
                  onClick={() => setIsMenuOpen(false)}
                />
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1b21] border border-[#2b2d35] rounded-xl shadow-2xl p-1.5 z-50 text-white flex flex-col font-sans">
                  {/* Auto-run Toggle */}
                  <label className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#2b2d35]/60 rounded-lg cursor-pointer select-none text-xs font-medium">
                    <input 
                      type="checkbox" 
                      checked={autoRun} 
                      onChange={() => setAutoRun(!autoRun)} 
                      className="accent-[#10b981] w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>Auto-run code</span>
                  </label>

                  <div className="h-px bg-[#2b2d35] my-1" />

                  {/* Copy Code */}
                  <button
                    onClick={() => {
                      handleCopyCode();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2 hover:bg-[#2b2d35]/60 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    <span>{copied ? "Copied!" : "Copy Active Code"}</span>
                  </button>

                  {/* Download Code */}
                  <button
                    onClick={() => {
                      handleDownload();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2 hover:bg-[#2b2d35]/60 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Download entry html</span>
                  </button>



                  <div className="h-px bg-[#2b2d35] my-1" />

                  {/* Reset */}
                  <button
                    onClick={() => {
                      handleReset();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-amber-500 hover:bg-[#2b2d35]/60 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    <span>Reset Boilerplate</span>
                  </button>

                  {/* Clear */}
                  <button
                    onClick={() => {
                      handleClear();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-rose-500 hover:bg-[#2b2d35]/60 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Clear Workspace</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Panel Area */}
      <div className={`flex-1 flex overflow-hidden ${layout === "side" ? "flex-col md:flex-row" : "flex-col"}`}>
        
        {/* Code Editor Container */}
        <div 
          className={`flex-col bg-[#0d0e12] md:border-r border-[#1f2026] md:flex ${
            activeMobileView === "code" ? "flex" : "hidden"
          } ${
            layout === "side" ? "w-full md:w-1/2" : "w-full md:h-1/2 border-b"
          }`}
        >
          {/* Desktop File Tabs Header */}
          <div className="hidden md:flex items-center justify-between px-2 bg-[var(--bg-surface)] border-b border-[var(--border-color)] select-none shrink-0 h-10 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1">
              {files.map((file) => {
                let dot = "bg-orange-500";
                if (file.type === "css") dot = "bg-blue-500";
                else if (file.type === "js") dot = "bg-yellow-500";

                return (
                  <button
                    key={file.name}
                    onClick={() => setActiveFileName(file.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-t-lg border-b-2 transition-all cursor-pointer ${
                      activeFileName === file.name
                        ? "border-blue-600 text-blue-600 bg-[var(--bg-base)]"
                        : "border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-base)]/50"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${dot}`} />
                    <span>{file.name}</span>
                    {file.isDeletable && (
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          setFiles(prev => prev.filter(f => f.name !== file.name));
                          if (activeFileName === file.name) {
                            setActiveFileName("index.html");
                          }
                        }}
                        className="text-slate-400 hover:text-rose-500 font-normal ml-1 cursor-pointer"
                      >
                        ✕
                      </span>
                    )}
                  </button>
                );
              })}
              {/* Add file button */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center w-8 h-8 text-slate-400 hover:text-slate-200 transition-colors font-medium text-lg cursor-pointer"
                title="Add New File"
              >
                +
              </button>
            </div>
            <div className="text-[10px] uppercase font-semibold text-[var(--text-tertiary)] px-2 whitespace-nowrap">
              Editor
            </div>
          </div>

          {/* Mobile File Tabs Header */}
          <div className="flex md:hidden items-center justify-between bg-[#121316] border-b border-[#1f2026] select-none shrink-0 overflow-x-auto scrollbar-none h-11 px-2 font-sans">
            <div className="flex items-center gap-1">
              {files.map((file) => {
                let icon = <span className="text-orange-500 font-bold text-xs mr-1">&lt;&gt;</span>;
                if (file.type === "css") icon = <span className="text-blue-400 font-bold text-xs mr-1">#</span>;
                else if (file.type === "js") icon = <span className="bg-yellow-500 text-black font-extrabold text-[8px] px-0.5 rounded-sm scale-90 mr-1.5">JS</span>;

                return (
                  <button
                    key={file.name}
                    onClick={() => setActiveFileName(file.name)}
                    className={`flex items-center px-3.5 py-2 text-xs font-medium rounded-t-lg transition-all cursor-pointer border-t border-x ${
                      activeFileName === file.name
                        ? "bg-[#0d0e12] text-white border-[#2b2c35]"
                        : "bg-[#18181c] text-[#888aa0] border-transparent hover:bg-[#1e1e24]"
                    }`}
                  >
                    {icon}
                    <span className="mr-2 text-[11px] font-mono">{file.name}</span>
                    {file.isDeletable ? (
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          setFiles(prev => prev.filter(f => f.name !== file.name));
                          if (activeFileName === file.name) {
                            setActiveFileName("index.html");
                          }
                        }}
                        className="text-[#5b5d6b] hover:text-rose-500 transition-colors text-[9px] ml-1 p-0.5 cursor-pointer"
                      >
                        ✕
                      </span>
                    ) : (
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          setFiles(prev => prev.map(f => f.name === file.name ? { ...f, content: "" } : f));
                        }}
                        className="text-[#3b3d4b] hover:text-[#5b5d6b] transition-colors text-[9px] ml-1 p-0.5 cursor-pointer"
                      >
                        ✕
                      </span>
                    )}
                  </button>
                );
              })}
              
              {/* Add file button */}
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-[#888aa0] hover:bg-[#2b2d35]/30 hover:text-white transition-colors text-base font-medium cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Editor Textarea Area */}
          <div className="flex-1 relative flex overflow-hidden">
            <div 
              ref={lineNumbersRef}
              className="w-12 bg-[var(--bg-surface)] md:bg-[var(--bg-surface)] bg-[#121316] border-r border-[var(--border-color)] md:border-[var(--border-color)] border-[#1f2026] text-right py-3 select-none overflow-hidden font-mono text-sm text-[var(--text-tertiary)] flex flex-col items-stretch shrink-0"
              style={{ lineHeight: "24px", boxSizing: "border-box" }}
            >
              {lineNumbers.map((num) => (
                <div key={num} className="pr-3" style={{ height: "24px", lineHeight: "24px" }}>
                  {num}
                </div>
              ))}
            </div>

            <div className="flex-1 relative h-full">
              <textarea
                ref={textareaRef}
                value={files.find(f => f.name === activeFileName)?.content || ""}
                onChange={handleTextareaChange}
                onScroll={handleScroll}
                onKeyDown={handleKeyDown}
                spellCheck="false"
                autoCapitalize="none"
                autoComplete="off"
                wrap="off"
                className="absolute inset-0 w-full h-full p-3 font-mono text-sm resize-none bg-transparent text-[var(--text-primary)] border-none outline-none focus:ring-0 z-10 opacity-100"
                placeholder={
                  activeFileName.endsWith(".html")
                    ? "<!-- Write HTML code here -->"
                    : activeFileName.endsWith(".css")
                      ? "/* Write CSS styles here */"
                      : "// Write JavaScript code here"
                }
                style={{ 
                  fontFamily: "var(--font-mono)",
                  fontSize: "14px",
                  lineHeight: "24px",
                  tabSize: 2,
                  WebkitTextFillColor: "inherit"
                }}
              />
            </div>
          </div>
        </div>

        {/* Live Output Preview Container */}
        <div 
          className={`flex-1 flex-col bg-white overflow-hidden relative md:flex ${
            activeMobileView === "output" ? "flex" : "hidden"
          } ${
            layout === "side" ? "w-full md:w-1/2" : "w-full md:h-1/2"
          }`}
        >
          {/* Output Preview Toolbar Header */}
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

          {/* Iframe Preview Container */}
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

          {/* Dev Console Container */}
          {isConsoleOpen && (
            <div className="h-44 border-t border-[var(--border-color)] bg-[#0f172a] text-[#f8fafc] flex flex-col shrink-0">
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
                            ? "text-[#f59e0b]" 
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

      {/* Add File Modal */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsAddModalOpen(false)}
        >
          <form 
            onSubmit={handleCreateFile}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl p-5 border border-[#2b2d35] bg-[#1a1b21] shadow-2xl text-white space-y-4 font-sans"
          >
            <h3 className="text-sm font-semibold text-slate-200">Create New File</h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">File Name</label>
              <input
                required
                type="text"
                value={newFileName}
                onChange={(e) => handleNewFileNameChange(e.target.value)}
                placeholder="e.g. about.html, styles.css"
                className="w-full px-3 py-2 rounded-lg bg-[#2b2d35] border border-slate-700 outline-none text-xs text-white placeholder-slate-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">File Type</label>
              <select
                value={newFileType}
                onChange={(e) => setNewFileType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-[#2b2d35] border border-slate-700 outline-none text-xs text-white focus:border-blue-500 cursor-pointer"
              >
                <option value="html">HTML File (.html)</option>
                <option value="css">CSS Stylesheet (.css)</option>
                <option value="js">JavaScript Script (.js)</option>
              </select>
            </div>

            <div className="flex gap-2 justify-end pt-2 text-xs">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border border-slate-700 hover:bg-[#2b2d35] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>

      {!isFullscreen && (
        <div className="bg-[var(--bg-surface)] border-t border-[var(--border-color)]">
          <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
                Online HTML, CSS, and JavaScript Playground Compiler
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Welcome to LearnoBoy's interactive front-end coding playground. This web sandbox is designed for developers, students, and educators to write, compile, and preview client-side code in real-time. Whether you are practicing HTML tags, learning CSS styling, or testing interactive JavaScript events, this tool provides a live, zero-setup programming workspace right in your browser.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-3">
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  🚀 Dynamic Multi-File Support
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Unlike simple static compilers, our playground offers a multi-file tabs interface. You can create multiple HTML pages, custom style sheets, and scripts by clicking the <span className="font-semibold text-blue-500 font-mono">+</span> button. This enables designing complex web applications with modular code architectures.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  🔗 Manual Asset Linking & Control
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Get full control over how your files connect. To style your pages or run logic, link your custom CSS and JS files using standard HTML tags:
                  <code className="block mt-2 p-2 bg-[#121316] rounded border border-[#2b2d35] text-[10px] text-orange-400 font-mono">
                    &lt;link rel="stylesheet" href="styles.css"&gt;<br />
                    &lt;script src="script.js"&gt;&lt;/script&gt;
                  </code>
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  💬 Real-Time Console Stream
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Debug your Javascript instantly. The embedded Developer Console logs console output, warnings, errors, and system events. This allows you to track code execution and inspect variables on the fly, just like your browser's inspect element tool.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  💻 Responsive & Mobile IDE
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Write code anywhere. Our compiler is fully responsive and switches to an optimized mobile IDE viewport on smaller screens, featuring scrollable file tabs, overlay action dropdowns, and switchable Code vs Output tabs.
                </p>
              </div>
            </div>

            <div className="border-t border-[var(--border-color)] pt-8 space-y-6">
              <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                Frequently Asked Questions (FAQs)
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                    Q: Do I need to pay or install anything to use this compiler?
                  </h4>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    A: No, LearnoBoy Sandbox is 100% free, runs completely client-side in your web browser, and does not require any third-party plugins, downloads, or local setup.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                    Q: How do I link stylesheets and javascripts to my HTML files?
                  </h4>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    A: Insert the stylesheet link tag in the head of your HTML (e.g. <code>&lt;link rel="stylesheet" href="styles.css"&gt;</code>) and script source tag before the body closes (e.g. <code>&lt;script src="script.js"&gt;&lt;/script&gt;</code>).
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                    Q: Can I share my project with others?
                  </h4>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    A: Yes! Simply copy the combined code or download the files.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
