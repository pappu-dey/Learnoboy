"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, ImageIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  /** Called with the Cloudinary URL after a successful upload */
  onUpload: (url: string) => void;
  /** Current URL (for displaying existing cover image) */
  currentUrl?: string;
  /** Label shown inside the drop zone */
  label?: string;
  /** Compact mode — smaller drop zone for inline use */
  compact?: boolean;
}

type UploadState = "idle" | "dragging" | "uploading" | "success" | "error";

export function ImageUploader({
  onUpload,
  currentUrl,
  label = "Drag & drop or click to upload",
  compact = false,
}: ImageUploaderProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(currentUrl || "");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      // Validate client-side first
      const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
      if (!allowed.includes(file.type)) {
        setErrorMsg("Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG");
        setState("error");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("File too large. Maximum size is 10MB.");
        setState("error");
        return;
      }

      // Show local preview immediately
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setState("uploading");
      setProgress(0);
      setErrorMsg("");

      // Fake smooth progress (real progress not easily available with fetch)
      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 85));
      }, 200);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        clearInterval(interval);

        if (!res.ok || !data.success) {
          setErrorMsg(data.error || "Upload failed");
          setState("error");
          setPreviewUrl(currentUrl || "");
          return;
        }

        setProgress(100);
        setPreviewUrl(data.url);
        onUpload(data.url);
        setState("success");

        // Revoke object URL
        URL.revokeObjectURL(objectUrl);
      } catch {
        clearInterval(interval);
        setErrorMsg("Network error. Please try again.");
        setState("error");
        setPreviewUrl(currentUrl || "");
      }
    },
    [onUpload, currentUrl]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState("idle");
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setState("dragging");
  };

  const handleDragLeave = () => {
    setState((s) => (s === "dragging" ? "idle" : s));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset input so same file can be re-uploaded
    e.target.value = "";
  };

  const clearImage = () => {
    setPreviewUrl("");
    onUpload("");
    setState("idle");
    setErrorMsg("");
  };

  const isDragging = state === "dragging";
  const isUploading = state === "uploading";

  return (
    <div className="w-full">
      {/* Preview */}
      {previewUrl && !isUploading && (
        <div className="relative mb-3 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full rounded-xl object-cover border border-[var(--border-color)]"
            style={{ maxHeight: compact ? "120px" : "200px" }}
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            title="Remove image"
          >
            <X size={13} />
          </button>
          {state === "success" && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/90 text-white text-xs font-medium backdrop-blur-sm">
              <CheckCircle size={11} />
              Uploaded
            </div>
          )}
        </div>
      )}

      {/* Upload zone */}
      {(!previewUrl || isUploading) && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && inputRef.current?.click()}
          className={[
            "relative flex flex-col items-center justify-center text-center cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200",
            compact ? "py-5 px-3" : "py-10 px-4",
            isDragging
              ? "border-[var(--link-color)] bg-blue-50 dark:bg-blue-950/30 scale-[1.01]"
              : isUploading
              ? "border-[var(--border-color)] bg-[var(--bg-muted)] cursor-not-allowed"
              : "border-[var(--border-color)] bg-[var(--bg-base)] hover:border-[var(--link-color)] hover:bg-[var(--bg-muted)]",
          ].join(" ")}
        >
          {isUploading ? (
            <div className="w-full max-w-xs mx-auto">
              <Loader2 size={compact ? 20 : 28} className="mx-auto mb-2 animate-spin" style={{ color: "var(--link-color)" }} />
              <p className="text-sm text-[var(--text-secondary)] mb-2">Uploading…</p>
              <div className="w-full h-1.5 rounded-full bg-[var(--border-color)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{ width: `${progress}%`, background: "var(--link-color)" }}
                />
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">{progress}%</p>
            </div>
          ) : (
            <>
              <div
                className={[
                  "rounded-xl flex items-center justify-center mb-3",
                  compact ? "w-8 h-8" : "w-12 h-12",
                ].join(" ")}
                style={{ background: isDragging ? "var(--link-color)" : "var(--bg-muted)" }}
              >
                {isDragging ? (
                  <Upload size={compact ? 16 : 22} className="text-white" />
                ) : (
                  <ImageIcon size={compact ? 16 : 22} style={{ color: "var(--text-tertiary)" }} />
                )}
              </div>
              <p className={["font-medium text-[var(--text-primary)]", compact ? "text-xs" : "text-sm"].join(" ")}>
                {isDragging ? "Drop to upload!" : label}
              </p>
              {!compact && (
                <p className="text-xs text-[var(--text-tertiary)] mt-1">
                  JPEG, PNG, WebP, GIF, SVG · Max 10 MB
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Change image button (when preview exists and not uploading) */}
      {previewUrl && !isUploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 w-full py-1.5 rounded-lg border border-[var(--border-color)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors flex items-center justify-center gap-1.5"
        >
          <Upload size={11} />
          Change image
        </button>
      )}

      {/* Error message */}
      {state === "error" && errorMsg && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
          <AlertCircle size={12} />
          {errorMsg}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
}
