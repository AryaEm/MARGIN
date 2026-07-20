"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuthUser } from "../../hooks/use-auth-user";
import AppNav from "../../components/app-nav";
import { createClub, joinClubByInviteCode, subscribeToUserClubs } from "../../utils/clubs";
import type { ClubMember } from "../../types/firestore";

export default function ClubsPage() {
  const { user, loading } = useAuthUser();
  const [clubs, setClubs] = useState<(ClubMember & { clubId: string })[] | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToUserClubs(user.uid, setClubs);
    return () => unsubscribe();
  }, [user]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!user || !name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await createClub(user.uid, user.displayName ?? "", user.photoURL, name.trim(), description.trim());
      setName("");
      setDescription("");
      setCreateOpen(false);
    } catch (err) {
      console.error(err);
      setError("Gagal membuat klub. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleJoin(e: FormEvent) {
    e.preventDefault();
    if (!user || !inviteCode.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await joinClubByInviteCode(user.uid, user.displayName ?? "", user.photoURL, inviteCode);
      setInviteCode("");
      setJoinOpen(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Gagal gabung klub.");
    } finally {
      setSubmitting(false);
    }
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
          <h1 className="font-display text-3xl font-medium text-ink">Klub</h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setJoinOpen(false);
                setCreateOpen((v) => !v);
              }}
              className="rounded-full border border-paper-line px-5 py-2.5 font-sans text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {createOpen ? "Batal" : "Buat klub"}
            </button>
            <button
              type="button"
              onClick={() => {
                setCreateOpen(false);
                setJoinOpen((v) => !v);
              }}
              className="rounded-full bg-moss px-5 py-2.5 font-sans text-sm font-medium text-paper transition-colors hover:bg-moss-dark"
            >
              {joinOpen ? "Batal" : "Gabung klub"}
            </button>
          </div>
        </div>

        {error && <p className="mt-4 font-sans text-sm text-pencil">{error}</p>}

        {createOpen && (
          <form
            onSubmit={handleCreate}
            className="mt-6 grid gap-4 rounded-2xl border border-paper-line bg-paper-dim/40 p-6"
          >
            <div>
              <label className="font-sans text-xs text-ink-soft" htmlFor="clubName">
                Nama klub
              </label>
              <input
                id="clubName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-paper-line bg-paper px-3 py-2 font-serif text-ink focus:outline-none focus:ring-2 focus:ring-moss"
                placeholder="Fiksi Sunyi"
              />
            </div>
            <div>
              <label className="font-sans text-xs text-ink-soft" htmlFor="clubDesc">
                Deskripsi singkat (opsional)
              </label>
              <input
                id="clubDesc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-lg border border-paper-line bg-paper px-3 py-2 font-serif text-ink focus:outline-none focus:ring-2 focus:ring-moss"
                placeholder="Klub buat baca fiksi pelan-pelan bareng teman dekat"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="justify-self-start rounded-full bg-moss px-6 py-2.5 font-sans text-sm font-medium text-paper transition-colors hover:bg-moss-dark disabled:opacity-60"
            >
              {submitting ? "Membuat..." : "Buat klub"}
            </button>
          </form>
        )}

        {joinOpen && (
          <form
            onSubmit={handleJoin}
            className="mt-6 flex flex-wrap items-end gap-4 rounded-2xl border border-paper-line bg-paper-dim/40 p-6"
          >
            <div>
              <label className="font-sans text-xs text-ink-soft" htmlFor="inviteCode">
                Kode undangan
              </label>
              <input
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
                className="mt-1 w-40 rounded-lg border border-paper-line bg-paper px-3 py-2 font-sans uppercase tracking-widest text-ink focus:outline-none focus:ring-2 focus:ring-moss"
                placeholder="ABC123"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-moss px-6 py-2.5 font-sans text-sm font-medium text-paper transition-colors hover:bg-moss-dark disabled:opacity-60"
            >
              {submitting ? "Bergabung..." : "Gabung"}
            </button>
          </form>
        )}

        {clubs === null ? (
          <p className="mt-8 font-serif text-ink-soft">Memuat klub…</p>
        ) : clubs.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-paper-line bg-paper-dim/40 px-8 py-12 text-center">
            <p className="font-serif text-ink-soft">
              Kamu belum punya klub. Buat satu, atau gabung pakai kode undangan dari teman.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((membership) => (
              <Link
                key={membership.clubId}
                href={`/clubs/${membership.clubId}`}
                className="rounded-2xl border border-paper-line bg-paper p-6 transition-shadow hover:shadow-sm"
              >
                <p className="font-display text-xl text-ink">{membership.clubName}</p>
                <p className="mt-2 font-sans text-xs uppercase tracking-wide text-ink-soft">
                  {membership.role === "owner" ? "Kamu pemilik klub ini" : "Anggota"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}