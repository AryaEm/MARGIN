"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuthUser } from "../../../../../hooks/use-auth-user";
import AppNav from "../../../../../components/app-nav";
import { sendMessage, subscribeToMessages } from "../../../../../utils/clubs";
import type { ThreadMessage } from "../../../../../types/firestore";

export default function ThreadPage() {
  const { id: clubId, threadId } = useParams<{ id: string; threadId: string }>();
  const { user, loading } = useAuthUser();

  const [messages, setMessages] = useState<ThreadMessage[] | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToMessages(clubId, threadId, setMessages);
    return () => unsubscribe();
  }, [clubId, threadId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!user || !text.trim()) return;
    setSending(true);
    try {
      await sendMessage(clubId, threadId, user.uid, user.displayName ?? "Anonim", text.trim());
      setText("");
    } finally {
      setSending(false);
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
    <main className="flex min-h-screen flex-col bg-paper px-6 py-6 text-ink md:px-10">
      <AppNav user={user} />

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
        <Link
          href={`/clubs/${clubId}`}
          className="mt-14 font-sans text-sm text-ink-soft hover:text-ink"
        >
          ← Kembali ke klub
        </Link>

        <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
          {messages === null ? (
            <p className="font-serif text-ink-soft">Memuat diskusi…</p>
          ) : messages.length === 0 ? (
            <p className="font-serif text-ink-soft">
              Belum ada yang mulai diskusi. Jadi yang pertama nulis di sini.
            </p>
          ) : (
            messages.map((m) => {
              const isMine = m.authorId === user?.uid;
              return (
                <div key={m.id} className={isMine ? "text-right" : "text-left"}>
                  <div
                    className={`inline-block max-w-[85%] rounded-2xl px-4 py-3 text-left ${
                      isMine
                        ? "rounded-tr-sm bg-moss text-paper"
                        : "rounded-tl-sm border border-paper-line bg-paper-dim/50 text-ink"
                    }`}
                  >
                    <p
                      className={`font-sans text-xs ${
                        isMine ? "text-paper/70" : "text-ink-soft"
                      }`}
                    >
                      {isMine ? "Kamu" : m.authorName}
                    </p>
                    <p className="mt-1 font-serif text-[15px] leading-relaxed">{m.text}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="sticky bottom-6 mt-6 flex gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis tanggapanmu..."
            className="flex-1 rounded-full border border-paper-line bg-paper px-5 py-3 font-serif text-ink focus:outline-none focus:ring-2 focus:ring-moss"
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="rounded-full bg-moss px-6 py-3 font-sans text-sm font-medium text-paper transition-colors hover:bg-moss-dark disabled:opacity-60"
          >
            Kirim
          </button>
        </form>
      </div>
    </main>
  );
}