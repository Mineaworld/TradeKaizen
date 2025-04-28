import Image from "next/image";

const testimonials = [
  {
    quote:
      "Before TradeKaizen, my trading was all over the place. But with its powerful insights and real-time analytics, I fine-tuned my strategy. Now, I’m hitting 10% higher win rates and seeing real progress – it’s the change I needed!",
    author: "Jason Turner",
    role: "Senior Forex Trader & Investor",
    avatar: "/images/avatars/U1.png",
  },
  {
    quote:
      "I’ve been mentoring traders for years, and I can confidently say that TradeKaizen is a game-changer. The analytics and strategy testing tools are exactly what every serious trader needs to level up their game. I recommend it to all my students.",
    author: "Zane Edwards",
    role: "Professional Trader & Mentor",
    avatar: "/images/avatars/U2.png",
  },
  {
    quote:
      "Tracking both my trades and emotions with TradeKaizen has unlocked a whole new level of consistency in my trading. I’ve discovered patterns I didn’t even know were there, and now I’m more focused and successful than ever.",
    author: "Aryan Patel",
    role: "Day Trader, 5+ years in Forex & Crypto",
    avatar: "/images/avatars/U3.png",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground">
            Discover how TradeKaizen has helped traders improve their
            performance and achieve better results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg shadow-lg"
            >
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <div className="text-4xl text-primary mb-4">&ldquo;</div>
                  <p className="text-lg mb-6 italic">{testimonial.quote}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      fill
                      className=" h-[200px] w-[200px] object-cover"
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
          ))}
        </div>
      </div>
    </section>
  );
}
