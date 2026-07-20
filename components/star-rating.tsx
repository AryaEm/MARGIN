"use client";

const STAR_PATH =
  "M10 0 L12.9 6.9 L20 7.6 L14.5 12.6 L16.2 19.5 L10 15.8 L3.8 19.5 L5.5 12.6 L0 7.6 L7.1 6.9 Z";

export default function StarRating({
  rating,
  onChange,
  size = 24,
}: {
  rating: number;
  onChange?: (rating: number) => void;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n === rating ? 0 : n)}
          aria-label={`Kasih rating ${n} dari 5`}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <svg width={size} height={size} viewBox="0 0 20 20">
            <path
              d={STAR_PATH}
              fill={n <= rating ? "var(--color-pencil)" : "none"}
              stroke="var(--color-pencil)"
              strokeWidth="1.3"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}