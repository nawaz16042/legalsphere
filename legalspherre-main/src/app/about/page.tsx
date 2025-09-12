
"use client";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScaleIcon } from "@/components/icons/ScaleIcon";
import { ShieldCheck, DatabaseZap, Users, BrainCircuit, FileText, Shield } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Link from "next/link";

const teamMembers = [
    { name: "Nawaz Khan", role: "Founder and Software Engineer", avatar: "NK", bio: "Nawaz is a passionate software engineer with a vision to democratize legal information in India. He believes in the power of technology to bridge the justice gap." },
];

export default function AboutPage() {
  const { t } = useLocale();
  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="container mx-auto p-4 md:p-8 space-y-12 mt-20">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary lg:text-5xl">{t('aboutLegalSphere')}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">{t('missionStatement')}</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <ScaleIcon className="h-7 w-7 text-primary" />
                <span className="text-2xl">{t('ourMission')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base text-muted-foreground">
              <p>
                {t('missionDescription')}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BrainCircuit className="h-7 w-7 text-primary" />
                <span className="text-2xl">{t('howTheAiWorks')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                    <ShieldCheck className="h-6 w-6 text-green-500 mt-1 shrink-0" />
                    <div>
                        <h4 className="font-semibold">{t('privacyFirst')}</h4>
                        <p className="text-muted-foreground text-sm">{t('privacyDescription')}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <DatabaseZap className="h-6 w-6 text-blue-500 mt-1 shrink-0" />
                    <div>
                        <h4 className="font-semibold">{t('verifiedSources')}</h4>
                        <p className="text-muted-foreground text-sm">{t('sourcesDescription')}</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-3 text-3xl">
              <Users className="h-8 w-8 text-primary" />
              {t('meetTheTeam')}
            </CardTitle>
            <CardDescription className="max-w-2xl mx-auto">
              {t('teamDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-center p-8 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center max-w-sm">
                <Avatar className="h-24 w-24 mb-4 ring-2 ring-primary ring-offset-2 ring-offset-background">
                  <AvatarImage src={`https://placehold.co/100x100.png?text=${member.avatar}`} />
                  <AvatarFallback>{member.avatar}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <ScaleIcon className="h-7 w-7 text-primary" />
              Disclaimer & Legal Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive">
                  <p className="font-semibold text-center">"Not a substitute for a licensed lawyer."</p>
                  <p className="text-sm text-center mt-1">The information provided by LegalSphere is for informational purposes only and does not constitute legal advice.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/terms-of-service" className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted transition-colors">
                      <FileText className="h-6 w-6 text-primary" />
                      <span className="font-medium">Terms of Service</span>
                  </Link>
                  <Link href="/privacy-policy" className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted transition-colors">
                      <Shield className="h-6 w-6 text-primary" />
                      <span className="font-medium">Privacy Policy</span>
                  </Link>
              </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
