
"use client";

import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HelpCircle, Mail, Phone, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const faqItems = [
    {
        question: "How accurate is the legal information provided?",
        answer: "Our AI is trained on a vast corpus of verified Indian legal documents, including case law, statutes, and official government publications. While we strive for accuracy, the information is for informational purposes only and does not constitute legal advice. Always consult with a licensed lawyer for critical matters."
    },
    {
        question: "Is my data and conversation history private?",
        answer: "Yes, we prioritize your privacy. If you have 'Store Chat History' enabled in your settings, chats are saved to your browser's local storage and are not stored on our servers. If this setting is disabled, no history is kept. We do not record any confidential information you provide."
    },
    {
        question: "Can I use this for official legal proceedings?",
        answer: "No. LegalSphere is an informational tool designed to help you understand Indian law better. It is not a substitute for a qualified legal professional. Information from this platform should not be used as evidence or a legal basis in court proceedings."
    }
]

export default function DashboardSupportPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current) return;
        
        setIsSubmitting(true);

        try {
            await emailjs.sendForm(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                formRef.current,
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
            );
            toast({
                title: "Message Sent!",
                description: "Thank you for your feedback. We'll get back to you shortly.",
            });
            formRef.current.reset();
        } catch (error) {
            console.error("FAILED...", error);
            toast({
                title: "Submission Failed",
                description: "Something went wrong. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="container mx-auto p-4 md:p-8 space-y-12">
            <header className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-primary lg:text-5xl">Contact & Support</h1>
                <p className="mt-4 text-lg text-muted-foreground">We're here to help. Find answers, get in touch, or share your feedback.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3"><HelpCircle /> Help Center / FAQ</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {faqItems.map((item, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger>{item.question}</AccordionTrigger>
                                        <AccordionContent>
                                            {item.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3"><Mail /> Contact Info</CardTitle>
                            <CardDescription>Can't find an answer? Reach out to our team.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <a href="mailto:khannawaz2004@gmail.com" className="hover:underline">khannawaz2004@gmail.com</a>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <span>+91 9141488834 (Mon-Fri, 9am-6pm IST)</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">Get in Touch</CardTitle>
                            <CardDescription>Help us improve the AI chatbot's performance.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form ref={formRef} className="space-y-4" onSubmit={handleFeedbackSubmit}>
                                 <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input name="from_name" id="name" placeholder="John Doe" required/>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input name="from_email" id="email" type="email" placeholder="john.doe@example.com" required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="feedback-text">Your Message:</Label>
                                    <Textarea name="message" id="feedback-text" placeholder="I have a question about..." required/>
                                </div>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                    {isSubmitting ? "Sending..." : "Submit"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
