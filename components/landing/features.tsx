import Reveal from "../reveal";

const FEATURES = [
  {
    tag: "catat",
    accent: "bg-moss",
    title: "Catat progres bacaanmu",
    desc: "Tandai buku sebagai mau dibaca, sedang dibaca, atau selesai. Simpan halaman terakhir dan catatan singkat tiap kali kamu berhenti.",
  },
  {
    tag: "nilai",
    accent: "bg-pencil",
    title: "Beri rating & catatan pribadi",
    desc: "Tulis kesan, kutipan favorit, atau sekadar coretan reaksi, semuanya tersimpan rapi di halaman buku, bukan di notes HP yang berantakan.",
  },
  {
    tag: "diskusi",
    accent: "bg-gilt",
    title: "Diskusi di klub privat",
    desc: "Ajak beberapa teman baca buku yang sama, lalu lanjutkan obrolan di thread diskusi klub kalian sendiri, tidak terlihat orang di luar klub.",
  },
];

export default function Features() {
  return (
    <section
      id="fitur"
      className="border-y border-paper-line/80 bg-paper-dim/50 px-6 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="max-w-md font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
            Semua yang kamu butuh, dari halaman pertama sampai obrolan
            terakhir.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.tag} delay={i * 120}>
              <div className="group relative h-full rounded-2xl border border-paper-line bg-paper p-7 pt-10 shadow-sm transition-shadow hover:shadow-md">
                <span
                  className={`absolute -top-3.5 left-7 rounded-full px-3 py-1 font-hand text-lg leading-none text-paper ${f.accent}`}
                >
                  {f.tag}
                </span>
                <h3 className="font-display text-xl font-medium text-ink">
                  {f.title}
                </h3>
                <p className="mt-3 font-serif text-[15px] leading-relaxed text-ink-soft">
                  {f.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}   