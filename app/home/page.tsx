import Hero from "../../components/home/hero";
import Features from "../../components/home/features";
import Testimonials from "../../components/home/testimonials";
import Pricing from "../../components/home/pricing";
import CallToAction from "../../components/home/call-to-action";
import PublicNav from "../../components/layout/public-nav";
import Footer from "../../components/layout/footer";

export default function HomePage() {
  return (
    <>
      <PublicNav />
      <main className="min-h-screen bg-background pt-16 scroll-smooth">
        <section id="hero">
          <Hero />
        </section>
        <section id="features">
          <Features />
        </section>
        <section id="testimonials">
          <Testimonials />
        </section>
        <section id="pricing">
          <Pricing />
        </section>
        <section id="cta">
          <CallToAction />
        </section>
      </main>
      <Footer />
    </>
  );
}
