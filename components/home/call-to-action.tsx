import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Your Edge Awaits.
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            The market doesn't care about your feelings. It respects your discipline.
            Start building your legacy today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">Start For Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#features">See How It Works</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required for free tier. Upgrade only when you profit.
          </p>
        </div>
      </div>
    </section>
  );
}
