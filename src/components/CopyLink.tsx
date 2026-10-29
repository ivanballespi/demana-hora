"use client";

import { useState } from "react";

export function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input readOnly value={url} className="input font-mono text-xs" onFocus={(e) => e.target.select()} />
      <div className="flex gap-2">
        <button
          type="button"
          className="btn-dark whitespace-nowrap"
          onClick={async () => {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? "Copiat ✓" : "Copiar"}
        </button>
        <a className="btn-ghost whitespace-nowrap" href={url} target="_blank" rel="noreferrer">Obrir</a>
      </div>
    </div>
  );
}
