"use client";

import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import FadeIn from "@/components/animations/fade-in";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Rookie",
    price: "$0",
    period: "Forever Free",
    description: "Build the habit. Start tracking your trades without risk.",
    features: [
      "Up to 10 trades per month",
      "Basic P&L tracking",
      "Entry/exit logging",
      "Standard trade templates",
    ],
    cta: "Start Free",
    popular: false,
    highlight: "No Credit Card Required",
  },
  {
    name: "Professional",
    originalPrice: "$19.99",
    price: "$9.99",
    period: "per month",
    description: "For traders who treat this as a business, not a hobby.",
    features: [
      "Unlimited trades",
      "Advanced analytics & charts",
      "AI-powered trade insights",
      "Risk of Ruin calculator",
      "Psychology journaling",
      "Pattern recognition",
      "Priority support",
      "Custom templates",
    ],
    cta: "Start 7-Day Free Trial",
    popular: true,
    highlight: "Save 50% - Limited Time",
    savings: "$120/year",
  },
  {
    name: "Master",
    originalPrice: "$29.99",
    price: "$14.99",
    period: "per month",
    description: "Maximum data. Maximum edge. For the obsessionals.",
    features: [
      "Everything in Professional",
      "Custom indicators library",
      "Advanced risk modelling",
      "Strategy backtesting engine",
    ],
    cta: "Upgrade to Master",
    popular: false,
    highlight: "Best Value for Scale",
    savings: "$180/year",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Choose Your Trading Edge</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade as you grow. All paid plans include a 30-day
              money-back guarantee and our unique profit-improvement promise.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <FadeIn key={index} delay={index * 0.15} direction="up">
              <motion.div
                whileHover={{ y: -8 }}
                className={`relative bg-background rounded-xl shadow-lg p-8 border border-border/50 h-full flex flex-col ${plan.popular ? "ring-2 ring-primary" : ""
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground text-sm font-medium px-4 py-1.5 rounded-full flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Most Popular Choice
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-3">
                    {plan.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through mr-2">
                        {plan.originalPrice}
                      </span>
                    )}
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="text-sm text-green-500 font-medium mb-2">
                      Save up to {plan.savings}
                    </div>
                  )}
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Button
                    className="w-full font-medium text-base"
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>

                  {plan.highlight && (
                    <div className="text-center mt-3 text-sm font-medium text-muted-foreground">
                      {plan.highlight}
                    </div>
                  )}
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div className="text-center mt-12 space-y-4">
            <div className="text-sm text-muted-foreground">
              🔒 Secure payment powered by Stripe. Cancel anytime.
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <span>30-Day Money-Back Guarantee</span>
              <span>•</span>
              <span>24/7 Support</span>
              <span>•</span>
              <span>Profit-Improvement Promise</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
