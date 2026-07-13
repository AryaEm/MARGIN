import Link from "next/link";
import GoogleLoginButton from "../google-login-button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-paper-line/80 bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link
          href="/"
          className="font-display text-2xl italic tracking-tight text-ink"
        >
          Margin
        </Link>

        <div className="hidden items-center gap-8 font-sans text-sm text-ink-soft md:flex">
          <a href="#fitur" className="transition-colors hover:text-ink">
            Fitur
          </a>
          <a href="#klub" className="transition-colors hover:text-ink">
            Klub
          </a>
          <a href="#mulai" className="transition-colors hover:text-ink">
            Mulai
          </a>
        </div>

        <div className="flex items-center gap-3">
          <GoogleLoginButton className="rounded-full bg-moss px-4 py-2 font-sans text-sm font-medium text-paper transition-colors hover:bg-moss-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss disabled:opacity-60">
            Login
          </GoogleLoginButton>
        </div>
      </nav>
    </header>
  );
}