"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onScan: (value: string) => void;
  active: boolean;
};

export function QrScanner({ onScan, active }: Props) {
  const regionId = "moka-qr-reader";
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<{
    stop: () => Promise<void>;
    clear: () => void;
  } | null>(null);
  const lastRef = useRef("");

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    async function start() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;
        const scanner = new Html5Qrcode(regionId);
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 8, qrbox: { width: 220, height: 220 } },
          (decoded) => {
            let value = decoded.trim();
            try {
              const url = new URL(decoded);
              const parts = url.pathname.split("/");
              const idx = parts.findIndex((p) => p === "c");
              if (idx >= 0 && parts[idx + 1]) value = parts[idx + 1];
            } catch {
              /* plain card id */
            }
            if (value === lastRef.current) return;
            lastRef.current = value;
            onScan(value);
            setTimeout(() => {
              lastRef.current = "";
            }, 2500);
          },
          () => undefined
        );
      } catch {
        setError("Caméra indisponible — utilisez la recherche.");
      }
    }

    start();

    return () => {
      cancelled = true;
      const s = scannerRef.current;
      scannerRef.current = null;
      if (s) {
        s.stop()
          .catch(() => undefined)
          .finally(() => {
            try {
              s.clear();
            } catch {
              /* ignore */
            }
          });
      }
    };
  }, [active, onScan]);

  return (
    <div className="overflow-hidden rounded-2xl bg-black/90">
      <div id={regionId} className="min-h-[220px] w-full" />
      {error && (
        <p className="bg-[#3D2314] px-3 py-2 text-center text-sm text-[#F7F0E8]">
          {error}
        </p>
      )}
    </div>
  );
}
