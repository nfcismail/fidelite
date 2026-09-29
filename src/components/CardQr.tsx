"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function CardQr({ cardId, size = 180 }: { cardId: string; size?: number }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const url = `${base}/c/${cardId}`;
    QRCode.toDataURL(url, {
      width: size,
      margin: 1,
      color: { dark: "#3D2314", light: "#F7F0E8" },
    }).then(setSrc);
  }, [cardId, size]);

  if (!src) {
    return (
      <div
        className="animate-pulse rounded-xl bg-[#EFE4D6]"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`QR carte ${cardId}`}
      width={size}
      height={size}
      className="rounded-xl"
    />
  );
}
