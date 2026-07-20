"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthUser } from "../../hooks/use-auth-user";
import AppNav from "../../components/app-nav";
import { subscribeToBooks } from "../../utils/books";
import type { Book } from "../../types/firestore";

export default function DashboardPage() {
  const { user, loading } = useAuthUser();
  const [books, setBooks] = useState<Book[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToBooks(user.uid, setBooks);
    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="font-serif text-ink-soft">Memuat…</p>
      </main>
    );
  }

  const reading = (books ?? []).filter((b) => b.status === "sedang-dibaca");

  return (
    <main className="min-h-screen bg-paper px-6 py-6 text-ink md:px-10">
      <AppNav user={user} />

      <div className="mx-auto mt-14 max-w-6xl">
        <h1 className="font-display text-3xl font-medium text-ink">
          Selamat datang, {user?.displayName?.split(" ")[0]}.
        </h1>

        {books === null ? (
          <p className="mt-4 font-serif text-ink-soft">Memuat buku…</p>
        ) : books.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-paper-line bg-paper-dim/40 px-8 py-12 text-center">
            <p className="font-serif text-ink-soft">
              Belum ada buku yang kamu catat.
            </p>
            <Link
              href="/books"
              className="mt-5 inline-block rounded-full bg-moss px-6 py-2.5 font-sans text-sm font-medium text-paper transition-colors hover:bg-moss-dark"
            >
              Tambah buku pertamamu
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-medium text-ink">
                Sedang dibaca
              </h2>
              <Link
                href="/books"
                className="font-sans text-sm text-ink-soft hover:text-ink"
              >
                Lihat semua buku →
              </Link>
            </div>

            {reading.length === 0 ? (
              <p className="mt-3 font-serif text-ink-soft">
                Gak ada buku yang lagi kamu baca sekarang.
              </p>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reading.map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    className="rounded-xl border border-paper-line bg-paper p-5 transition-shadow hover:shadow-sm"
                  >
                    <p className="font-display text-lg text-ink">{book.title}</p>
                    <p className="mt-1 font-sans text-sm text-ink-soft">
                      {book.author}
                    </p>
                    {book.totalPages ? (
                      <p className="mt-3 font-sans text-xs text-ink-soft">
                        hlm. {book.currentPage ?? 0}/{book.totalPages}
                      </p>
                    ) : null}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}