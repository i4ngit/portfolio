"use client";

import { AlertTriangle, CheckCircle2, Loader2, Database } from "lucide-react";

type SaveState = "idle" | "saving" | "saved" | "error" | "redis_not_configured";

interface SaveBarProps {
  state: SaveState;
  label?: string;
}

export default function SaveBar({ state, label = "Save Changes" }: SaveBarProps) {
  return (
    <div className="flex items-center gap-3 pt-3 border-t border-border">
      <button
        type="submit"
        disabled={state === "saving"}
        className="btn-primary inline-flex items-center gap-2"
      >
        {state === "saving" && <Loader2 size={14} className="animate-spin" />}
        {state === "saving" ? "Saving…" : label}
      </button>

      {state === "saved" && (
        <span className="flex items-center gap-1.5 text-sm text-green-accent font-medium">
          <CheckCircle2 size={15} /> Saved
        </span>
      )}

      {state === "error" && (
        <span className="flex items-center gap-1.5 text-sm text-red-600 font-medium">
          <AlertTriangle size={15} /> Save failed — please try again.
        </span>
      )}

      {state === "redis_not_configured" && (
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 max-w-md">
          <Database size={14} className="flex-shrink-0 mt-0.5 text-amber-600" />
          <span>
            <strong>Redis not connected.</strong> Changes can&apos;t be saved yet.{" "}
            <a
              href="https://vercel.com/i4ngits-projects/portfolio_website_ocampo/stores"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-900"
            >
              Connect Upstash Redis in Vercel →
            </a>
          </span>
        </div>
      )}
    </div>
  );
}
