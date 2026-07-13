import GoogleLoginButton from "../google-login-button";
import Reveal from "../reveal";

export default function CTASection() {
  return (
    <section
      id="mulai"
      className="border-t border-paper-line/80 bg-paper-dim/50 px-6 py-20 text-center md:px-10 md:py-28"
    >
      <Reveal className="mx-auto flex max-w-xl flex-col items-center">
        <p className="font-hand text-xl text-pencil">tunggu apa lagi</p>
        <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
          Buku yang sedang kamu baca layak punya catatan pinggir.
        </h2>
        <p className="mt-4 max-w-md font-serif text-[17px] text-ink-soft">
          Mulai catat buku pertamamu di Margin, gratis, dan ajak teman ke
          klub kapan saja kamu siap.
        </p>
        <GoogleLoginButton className="mt-8 inline-block rounded-full bg-moss px-7 py-3.5 font-sans text-sm font-medium text-paper transition-colors hover:bg-moss-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss disabled:opacity-60">
          Mulai Sekarang
        </GoogleLoginButton>
      </Reveal>
    </section>
  );
}