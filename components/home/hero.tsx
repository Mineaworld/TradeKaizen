import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Master Your <br />
              Trading Journey <br />
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                With Data-Driven Insights
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              TradeKaizen is your all-in-one trading journal platform, crafted
              to empower you in analyzing patterns, tracking performance, and
              refining your trading strategies. Transform every trade into a
              valuable learning experience.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/register">Get Started for Free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="#features">Explore Trading Analytics</Link>
            </Button>
          </div>
        </div>
        <div className="mt-12 lg:mt-0 lg:w-1/2">
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="glass-card rounded-xl p-4 md:p-8 transform rotate-1 shadow-2xl">
              <Image
                src="/images/dashboard-preview.png"
                alt="TradeKaizen Dashboard"
                layout="fill"
                className="object-cover rounded-lg shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
