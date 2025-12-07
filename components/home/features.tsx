"use client";

import FadeIn from "@/components/animations/fade-in";
import { motion } from "framer-motion";
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
    title: "Journal Like a Pro",
    description:
      "Log every detail—entries, exits, emotions, and screenshots. Build a database of your own experience.",
  },
  {
    icon: LineChart,
    title: "Deep-Dive Analytics",
    description:
      "Uncover hidden patterns in your trading. Know exactly which setups pay and which ones bleed your account.",
  },
  {
    icon: Target,
    title: "Strategy Refinement",
    description:
      "Stop strategy hopping. Test, tweak, and perfect your edge using real data from your actual trades.",
  },
  {
    icon: Goal,
    title: "Ruthless Accountability",
    description:
      "Set daily, weekly, and monthly goals. Visualize your progress and stay disciplined when it matters most.",
  },
  {
    icon: Brain,
    title: "Master Your Psychology",
    description:
      "Track your mental state alongside your P&L. Identify the emotional triggers that cause your biggest losses.",
  },
  {
    icon: ShieldCheck,
    title: "Protect Your Capital",
    description:
      "Built-in risk calculators ensure you never blow up your account on a single bad trade again.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-slate-50 dark:bg-slate-900/50 py-20">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              The Tools You Need to Be Profitable
            </h2>
            <p className="text-lg text-muted-foreground">
              Professional traders don't rely on luck. They rely on systems.
              TradeKaizen gives you the system.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FadeIn key={index} delay={index * 0.1} className="h-full">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-background rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow h-full border border-border/50"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
