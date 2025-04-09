import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Trading Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of traders who are using data-driven insights to
            improve their performance and consistency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">Get Started For Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#features">Schedule a Demo</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required. Free 7-day trial on all paid plans.
          </p>
        </div>
      </div>
    </section>
  );
}
