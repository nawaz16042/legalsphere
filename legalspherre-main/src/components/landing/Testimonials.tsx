
"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "LegalSphere made understanding my tenancy rights incredibly simple. The AI broke down the complex terms into plain English. Highly recommended!",
    name: "Aarav Sharma",
    title: "Student, Delhi",
    avatar: "AS",
  },
  {
    quote: "As a small business owner, I constantly have legal questions. This tool is a lifesaver. It's like having a legal expert on call 24/7.",
    name: "Priya Singh",
    title: "Startup Founder, Bangalore",
    avatar: "PS",
  },
  {
    quote: "I needed to understand the process for property registration, and LegalSphere gave me a step-by-step guide with links to the actual laws. Amazing!",
    name: "Rohan Mehta",
    title: "Home Buyer, Mumbai",
    avatar: "RM",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Trusted by People Across India
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Don't just take our word for it. Here's what our users have to say.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
             <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <blockquote className="italic text-muted-foreground">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="mt-6 flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`https://placehold.co/40x40.png?text=${testimonial.avatar}`} />
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
