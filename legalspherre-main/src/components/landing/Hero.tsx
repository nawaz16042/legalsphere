
"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gavel, MessageSquare, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const AnimatedIcon = ({ children, className, delay }: { children: React.ReactNode, className?: string, delay: number }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.2 }}
      transition={{ type: "spring", stiffness: 100, damping: 10, delay, when: "beforeChildren" }}
      className={cn("absolute bg-background/50 backdrop-blur-sm p-4 rounded-full shadow-lg border", className)}
    >
        {children}
    </motion.div>
)

export function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-secondary">
       {/* Background decorative shapes */}
       <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/10 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-primary/5 rounded-full filter blur-2xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

       <div className="absolute inset-0 z-10">
        <AnimatedIcon className="top-[15%] left-[10%]" delay={0.2}>
            <Gavel className="h-8 w-8 text-primary" />
        </AnimatedIcon>
         <AnimatedIcon className="top-[20%] right-[15%]" delay={0.4}>
            <MessageSquare className="h-8 w-8 text-primary" />
        </AnimatedIcon>
         <AnimatedIcon className="bottom-[20%] left-[25%]" delay={0.6}>
            <ShieldCheck className="h-8 w-8 text-primary" />
        </AnimatedIcon>
        <AnimatedIcon className="bottom-[15%] right-[10%]" delay={0.8}>
            <Gavel className="h-8 w-8 text-primary" />
        </AnimatedIcon>
      </div>
      
      <div className="container relative z-20 mx-auto flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
            Navigate Indian Law with <span className="text-primary">Confidence</span>
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          LegalSphere provides instant, AI-powered answers to your legal questions, backed by verified sources. Understand your rights, simplified.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button size="lg" asChild>
            <Link href="/signup">Get Started for Free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">Learn More</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
