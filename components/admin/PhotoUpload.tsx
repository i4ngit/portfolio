"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface PhotoUploadProps {
  currentUrl: string;
  onUploaded: (url: string) => void;
}

type UploadState = "idle" | "uploading" | "done" | "error" | "redis_not_configured";

export default function PhotoUpload({ currentUrl, onUploaded }: PhotoUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const isApiPhoto = currentUrl.startsWith("/api/photo/");

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setUploadState("error");
      return;
    }
    setUploadState("uploading");

    try {
      const resized = await resizeImage(file, 500, 500);

      const res = await fetch("/api/upload/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: resized, name: "headshot" }),
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
      <label className="admin-label">Profile Photo</label>

      <div className="flex items-start gap-5">
        {/* Live preview */}
        <div className="flex-shrink-0 w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-border ring-2 ring-white shadow-sm">
          {currentUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-muted text-center leading-tight px-2">
              No photo
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploadState === "uploading"}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-white text-sm text-slate-text hover:border-navy hover:text-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              ? "Photo saved!"
              : "Upload headshot"}
          </button>

          <p className="text-xs text-muted">
            JPEG, PNG, or WEBP · max 10 MB · automatically resized to fit
          </p>

          {uploadState === "error" && (
            <p className="flex items-center gap-1.5 text-xs text-red-600">
              <AlertCircle size={12} /> Upload failed — please try again.
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
              </a>{" "}
              first.
            </p>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {/* URL fallback */}
      <div className="mt-4 pt-4 border-t border-border">
        <label className="block text-xs text-muted mb-1.5">
          Or paste a photo URL instead of uploading
        </label>
        <input
          type="url"
          value={isApiPhoto ? "" : currentUrl}
          onChange={(e) => onUploaded(e.target.value)}
          placeholder="https://example.com/your-photo.jpg"
          className="admin-input text-sm"
        />
        {isApiPhoto && (
          <p className="text-xs text-green-600 mt-1">
            ✓ Using your uploaded photo
          </p>
        )}
      </div>
    </div>
  );
}

function resizeImage(file: File, maxW: number, maxH: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = reject;
      img.onload = () => {
        const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas unavailable"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
