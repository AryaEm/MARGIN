"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuthUser } from "../../hooks/use-auth-user";
import AppNav from "../../components/app-nav";
import { addBook, deleteBook, setBookStatus, subscribeToBooks } from "../../utils/books";
import type { Book, BookStatus } from "../../types/firestore";

const COLUMNS: { status: BookStatus; label: string; accent: string }[] = [
  { status: "mau-dibaca", label: "Mau Dibaca", accent: "bg-gilt" },
  { status: "sedang-dibaca", label: "Sedang Dibaca", accent: "bg-moss" },
  { status: "selesai", label: "Selesai", accent: "bg-pencil" },
];

export default function BooksPage() {
  const { user, loading } = useAuthUser();
  const [books, setBooks] = useState<Book[] | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToBooks(user.uid, setBooks);
    return () => unsubscribe();
  }, [user]);

  async function handleAddBook(e: FormEvent) {
    e.preventDefault();
    if (!user || !title.trim() || !author.trim()) return;

    setSubmitting(true);
    try {
      await addBook(user.uid, {
        title: title.trim(),
        author: author.trim(),
        status: "mau-dibaca",
        ...(totalPages ? { totalPages: Number(totalPages) } : {}),
      });
      setTitle("");
      setAuthor("");
      setTotalPages("");
      setFormOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(bookId: string, status: BookStatus) {
    if (!user) return;
    await setBookStatus(user.uid, bookId, status);
  }

  async function handleDelete(bookId: string) {
    if (!user) return;
    if (!window.confirm("Hapus buku ini dari catatanmu?")) return;
    await deleteBook(user.uid, bookId);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="font-serif text-ink-soft">Memuat…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper px-6 py-6 text-ink md:px-10">
      <AppNav user={user} />

      <div className="mx-auto mt-14 max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-medium text-ink">Buku</h1>
          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            className="rounded-full bg-moss px-5 py-2.5 font-sans text-sm font-medium text-paper transition-colors hover:bg-moss-dark"
          >
            {formOpen ? "Batal" : "+ Tambah buku"}
          </button>
        </div>

        {formOpen && (
          <form
            onSubmit={handleAddBook}
            className="mt-6 grid gap-4 rounded-2xl border border-paper-line bg-paper-dim/40 p-6 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <label className="font-sans text-xs text-ink-soft" htmlFor="title">
                Judul buku
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-paper-line bg-paper px-3 py-2 font-serif text-ink focus:outline-none focus:ring-2 focus:ring-moss"
                placeholder="Laut Bercerita"
              />
            </div>
            <div>
              <label className="font-sans text-xs text-ink-soft" htmlFor="author">
                Penulis
              </label>
              <input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-paper-line bg-paper px-3 py-2 font-serif text-ink focus:outline-none focus:ring-2 focus:ring-moss"
                placeholder="Leila S. Chudori"
              />
            </div>
            <div>
              <label className="font-sans text-xs text-ink-soft" htmlFor="totalPages">
                Jumlah halaman (opsional)
              </label>
              <input
                id="totalPages"
                type="number"
                min={1}
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                className="mt-1 w-full rounded-lg border border-paper-line bg-paper px-3 py-2 font-serif text-ink focus:outline-none focus:ring-2 focus:ring-moss"
                placeholder="384"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-moss px-6 py-2.5 font-sans text-sm font-medium text-paper transition-colors hover:bg-moss-dark disabled:opacity-60"
              >
                {submitting ? "Menyimpan..." : "Simpan buku"}
              </button>
            </div>
          </form>
        )}

        {books === null ? (
          <p className="mt-8 font-serif text-ink-soft">Memuat buku…</p>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {COLUMNS.map((col) => {
              const items = books.filter((b) => b.status === col.status);
              return (
                <div key={col.status}>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${col.accent}`} />
                    <h2 className="font-sans text-sm font-medium uppercase tracking-wide text-ink-soft">
                      {col.label} · {items.length}
                    </h2>
                  </div>

                  <div className="mt-3 space-y-3">
                    {items.length === 0 && (
                      <p className="font-serif text-sm text-ink-soft">
                        Belum ada buku di sini.
                      </p>
                    )}
                    {items.map((book) => (
                      <div
                        key={book.id}
                        className="rounded-xl border border-paper-line bg-paper p-4"
                      >
                        <Link href={`/books/${book.id}`} className="block">
                          <p className="font-display text-lg leading-snug text-ink hover:underline">
                            {book.title}
                          </p>
                          <p className="mt-1 font-sans text-sm text-ink-soft">
                            {book.author}
                          </p>
                        </Link>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <select
                            value={book.status}
                            onChange={(e) =>
                              handleStatusChange(book.id, e.target.value as BookStatus)
                            }
                            className="rounded-lg border border-paper-line bg-paper-dim/40 px-2 py-1 font-sans text-xs text-ink-soft"
                          >
                            {COLUMNS.map((c) => (
                              <option key={c.status} value={c.status}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleDelete(book.id)}
                            className="font-sans text-xs text-pencil hover:underline"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}