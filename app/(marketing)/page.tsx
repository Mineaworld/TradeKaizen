import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import Pricing from "@/components/home/pricing";
import Testimonials from "@/components/home/testimonials";
import CallToAction from "@/components/home/call-to-action";

export default function Home() {
    return (
        <>
            <Hero />
            <Features />
            <Pricing />
            <Testimonials />
            <CallToAction />
        </>
    );
}
