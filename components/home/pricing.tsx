import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "Forever Free",
    description: "Perfect for beginners starting their trading journey",
    features: [
      "Up to 10 trades per month",
      "Basic performance metrics",
      "Trade entry/exit logging",
      "Basic trade templates",
    ],
    cta: "Start Free Forever",
    popular: false,
    highlight: "No Credit Card Required",
  },
  {
    name: "Pro Trader",
    originalPrice: "$19.99",
    price: "$9.99",
    period: "per month",
    description: "Most popular choice for serious traders",
    features: [
      "Unlimited trades",
      "Advanced analytics dashboard",
      "AI-powered trade insights",
      "Risk management tools",
      "Psychology tracking",
      "Trade pattern detection",
      "Priority email support",
      "Advanced trade templates",
    ],
    cta: "Start 7-days Free Trial",
    popular: true,
    highlight: "Save 50% - Limited Time",
    savings: "$120/year",
  },
  {
    name: "Elite Trader",
    originalPrice: "$29.99",
    price: "$14.99",
    period: "per month",
    description: "For traders who demand the absolute best",
    features: [
      "Everything in Pro Trader",
      "Custom indicators library",
      "Advanced risk analytics",
      "Custom trade algorithms",
    ],
    cta: "Upgrade to Elite",
    popular: false,
    highlight: "Best Value for Serious Traders",
    savings: "$180/year",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Choose Your Trading Edge</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade as you grow. All paid plans include a 30-day
            money-back guarantee and our unique profit-improvement promise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-background rounded-xl shadow-lg p-8 border border-border/50 transition-transform duration-300 hover:scale-105 ${
                plan.popular ? "ring-2 ring-primary" : ""
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

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

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
          ))}
        </div>

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
      </div>
    </section>
  );
}
