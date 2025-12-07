"use client";

import Image from "next/image";
import FadeIn from "@/components/animations/fade-in";

const testimonials = [
  {
    quote:
      "I used to trade with my gut. I lost money. TradeKaizen forced me to look at the data. I realized my 'gut' was just fear. Now I trade my system, and my P&L proves it works.",
    author: "Jason Turner",
    role: "Senior Forex Trader",
    avatar: "/images/avatars/U1.png",
  },
  {
    quote:
      "The strategy backtesting and tagging feature is insane. I found out I was losing 80% of trades taken after 11 AM. I stopped trading then, and my win rate jumped to 65% instantly.",
    author: "Zane Edwards",
    role: "Prop Firm Funded Trader",
    avatar: "/images/avatars/U2.png",
  },
  {
    quote:
      "Trading is 90% psychology. This is the only journal that actually helps you track your head space. It saved me from revenge trading more times than I can count.",
    author: "Aryan Patel",
    role: "Crypto Day Trader",
    avatar: "/images/avatars/U3.png",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground">
              Discover how TradeKaizen has helped traders improve their
              performance and achieve better results.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={index} delay={index * 0.1} direction="up" className="h-full">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg shadow-lg h-full flex flex-col">
                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <div className="text-4xl text-primary mb-4">&ldquo;</div>
                    <p className="text-lg mb-6 italic">{testimonial.quote}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
