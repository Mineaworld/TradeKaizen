import Image from "next/image";

const testimonials = [
  {
    quote:
      "TradeKaizen has transformed my approach to trading. The analytics enable me to better track my performance, and my win rate has improved by 25% since I started using it.",
    author: "Michael S.",
    role: "Day Trader, 5 years experience",
    avatar: "/images/avatars/avatar-1.jpg",
  },
  {
    quote:
      "The ability to track my emotional state alongside trade performance is game-changing. I've identified patterns in my trading that were holding me back.",
    author: "Sarah J.",
    role: "Swing Trader, 3 years experience",
    avatar: "/images/avatars/avatar-2.jpg",
  },
  {
    quote:
      "As a trading coach, I recommend TradeKaizen to all my students. The detailed analytics and strategy testing tools are invaluable for improving trading results.",
    author: "David T.",
    role: "Professional Trader & Coach",
    avatar: "/images/avatars/avatar-3.jpg",
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
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
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
          ))}
        </div>
      </div>
    </section>
  );
}
