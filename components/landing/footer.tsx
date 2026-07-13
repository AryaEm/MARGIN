import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-sans text-sm text-ink-soft sm:flex-row">
        <Link href="/" className="font-display text-lg italic text-ink">
          Margin
        </Link>
        <p>Dibuat untuk pembaca yang suka mencoret pinggir halaman.</p>
        <p>&copy; {new Date().getFullYear()} Margin.</p>
      </div>
    </footer>
  );
}