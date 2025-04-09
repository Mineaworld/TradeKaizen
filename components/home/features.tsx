import {
  BookOpen,
  LineChart,
  Target,
  Goal,
  Brain,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Comprehensive Trading Journal",
    description:
      "Track and organize all your trades with detailed entry and exit points, position sizes, and execution screenshots.",
  },
  {
    icon: LineChart,
    title: "Advanced Performance Analytics",
    description:
      "Measure your trading performance with detailed charts and metrics to identify strengths and areas for improvement.",
  },
  {
    icon: Target,
    title: "Trade Planning & Strategy Testing",
    description:
      "Develop and refine trading strategies based on historical data and performance metrics.",
  },
  {
    icon: Goal,
    title: "Goal Setting & Progress Tracking",
    description:
      "Set clear trading goals and track your progress with customizable metrics and milestones.",
  },
  {
    icon: Brain,
    title: "Mood & Psychology Tracking",
    description:
      "Monitor your emotional state during trades to identify psychological patterns affecting your trading.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Management Tools",
    description:
      "Calculate optimal position sizes and risk-reward ratios for each trade based on your risk tolerance.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-slate-50 dark:bg-slate-900/50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Powerful Features to Elevate Your Trading
          </h2>
          <p className="text-lg text-muted-foreground">
            TradeKaizen provides all the tools you need to analyze your
            performance and consistently improve your trading strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-background rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
