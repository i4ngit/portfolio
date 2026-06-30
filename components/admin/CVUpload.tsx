"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, CheckCircle2, AlertCircle, FileText } from "lucide-react";

interface CVUploadProps {
  currentUrl: string;
  onUploaded: (url: string) => void;
}

type UploadState = "idle" | "uploading" | "done" | "error" | "redis_not_configured";

export default function CVUpload({ currentUrl, onUploaded }: CVUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const isApiCV = currentUrl === "/api/cv";

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      setUploadState("error");
      setTimeout(() => setUploadState("idle"), 4000);
      return;
    }

    setUploadState("uploading");

    try {
      const dataUrl = await readAsDataURL(file);

      const res = await fetch("/api/upload/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataUrl }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setUploadState(
          json.error === "redis_not_configured" ? "redis_not_configured" : "error"
        );
        setTimeout(() => setUploadState("idle"), 6000);
        return;
      }

      onUploaded(json.url);
      setUploadState("done");
      setTimeout(() => setUploadState("idle"), 3000);
    } catch {
      setUploadState("error");
      setTimeout(() => setUploadState("idle"), 4000);
    }
  }

  return (
    <div>
      <label className="admin-label">CV / Resume</label>

      <div className="flex items-start gap-5">
        {/* Icon preview */}
        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
          {isApiCV ? (
            <FileText size={24} className="text-gray-500" />
          ) : (
            <FileText size={24} className="text-gray-300" />
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2.5 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploadState === "uploading"}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadState === "uploading" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : uploadState === "done" ? (
                <CheckCircle2 size={14} className="text-green-600" />
              ) : (
                <Upload size={14} />
              )}
              {uploadState === "uploading"
                ? "Uploading…"
                : uploadState === "done"
                ? "CV saved!"
                : "Upload PDF"}
            </button>

            {isApiCV && (
              <a
                href="/api/cv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-600 underline"
              >
                Preview
              </a>
            )}
          </div>

          <p className="text-xs text-muted">PDF only · max 10 MB</p>

          {isApiCV && uploadState === "idle" && (
            <p className="text-xs text-green-600">✓ CV uploaded and ready</p>
          )}

          {uploadState === "error" && (
            <p className="flex items-center gap-1.5 text-xs text-red-600">
              <AlertCircle size={12} /> Upload failed — PDF files only.
            </p>
          )}
          {uploadState === "redis_not_configured" && (
            <p className="flex items-center gap-1.5 text-xs text-amber-700 max-w-xs leading-relaxed">
              <AlertCircle size={12} className="flex-shrink-0" />
              Redis not connected. Connect Upstash in the{" "}
              <a
                href="https://vercel.com/i4ngits-projects/portfolio_website_ocampo/stores"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Vercel dashboard
              </a>
              .
            </p>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {/* URL fallback */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <label className="block text-xs text-muted mb-1.5">
          Or paste an external URL (Google Drive, Dropbox, etc.)
        </label>
        <input
          type="url"
          value={isApiCV ? "" : currentUrl}
          onChange={(e) => onUploaded(e.target.value)}
          placeholder="https://drive.google.com/file/d/..."
          className="admin-input text-sm"
        />
      </div>
    </div>
  );
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.readAsDataURL(file);
  });
}
