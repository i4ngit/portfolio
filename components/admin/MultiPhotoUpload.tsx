"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, X, AlertCircle } from "lucide-react";

interface MultiPhotoUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  namePrefix: string;
}

type UploadState = "idle" | "uploading" | "error" | "redis_not_configured";

export default function MultiPhotoUpload({ images, onChange, namePrefix }: MultiPhotoUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setUploadState("uploading");
    const uploaded: string[] = [];

    try {
      for (const file of imageFiles) {
        const resized = await resizeImage(file, 1600, 1600);
        const name = `${namePrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

        const res = await fetch("/api/upload/photo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: resized, name }),
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          setUploadState(
            json.error === "redis_not_configured" ? "redis_not_configured" : "error"
          );
          setTimeout(() => setUploadState("idle"), 6000);
          if (uploaded.length > 0) onChange([...images, ...uploaded]);
          return;
        }

        uploaded.push(json.url);
      }

      onChange([...images, ...uploaded]);
      setUploadState("idle");
    } catch {
      setUploadState("error");
      setTimeout(() => setUploadState("idle"), 4000);
      if (uploaded.length > 0) onChange([...images, ...uploaded]);
    }
  }

  function removeImage(url: string) {
    onChange(images.filter((img) => img !== url));
  }

  return (
    <div>
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
          {images.map((url) => (
            <div key={url} className="relative aspect-square rounded-md overflow-hidden bg-gray-100 border border-gray-200 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploadState === "uploading"}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploadState === "uploading" ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Upload size={14} />
        )}
        {uploadState === "uploading" ? "Uploading…" : "Upload photos"}
      </button>

      <p className="text-xs text-muted mt-2">
        JPEG, PNG, or WEBP · select multiple · automatically resized
      </p>

      {uploadState === "error" && (
        <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1">
          <AlertCircle size={12} /> Upload failed — please try again.
        </p>
      )}
      {uploadState === "redis_not_configured" && (
        <p className="flex items-center gap-1.5 text-xs text-amber-700 max-w-xs leading-relaxed mt-1">
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

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
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
