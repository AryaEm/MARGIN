import Navbar from "../components/landing/navbar";
import Hero from "../components/landing/hero";
import Features from "../components/landing/features";
import ClubPreview from "../components/landing/club-preview";
import CTASection from "../components/landing/cta-section";
import Footer from "../components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <Navbar />
      <Hero />
      <Features />
      <ClubPreview />
      <CTASection />
      <Footer />
    </main>
  );
}