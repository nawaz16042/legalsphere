
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="py-20 md:py-32 bg-secondary">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7 }}
        className="container mx-auto px-4 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Ready to Demystify the Law?
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
          Join thousands of users who are empowering themselves with legal knowledge. Get started for free, no credit card required.
        </p>
        <div className="mt-8">
          <Button size="lg" asChild>
            <Link href="/signup">Sign Up Now</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
