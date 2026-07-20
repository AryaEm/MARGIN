"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuthUser } from "../../../hooks/use-auth-user";
import AppNav from "../../../components/app-nav";
import StarRating from "../../../components/star-rating";
import { deleteBook, subscribeToBook, updateBook } from "../../../utils/books";
import type { Book, BookStatus } from "../../../types/firestore";

const STATUS_LABEL: Record<BookStatus, string> = {
  "mau-dibaca": "Mau Dibaca",
  "sedang-dibaca": "Sedang Dibaca",
  selesai: "Selesai",
};

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading } = useAuthUser();

  const [book, setBook] = useState<Book | null | undefined>(undefined);
  const [notesDraft, setNotesDraft] = useState("");
  const [pageDraft, setPageDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingPage, setSavingPage] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToBook(user.uid, id, setBook);
    return () => unsubscribe();
  }, [user, id]);

  // Seed draft cuma sekali per buku, biar gak nimpa ketikan user
  // tiap kali snapshot Firestore lewat.
  useEffect(() => {
    if (book) {
      setNotesDraft(book.notes ?? "");
      setPageDraft(book.currentPage ? String(book.currentPage) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book?.id]);

  if (loading || book === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="font-serif text-ink-soft">Memuat…</p>
      </main>
    );
  }

  if (book === null) {
    return (
      <main className="min-h-screen bg-paper px-6 py-6 text-ink md:px-10">
        <AppNav user={user} />
        <div className="mx-auto mt-14 max-w-3xl text-center">
          <p className="font-serif text-ink-soft">
            Buku ini gak ketemu — mungkin sudah dihapus.
          </p>
          <Link
            href="/books"
            className="mt-4 inline-block font-sans text-sm text-moss hover:underline"
          >
            ← Kembali ke daftar buku
          </Link>
        </div>
      </main>
    );
  }

  async function handleRatingChange(rating: number) {
    if (!user) return;
    await updateBook(user.uid, book!.id, { rating });
  }

  async function handleStatusChange(status: BookStatus) {
    if (!user) return;
    await updateBook(user.uid, book!.id, { status });
  }

  async function handleSaveNotes() {
    if (!user) return;
    setSavingNotes(true);
    try {
      await updateBook(user.uid, book!.id, { notes: notesDraft });
    } finally {
      setSavingNotes(false);
    }
  }

  async function handleSavePage() {
    if (!user) return;
    const parsed = Number(pageDraft);
    if (Number.isNaN(parsed) || parsed < 0) return;
    setSavingPage(true);
    try {
      await updateBook(user.uid, book!.id, { currentPage: parsed });
    } finally {
      setSavingPage(false);
    }
  }

  async function handleDelete() {
    if (!user) return;
    if (!window.confirm(`Hapus "${book!.title}" dari catatanmu?`)) return;
    await deleteBook(user.uid, book!.id);
    router.push("/books");
  }

  const progressPct =
    book.totalPages && book.currentPage
      ? Math.min(100, Math.round((book.currentPage / book.totalPages) * 100))
      : 0;

  return (
    <main className="min-h-screen bg-paper px-6 py-6 text-ink md:px-10">
      <AppNav user={user} />

      <div className="mx-auto mt-14 max-w-3xl">
        <Link href="/books" className="font-sans text-sm text-ink-soft hover:text-ink">
          ← Semua buku
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-medium text-ink">
              {book.title}
            </h1>
            <p className="mt-1 font-serif text-lg text-ink-soft">{book.author}</p>
          </div>

          <select
            value={book.status}
            onChange={(e) => handleStatusChange(e.target.value as BookStatus)}
            className="rounded-full border border-paper-line bg-paper-dim/40 px-4 py-2 font-sans text-sm text-ink-soft"
          >
            {Object.entries(STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div className="mt-8 rounded-2xl border border-paper-line bg-paper p-6">
          <p className="font-sans text-xs uppercase tracking-wide text-ink-soft">
            Ratingmu
          </p>
          <div className="mt-2">
            <StarRating rating={book.rating ?? 0} onChange={handleRatingChange} size={28} />
          </div>
        </div>

        {/* Progress */}
        {book.totalPages ? (
          <div className="mt-6 rounded-2xl border border-paper-line bg-paper p-6">
            <p className="font-sans text-xs uppercase tracking-wide text-ink-soft">
              Progres baca
            </p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-paper-dim">
              <div
                className="h-full rounded-full bg-moss transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <input
                type="number"
                min={0}
                max={book.totalPages}
                value={pageDraft}
                onChange={(e) => setPageDraft(e.target.value)}
                className="w-24 rounded-lg border border-paper-line bg-paper px-3 py-1.5 font-serif text-ink focus:outline-none focus:ring-2 focus:ring-moss"
              />
              <span className="font-sans text-sm text-ink-soft">
                dari {book.totalPages} halaman
              </span>
              <button
                type="button"
                onClick={handleSavePage}
                disabled={savingPage}
                className="rounded-full bg-moss px-4 py-1.5 font-sans text-sm font-medium text-paper transition-colors hover:bg-moss-dark disabled:opacity-60"
              >
                {savingPage ? "Menyimpan..." : "Simpan halaman"}
              </button>
            </div>
          </div>
        ) : null}

        {/* Notes */}
        <div className="mt-6 rounded-2xl border border-paper-line bg-paper p-6">
          <p className="font-sans text-xs uppercase tracking-wide text-ink-soft">
            Catatan pribadi
          </p>
          <textarea
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            rows={6}
            placeholder="Kesan, kutipan favorit, atau coretan reaksi kamu soal buku ini..."
            className="mt-3 w-full rounded-lg border border-paper-line bg-paper px-3 py-2 font-serif text-ink leading-relaxed focus:outline-none focus:ring-2 focus:ring-moss"
          />
          <button
            type="button"
            onClick={handleSaveNotes}
            disabled={savingNotes}
            className="mt-3 rounded-full bg-moss px-5 py-2 font-sans text-sm font-medium text-paper transition-colors hover:bg-moss-dark disabled:opacity-60"
          >
            {savingNotes ? "Menyimpan..." : "Simpan catatan"}
          </button>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          className="mt-8 font-sans text-sm text-pencil hover:underline"
        >
          Hapus buku ini
        </button>
      </div>
    </main>
  );
}