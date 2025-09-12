
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScaleIcon } from "@/components/icons/ScaleIcon";
import { ShieldCheck, DatabaseZap, Users, BrainCircuit, FileText, Shield, Info } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Link from "next/link";
import React from "react";

const teamMembers = [
    { name: "Nawaz Khan", role: "Founder and Software Engineer", avatar: "NK", bio: "Nawaz is a passionate software engineer with a vision to democratize legal information in India. He believes in the power of technology to bridge the justice gap." },
];

function AboutContent() {
  const { t } = useLocale();
  return (
    <main className="space-y-8">
      <DialogHeader className="text-center">
        <DialogTitle className="text-3xl font-bold tracking-tight text-primary lg:text-4xl">{t('aboutLegalSphere')}</DialogTitle>
        <DialogDescription className="text-base text-muted-foreground max-w-3xl mx-auto">{t('missionStatement')}</DialogDescription>
      </DialogHeader>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <ScaleIcon className="h-6 w-6 text-primary" />
              <span className="text-xl">{t('ourMission')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              {t('missionDescription')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <span className="text-xl">{t('howTheAiWorks')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                  <ShieldCheck className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                  <div>
                      <h4 className="font-semibold">{t('privacyFirst')}</h4>
                      <p className="text-muted-foreground text-xs">{t('privacyDescription')}</p>
                  </div>
              </div>
               <div className="flex items-start gap-4">
                  <DatabaseZap className="h-5 w-5 text-blue-500 mt-1 shrink-0" />
                  <div>
                      <h4 className="font-semibold">{t('verifiedSources')}</h4>
                      <p className="text-muted-foreground text-xs">{t('sourcesDescription')}</p>
                  </div>
              </div>
          </CardContent>
        </Card>
      </div>

      <Card className="text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <Users className="h-7 w-7 text-primary" />
            {t('meetTheTeam')}
          </CardTitle>
          <CardDescription className="max-w-2xl mx-auto text-sm">
            {t('teamDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-center p-6 gap-6">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex flex-col items-center text-center max-w-xs">
              <Avatar className="h-20 w-20 mb-3 ring-2 ring-primary ring-offset-2 ring-offset-background">
                <AvatarImage src={`https://placehold.co/100x100.png?text=${member.avatar}`} />
                <AvatarFallback>{member.avatar}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-md">{member.name}</h3>
              <p className="text-xs text-primary mb-1">{member.role}</p>
              <p className="text-xs text-muted-foreground">{member.bio}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <ScaleIcon className="h-6 w-6 text-primary" />
            Disclaimer & Legal Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive">
                <p className="font-semibold text-center text-sm">"Not a substitute for a licensed lawyer."</p>
                <p className="text-xs text-center mt-1">The information provided by LegalSphere is for informational purposes only and does not constitute legal advice.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Link href="/dashboard/terms-of-service" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium text-sm">Terms of Service</span>
                </Link>
                <Link href="/dashboard/privacy-policy" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="font-medium text-sm">Privacy Policy</span>
                </Link>
            </div>
        </CardContent>
      </Card>
    </main>
  );
}


export function AboutDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl p-0">
        <ScrollArea className="max-h-[80vh]">
            <div className="p-6 md:p-8">
              <AboutContent />
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
