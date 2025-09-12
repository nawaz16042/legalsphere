
"use client";

import { motion } from "framer-motion";
import { Bot, FileCheck, Languages, Shield, Zap } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: "AI-Powered Chatbot",
    description: "Get instant, clear answers to your legal questions 24/7. Our AI understands context and provides detailed explanations.",
  },
  {
    icon: <FileCheck className="h-8 w-8 text-primary" />,
    title: "Verified Sources",
    description: "Every answer is backed by verified sources from Indian law, including statutes and case law, for your peace of mind.",
  },
  {
    icon: <Languages className="h-8 w-8 text-primary" />,
    title: "Multi-Language Support",
    description: "Access legal information in your preferred language. We support English, Hindi, and many other regional languages.",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Fast & Responsive",
    description: "Our platform is optimized for speed, delivering the information you need without delay, on any device.",
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Privacy First",
    description: "Your conversations are private. We don't store your chat history or personal data, ensuring complete confidentiality.",
  },
];

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};


export function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything You Need to Understand the Law
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From simple questions to complex legal scenarios, LegalSphere offers a suite of powerful features designed to empower you.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
                key={feature.title}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
                transition={{ staggerChildren: 0.2 }}
            >
              <Card className="h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <CardHeader>
                  {feature.icon}
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
