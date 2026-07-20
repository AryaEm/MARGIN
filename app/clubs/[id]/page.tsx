"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuthUser } from "../../../hooks/use-auth-user";
import AppNav from "../../../components/app-nav";
import {
  createThread,
  subscribeToClub,
  subscribeToClubMembers,
  subscribeToThreads,
} from "../../../utils/clubs";
import type { Club, ClubMember, ClubThread } from "../../../types/firestore";

export default function ClubDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuthUser();

  const [club, setClub] = useState<(Club & { id: string }) | null | undefined>(undefined);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [threads, setThreads] = useState<ClubThread[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubClub = subscribeToClub(id, setClub);
    const unsubMembers = subscribeToClubMembers(id, setMembers);
    const unsubThreads = subscribeToThreads(id, setThreads);
    return () => {
      unsubClub();
      unsubMembers();
      unsubThreads();
    };
  }, [id, user]);

  async function handleCreateThread(e: FormEvent) {
    e.preventDefault();
    if (!user || !title.trim()) return;
    setSubmitting(true);
    try {
      await createThread(id, user.uid, title.trim(), bookTitle.trim() || undefined);
      setTitle("");
      setBookTitle("");
      setFormOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || club === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="font-serif text-ink-soft">Memuat…</p>
      </main>
    );
  }

  if (club === null) {
    return (
      <main className="min-h-screen bg-paper px-6 py-6 text-ink md:px-10">
        <AppNav user={user} />
        <div className="mx-auto mt-14 max-w-3xl text-center">
          <p className="font-serif text-ink-soft">
            Klub ini gak ketemu, atau kamu bukan anggotanya.
          </p>
          <Link href="/clubs" className="mt-4 inline-block font-sans text-sm text-moss hover:underline">
            ← Kembali ke daftar klub
          </Link>
        </div>
      </main>
    );
  }

  const isOwner = club.ownerId === user?.uid;

  return (
    <main className="min-h-screen bg-paper px-6 py-6 text-ink md:px-10">
      <AppNav user={user} />

      <div className="mx-auto mt-14 max-w-5xl">
        <Link href="/clubs" className="font-sans text-sm text-ink-soft hover:text-ink">
          ← Semua klub
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl font-medium text-ink">{club.name}</h1>
            {club.description && (
              <p className="mt-2 max-w-xl font-serif text-ink-soft">{club.description}</p>
            )}
            <p className="mt-2 font-sans text-xs text-ink-soft">
              {club.memberCount} anggota
            </p>
          </div>

          {isOwner && (
            <div className="rounded-xl border border-paper-line bg-paper-dim/40 px-5 py-3 text-center">
              <p className="font-sans text-xs uppercase tracking-wide text-ink-soft">
                Kode undangan
              </p>
              <p className="mt-1 font-display text-2xl tracking-[0.2em] text-moss">
                {club.inviteCode}
              </p>
              <p className="mt-1 font-sans text-[11px] text-ink-soft">
                Bagikan ke teman yang mau kamu ajak
              </p>
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_280px]">
          {/* Threads */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-medium text-ink">Thread diskusi</h2>
              <button
                type="button"
                onClick={() => setFormOpen((v) => !v)}
                className="rounded-full bg-moss px-4 py-2 font-sans text-sm font-medium text-paper transition-colors hover:bg-moss-dark"
              >
                {formOpen ? "Batal" : "+ Thread baru"}
              </button>
            </div>

            {formOpen && (
              <form
                onSubmit={handleCreateThread}
                className="mt-4 grid gap-3 rounded-2xl border border-paper-line bg-paper-dim/40 p-5"
              >
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Judul thread, misal: Diskusi bab 3"
                  className="rounded-lg border border-paper-line bg-paper px-3 py-2 font-serif text-ink focus:outline-none focus:ring-2 focus:ring-moss"
                />
                <input
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="Buku yang dibahas (opsional)"
                  className="rounded-lg border border-paper-line bg-paper px-3 py-2 font-serif text-ink focus:outline-none focus:ring-2 focus:ring-moss"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="justify-self-start rounded-full bg-moss px-5 py-2 font-sans text-sm font-medium text-paper transition-colors hover:bg-moss-dark disabled:opacity-60"
                >
                  {submitting ? "Membuat..." : "Buat thread"}
                </button>
              </form>
            )}

            <div className="mt-5 space-y-3">
              {threads.length === 0 && (
                <p className="font-serif text-ink-soft">Belum ada thread di klub ini.</p>
              )}
              {threads.map((thread) => (
                <Link
                  key={thread.id}
                  href={`/clubs/${id}/threads/${thread.id}`}
                  className="block rounded-xl border border-paper-line bg-paper p-4 transition-shadow hover:shadow-sm"
                >
                  <p className="font-display text-lg text-ink">{thread.title}</p>
                  {thread.bookTitle && (
                    <p className="mt-1 font-sans text-xs text-ink-soft">
                      tentang &ldquo;{thread.bookTitle}&rdquo;
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Members */}
          <div>
            <h2 className="font-display text-xl font-medium text-ink">Anggota</h2>
            <div className="mt-4 space-y-3">
              {members.map((m) => (
                <div key={m.uid} className="flex items-center gap-3">
                  {m.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.photoURL}
                      alt=""
                      className="h-8 w-8 rounded-full border border-paper-line"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-paper-dim font-sans text-xs text-ink-soft">
                      {m.displayName.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <p className="font-sans text-sm text-ink">{m.displayName}</p>
                    {m.role === "owner" && (
                      <p className="font-sans text-[11px] text-ink-soft">Pemilik</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}