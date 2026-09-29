export function StampGrid({
  stamps,
  required,
}: {
  stamps: number;
  required: number;
}) {
  const slots = Math.max(required, 1);
  const filled = Math.min(stamps, slots);

  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${Math.min(slots, 5)}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: slots }).map((_, i) => {
        const on = i < filled;
        return (
          <div
            key={i}
            className={`flex aspect-square items-center justify-center rounded-full border-2 transition ${
              on
                ? "animate-stamp border-[var(--accent)] bg-[var(--accent)] text-[#F7F0E8]"
                : "border-[#D4C4B0] bg-transparent text-transparent"
            }`}
          >
            <span className="text-lg font-semibold">●</span>
          </div>
        );
      })}
    </div>
  );
}
