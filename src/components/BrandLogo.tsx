import Image from "next/image";
import Link from "next/link";

type Props = {
  href?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  invert?: boolean;
  className?: string;
};

const sizes = {
  sm: { box: 36, img: 28, text: "text-lg" },
  md: { box: 44, img: 34, text: "text-xl" },
  lg: { box: 64, img: 52, text: "text-2xl" },
};

export function BrandLogo({
  href = "/",
  size = "md",
  showWordmark = true,
  invert = false,
  className = "",
}: Props) {
  const s = sizes[size];
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm ${
          invert ? "bg-[#F7F0E8]/15 ring-1 ring-white/25" : "bg-[var(--primary)] ring-1 ring-[var(--primary)]/20"
        }`}
        style={{ width: s.box, height: s.box }}
      >
        <Image
          src="/moka-joy-logo.png"
          alt="Moka Joy"
          width={s.img}
          height={s.img}
          className="object-contain"
          priority
        />
      </span>
      {showWordmark && (
        <span
          className={`font-display font-semibold tracking-tight ${s.text} ${
            invert ? "text-[#F7F0E8]" : "text-[var(--primary)]"
          }`}
        >
          Moka Joy
        </span>
      )}
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="transition hover:opacity-90">
      {content}
    </Link>
  );
}

export function LoginIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}
