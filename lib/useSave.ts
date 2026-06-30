"use client";

import { useState, useCallback } from "react";

type SaveState = "idle" | "saving" | "saved" | "error" | "redis_not_configured";

export function useSave(section: string) {
  const [state, setState] = useState<SaveState>("idle");

  const save = useCallback(
    async (data: unknown): Promise<boolean> => {
      setState("saving");
      try {
        const res = await fetch(`/api/content/${section}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          setState(
            json.error === "redis_not_configured"
              ? "redis_not_configured"
              : "error"
          );
          setTimeout(() => setState("idle"), 6000);
          return false;
        }
        setState("saved");
        setTimeout(() => setState("idle"), 2500);
        return true;
      } catch {
        setState("error");
        setTimeout(() => setState("idle"), 4000);
        return false;
      }
    },
    [section]
  );

  return { save, state };
}
