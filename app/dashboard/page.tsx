"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "../../utils/firebase";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/");
        return;
      }
      setUser(firebaseUser);
      setChecking(false);
    });
    return () => unsubscribe();
  }, [router]);

  async function handleSignOut() {
    await signOut(auth);
    router.replace("/");
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="font-serif text-ink-soft">Memuat…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper px-6 py-10 text-ink md:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <span className="font-display text-2xl italic tracking-tight text-ink">
          Margin
        </span>
        <div className="flex items-center gap-3">
          {user?.photoURL && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photoURL}
              alt=""
              className="h-9 w-9 rounded-full border border-paper-line"
            />
          )}
          <div className="text-right">
            <p className="font-sans text-sm font-medium">{user?.displayName}</p>
            <p className="font-sans text-xs text-ink-soft">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="ml-2 rounded-full border border-paper-line px-4 py-2 font-sans text-sm text-ink-soft transition-colors hover:text-ink"
          >
            Keluar
          </button>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-6xl">
        <h1 className="font-display text-3xl font-medium text-ink">
          Selamat datang, {user?.displayName?.split(" ")[0]}.
        </h1>
        <p className="mt-2 font-serif text-ink-soft">
          Belum ada buku yang kamu catat. Dashboard ini masih kerangka —
          bagian daftar buku, progres baca, dan klub akan menyusul.
        </p>
      </div>
    </main>
  );
}