"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, type User } from "firebase/auth";
import { auth } from "../utils/firebase";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/books", label: "Buku" },
  { href: "/clubs", label: "Klub" },
];

export default function AppNav({ user }: { user: User | null }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut(auth);
    router.replace("/");
  }

  return (
    <div className="mx-auto flex max-w-6xl items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="font-display text-2xl italic tracking-tight text-ink">
          Margin
        </Link>
        <nav className="hidden items-center gap-6 font-sans text-sm sm:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href
                  ? "font-medium text-ink"
                  : "text-ink-soft transition-colors hover:text-ink"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {user?.photoURL && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.photoURL}
            alt=""
            className="h-9 w-9 rounded-full border border-paper-line"
          />
        )}
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-full border border-paper-line px-4 py-2 font-sans text-sm text-ink-soft transition-colors hover:text-ink"
        >
          Keluar
        </button>
      </div>
    </div>
  );
}