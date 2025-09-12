
"use client";

import { motion } from "framer-motion";
import { MessageSquare, ScanText, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const steps = [
    {
        icon: <MessageSquare className="h-10 w-10 text-primary" />,
        title: "1. Ask Your Question",
        description: "Type your legal query in simple, natural language. No legal jargon required."
    },
    {
        icon: <ScanText className="h-10 w-10 text-primary" />,
        title: "2. AI Analyzes & Retrieves",
        description: "Our AI scans vast legal databases and verified sources to find the most relevant information."
    },
    {
        icon: <FileText className="h-10 w-10 text-primary" />,
        title: "3. Get a Clear Answer",
        description: "Receive a concise, easy-to-understand answer with citations so you can verify the sources."
    }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Get Legal Clarity in Three Simple Steps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our process is designed to be straightforward and user-friendly.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Dashed line connector */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2">
                <svg width="100%" height="2">
                    <line x1="0" y1="1" x2="100%" y2="1" strokeWidth="2" strokeDasharray="8 8" className="stroke-primary/50" />
                </svg>
            </div>
          {steps.map((step, index) => (
             <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
                <Card className="text-center h-full bg-background shadow-lg z-10 relative">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                            {step.icon}
                        </div>
                        <CardTitle className="mt-4">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
