
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import Link from "next/link";

const allFeatures = [
    { id: "prompts", text: "Prompts" },
    { id: "model", text: "Advanced AI Model" },
    { id: "sources", text: "Access to Verified Sources" },
    { id: "users", text: "User Accounts" },
    { id: "dashboard", text: "Team Management Dashboard" },
    { id: "support", text: "Priority Support" },
    { id: "early_access", text: "Early Access to New Features" },
    { id: "api", text: "API Access (Coming Soon)" },
];


const plans = [
    {
        title: "Free",
        price: "₹0",
        description: "For individuals starting out with legal queries.",
        features: {
            prompts: "15 Prompts per day",
            sources: true,
        },
        buttonText: "Current Plan",
        isCurrent: true,
        isFeatured: false,
    },
    {
        title: "Premium",
        price: "₹499",
        description: "For individuals who need unlimited access and priority support.",
        features: {
            prompts: "Unlimited Prompts",
            model: true,
            sources: true,
            support: true,
            early_access: true,
        },
        buttonText: "Choose Plan",
        isCurrent: false,
        isFeatured: true,
    },
    {
        title: "Enterprise",
        price: "₹1,499",
        description: "For lawyer offices and teams requiring collaborative tools.",
        features: {
            prompts: "Unlimited Prompts",
            model: true,
            sources: true,
            users: "Up to 4 User Accounts",
            dashboard: true,
            support: "Dedicated Support Contact",
            early_access: true,
            api: true,
        },
        buttonText: "Contact Sales",
        isCurrent: false,
        isFeatured: false,
    },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-primary lg:text-5xl">Choose Your Plan</h1>
            <p className="mt-4 text-lg text-muted-foreground">Simple, transparent pricing. No hidden fees.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
                const includedFeatures = allFeatures.filter(
                    (feature) => !!plan.features[feature.id as keyof typeof plan.features]
                );
                const excludedFeatures = allFeatures.filter(
                    (feature) => !plan.features[feature.id as keyof typeof plan.features]
                );

                return (
                    <Card 
                        key={plan.title}
                        className={cn(
                            "flex flex-col shadow-lg transition-all hover:shadow-xl hover:scale-105",
                            plan.isFeatured && "border-primary border-2 scale-105"
                        )}
                    >
                        {plan.isFeatured && (
                            <div className="w-full bg-primary text-primary-foreground text-center py-1 text-sm font-semibold rounded-t-lg">
                               Most Popular
                            </div>
                        )}
                        <CardHeader className="pt-8">
                            <CardTitle className="text-3xl font-bold">{plan.title}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="mb-6">
                                <span className="text-5xl font-extrabold">{plan.price}</span>
                                <span className="text-muted-foreground text-lg">/month</span>
                            </div>
                            <ul className="space-y-4">
                                {includedFeatures.map((feature) => {
                                    const planFeature = plan.features[feature.id as keyof typeof plan.features];
                                    const featureText = typeof planFeature === 'string' ? planFeature : feature.text;
                                    return (
                                        <li key={feature.id} className="flex items-center gap-3">
                                            <Check className="h-5 w-5 text-green-500" />
                                            <span>{featureText}</span>
                                        </li>
                                    )
                                })}
                                {excludedFeatures.map((feature) => (
                                    <li key={feature.id} className="flex items-center gap-3 text-muted-foreground">
                                        <X className="h-5 w-5 text-red-500" />
                                        <span>{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className="w-full" 
                                disabled={plan.isCurrent}
                                variant={plan.isFeatured ? 'default' : 'outline'}
                            >
                                {plan.buttonText}
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
         <div className="mt-12 text-center text-muted-foreground">
            <p>Need a custom solution or have questions? <Link href="/dashboard/support" className="text-primary hover:underline font-semibold">Contact us</Link>.</p>
        </div>
    </div>
  );
}
