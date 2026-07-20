import GoogleLoginButton from "../google-login-button";
import Reveal from "../reveal";

const MEMBERS = [
  { initials: "RA", bg: "bg-pencil" },
  { initials: "SN", bg: "bg-gilt" },
  { initials: "DP", bg: "bg-paper" },
];

export default function ClubPreview() {
  return (
    <section id="klub" className="px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <span className="font-hand text-xl text-pencil">
            baca sendiri boleh, rame-rame lebih seru
          </span>
          <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
            Bikin klub buku mini, cukup kamu dan beberapa teman.
          </h2>
          <p className="mt-5 max-w-md font-serif text-[17px] leading-relaxed text-ink-soft">
            Undang 2–10 teman ke klub privat, sepakati buku yang dibaca
            bareng, dan lanjutkan obrolan di thread diskusi per buku. Tidak
            ada feed publik, tidak ada orang asing — cuma kalian dan
            bukunya.
          </p>
          <ul className="mt-6 space-y-2 font-sans text-sm text-ink-soft">
            <li>— Thread diskusi per buku, bukan satu obrolan campur aduk</li>
            <li>— Undangan lewat kode, klub tetap privat</li>
            <li>— Lihat progres baca tiap anggota tanpa spoiler</li>
          </ul>
        </Reveal>

        <Reveal delay={150}>
          <div className="rounded-2xl bg-moss-dark p-7 text-paper shadow-[0_30px_60px_-25px_rgba(44,64,48,0.5)] sm:p-9">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-xl italic">Fiksi Sunyi</p>
                <p className="mt-1 font-sans text-xs text-paper/60">
                  4 anggota · sedang baca &ldquo;Hujan yang Sama&rdquo;
                </p>
              </div>
              <div className="flex -space-x-2">
                {MEMBERS.map((m, i) => (
                  <span
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-moss-dark font-sans text-[11px] font-medium text-moss-dark ${m.bg}`}
                  >
                    {m.initials}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-3 border-t border-paper/15 pt-6">
              <div className="rounded-xl rounded-tl-sm bg-paper/10 px-4 py-3">
                <p className="font-sans text-xs text-paper/60">Rani</p>
                <p className="mt-1 font-serif text-sm">
                  bab 3 nyeselin banget ya, aku sampe naruh buku sebentar
                </p>
              </div>
              <div className="ml-6 rounded-xl rounded-tl-sm bg-paper/10 px-4 py-3">
                <p className="font-sans text-xs text-paper/60">Dipa</p>
                <p className="mt-1 font-serif text-sm">
                  SAMA. aku underline bagian jeda-nya juga
                </p>
              </div>
            </div>

            <GoogleLoginButton className="mt-6 block w-full rounded-full bg-paper py-2.5 px-6 text-center font-sans text-sm font-medium text-moss-dark transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper disabled:opacity-60">
              Lihat thread lengkap
            </GoogleLoginButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}