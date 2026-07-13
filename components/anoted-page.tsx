const STAR_PATH =
  "M10 0 L12.9 6.9 L20 7.6 L14.5 12.6 L16.2 19.5 L10 15.8 L3.8 19.5 L5.5 12.6 L0 7.6 L7.1 6.9 Z";

const RATING = [true, true, true, true, false];

export default function AnnotatedPage() {
  return (
    <div className="relative mx-auto w-full max-w-sm -rotate-1 lg:mx-0">
      <div className="overflow-hidden rounded-2xl shadow-[0_30px_60px_-25px_rgba(36,33,28,0.35)]">
        <svg
          viewBox="0 0 440 560"
          role="img"
          aria-label="Contoh halaman buku dengan catatan pinggir, garis bawah pensil, dan rating bintang"
          className="block w-full"
        >
          <rect width="440" height="560" fill="var(--color-paper-dim)" />

          {/* folded corner */}
          <path d="M396 0 L440 0 L440 44 Z" fill="var(--color-paper-line)" />
          <path
            d="M396 0 L440 44"
            stroke="var(--color-ink-soft)"
            strokeOpacity="0.25"
            strokeWidth="1"
          />

          {/* chapter label */}
          <text
            x="32"
            y="52"
            fontFamily="var(--font-sans)"
            fontSize="12"
            letterSpacing="2"
            fill="var(--color-ink-soft)"
          >
            BAB 3 — HUJAN YANG SAMA
          </text>
          <line
            x1="32"
            y1="66"
            x2="200"
            y2="66"
            stroke="var(--color-paper-line)"
            strokeWidth="1.5"
          />

          {/* body text */}
          <g fontFamily="var(--font-serif)" fontSize="21" fill="var(--color-ink)">
            <text x="32" y="112">
              Ia menutup buku sebentar, membiarkan
            </text>
            <text x="32" y="146">
              hujan menyelesaikan kalimat yang tadi
            </text>
            <text x="32" y="180">
              terputus. Ada jeda yang hanya dimengerti
            </text>
            <text x="32" y="214">
              oleh pembaca yang pernah menunggu
            </text>
            <text x="32" y="248">
              seseorang datang sambil membawa cerita
            </text>
            <text x="32" y="282">
              yang sama, dari arah yang berbeda.
            </text>
          </g>

          {/* pencil underlines, drawn in on load */}
          <path
            d="M120 190 Q 200 198 262 190"
            fill="none"
            stroke="var(--color-pencil)"
            strokeWidth="3"
            strokeLinecap="round"
            className="stroke-draw"
            style={{ strokeDasharray: 220, strokeDashoffset: 220, animationDelay: "0.3s" }}
          />
          <path
            d="M140 292 Q 210 300 280 291"
            fill="none"
            stroke="var(--color-pencil)"
            strokeWidth="3"
            strokeLinecap="round"
            className="stroke-draw"
            style={{ strokeDasharray: 220, strokeDashoffset: 220, animationDelay: "0.6s" }}
          />

          {/* connector to margin note */}
          <path
            d="M262 186 C 296 172, 314 166, 328 168"
            fill="none"
            stroke="var(--color-ink-soft)"
            strokeOpacity="0.5"
            strokeWidth="1.2"
            strokeDasharray="3 4"
            className="stroke-draw"
            style={{ strokeDasharray: 60, strokeDashoffset: 60, animationDelay: "0.9s" }}
          />

          {/* handwritten margin note */}
          <g
            className="pin-drop"
            style={{ animationDelay: "1s", opacity: 0, transformOrigin: "330px 150px" }}
          >
            <text
              x="328"
              y="158"
              fontFamily="var(--font-hand)"
              fontSize="23"
              fill="var(--color-pencil)"
              transform="rotate(-6 330 150)"
            >
              ini juga yang
            </text>
            <text
              x="320"
              y="184"
              fontFamily="var(--font-hand)"
              fontSize="23"
              fill="var(--color-pencil)"
              transform="rotate(-6 330 150)"
            >
              aku rasain.
            </text>
          </g>

          <line
            x1="32"
            y1="330"
            x2="408"
            y2="330"
            stroke="var(--color-paper-line)"
            strokeWidth="1.5"
          />

          {/* rating */}
          <text
            x="32"
            y="366"
            fontFamily="var(--font-sans)"
            fontSize="13"
            fill="var(--color-ink-soft)"
          >
            Ratingmu
          </text>
          <g transform="translate(32, 380)">
            {RATING.map((filled, i) => (
              <path
                key={i}
                d={STAR_PATH}
                transform={`translate(${i * 28}, 0)`}
                fill={filled ? "var(--color-pencil)" : "none"}
                stroke="var(--color-pencil)"
                strokeWidth="1.3"
              />
            ))}
          </g>

          <text
            x="32"
            y="440"
            fontFamily="var(--font-hand)"
            fontSize="21"
            fill="var(--color-ink-soft)"
            transform="rotate(-2 32 440)"
          >
            buku ini beneran bikin nangis.
          </text>

          {/* reading-status chip */}
          <rect x="32" y="472" width="216" height="30" rx="15" fill="var(--color-moss)" opacity="0.1" />
          <text
            x="48"
            y="491"
            fontFamily="var(--font-sans)"
            fontSize="12"
            fill="var(--color-moss-dark)"
          >
            ● Sedang dibaca — hlm. 132/288
          </text>
        </svg>
      </div>
    </div>
  );
}