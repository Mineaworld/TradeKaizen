import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "$0",
    period: "Free forever",
    description: "Perfect for beginners exploring trading journaling",
    features: [
      "Up to 30 trades per month",
      "Basic performance metrics",
      "Trade entry/exit logging",
      "Community forum access",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9.97",
    period: "per month",
    description: "For serious traders looking to improve consistency",
    features: [
      "Unlimited trades",
      "Advanced analytics dashboard",
      "Risk management tools",
      "Trade pattern detection",
      "Psychology tracking",
      "Trade screenshots",
      "Trade journal templates",
      "Email support",
    ],
    cta: "Start 7-Day Free Trial",
    popular: true,
  },
  {
    name: "Team",
    price: "$299",
    period: "per year",
    description: "For trading groups and educational institutions",
    features: [
      "Everything in Pro plan",
      "Up to 15 team members",
      "Shared strategy library",
      "Performance comparisons",
      "Advanced reporting",
      "Priority support",
      "Custom onboarding",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your trading needs. All plans include our
            profit-guarantee: if you don&apos;t improve your trading, we&apos;ll
            refund you 100%.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-background rounded-xl shadow-lg p-8 ${
                plan.popular ? "ring-2 ring-primary" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                    Best Value + Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          All plans include our 30-day money-back guarantee. No questions asked.
        </div>
      </div>
    </section>
  );
}
