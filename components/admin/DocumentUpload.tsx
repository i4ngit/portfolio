"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, FileText, AlertCircle, CheckCircle2 } from "lucide-react";

interface DocumentUploadProps {
  currentUrl: string;
  onUploaded: (url: string) => void;
  docName: string;
  label?: string;
}

type UploadState = "idle" | "uploading" | "done" | "error" | "redis_not_configured";

export default function DocumentUpload({ currentUrl, onUploaded, docName, label = "Project PDF" }: DocumentUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const isApiDoc = currentUrl.startsWith("/api/document/");

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      setUploadState("error");
      setTimeout(() => setUploadState("idle"), 4000);
      return;
    }
    setUploadState("uploading");
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/upload/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataUrl, name: docName }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setUploadState(json.error === "redis_not_configured" ? "redis_not_configured" : "error");
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
      <label className="admin-label">{label}</label>
      <div className="flex items-center gap-3">
        {isApiDoc && (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FileText size={13} /> View uploaded PDF
          </a>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadState === "uploading"}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploadState === "uploading" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : uploadState === "done" ? (
            <CheckCircle2 size={14} className="text-gray-600" />
          ) : (
            <Upload size={14} />
          )}
          {uploadState === "uploading" ? "Uploading…" : uploadState === "done" ? "PDF saved!" : isApiDoc ? "Replace PDF" : "Upload PDF"}
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-1.5">PDF only · opens in browser for visitors</p>

      {uploadState === "error" && (
        <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1">
          <AlertCircle size={12} /> Upload failed — PDF files only.
        </p>
      )}
      {uploadState === "redis_not_configured" && (
        <p className="flex items-center gap-1.5 text-xs text-amber-700 mt-1">
          <AlertCircle size={12} className="flex-shrink-0" /> Redis not connected.
        </p>
      )}

      {!isApiDoc && (
        <div className="mt-3">
          <label className="block text-xs text-gray-400 mb-1">Or paste an external PDF URL</label>
          <input
            type="url"
            value={currentUrl}
            onChange={(e) => onUploaded(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="admin-input text-sm"
          />
        </div>
      )}

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
    </div>
  );
}
