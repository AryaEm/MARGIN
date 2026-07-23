import GoogleLoginButton from "../google-login-button";
import AnnotatedPage from "../anoted-page";

export default function Hero() {
    return (
        <section className="relative overflow-hidden px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-20 min-h-dvh flex">
            <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                    <span className="font-hand text-xl text-pencil">
                        catatan pinggir untuk pembaca
                    </span>
                    <h1 className="mt-3 font-display text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
                        Setiap buku layak <em className="text-moss italic">catatan pinggir</em>{" "}
                        dan teman diskusi.
                    </h1>
                    <p className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-ink-soft">
                        Margin membantu kamu mencatat progres baca, memberi rating &amp;
                        catatan pribadi di setiap buku, lalu membawanya ke diskusi
                        bersama teman di klub privat kecil-kecilan.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                        <GoogleLoginButton className="rounded-full bg-moss px-6 py-3 font-sans text-sm font-medium text-paper transition-colors hover:bg-moss-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss disabled:opacity-60">
                            Mulai catat buku pertamamu
                        </GoogleLoginButton>
                    </div>
                    <p className="mt-6 font-sans text-sm text-ink-soft">
                        Gratis. Tidak perlu kartu kredit.
                    </p>
                </div>

                <AnnotatedPage />
            </div>
        </section>
    );
}