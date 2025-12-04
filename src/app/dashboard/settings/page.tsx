
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { Languages, Accessibility, ShieldCheck, CreditCard, Star, MessageSquare, Clock, BrainCircuit, KeyRound, Lock, UserX, LifeBuoy, Loader2 } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import Link from 'next/link';
import { useUserStats } from '@/hooks/useUserStats';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
    const { locale, setLocale, t } = useLocale();
    const { toast } = useToast();
    const { reauthenticateAndDeleteUser } = useAuth();
    const [password, setPassword] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    
    const {
        settings,
        setVoiceMode,
        setFontSize,
        setHighContrast,
        setVoiceSpeed,
        setStoreHistory,
    } = useSettings();
    const { stats } = useUserStats();


    const handleSaveChanges = () => {
        // Settings are saved automatically via the context, but we can still show a toast
        toast({
            title: t('settingsSavedTitle'),
            description: t('settingsSavedDesc'),
        });
    };

    const handleDeleteAccount = async () => {
        if (!password) {
            toast({
                title: t('passwordRequiredTitle'),
                description: t('passwordRequiredDesc'),
                variant: "destructive"
            });
            return;
        }
        setIsDeleting(true);
        try {
            await reauthenticateAndDeleteUser(password);
            toast({
                title: t('accountDeletedTitle'),
                description: t('accountDeletedDesc'),
            });
            // The user will be redirected by the AuthContext
        } catch (error) {
            toast({
                title: t('deletionFailedTitle'),
                description: (error as Error).message,
                variant: "destructive"
            });
            setIsDeleting(false);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-primary">{t('settingsTitle')}</h1>
                <p className="text-muted-foreground">{t('settingsDescription')}</p>
            </header>

            <div className="grid gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><Languages /> {t('languageAndRegion')}</CardTitle>
                        <CardDescription>{t('languageAndRegionDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="max-w-sm space-y-2">
                             <Label htmlFor="language">{t('preferredLanguage')}</Label>
                             <Select value={locale} onValueChange={(value) => setLocale(value as any)}>
                                <SelectTrigger id="language" className="w-full">
                                    <SelectValue placeholder={t('selectLanguage')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="hi">हिन्दी</SelectItem>
                                    <SelectItem value="bn">বাংলা</SelectItem>
                                    <SelectItem value="ta">தமிழ்</SelectItem>
                                    <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><Accessibility /> {t('accessibility')}</CardTitle>
                        <CardDescription>{t('accessibilityDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="voice-mode" className="flex flex-col gap-1">
                                <span>{t('voiceModePreference')}</span>
                                <span className="text-sm text-muted-foreground">{t('voiceModePreferenceDesc')}</span>
                            </Label>
                            <Switch id="voice-mode" checked={settings.voiceMode} onCheckedChange={setVoiceMode} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="font-size">{t('fontSize')}: {settings.fontSize}px</Label>
                            <Slider id="font-size" min={12} max={24} step={1} value={[settings.fontSize]} onValueChange={(value) => setFontSize(value[0])} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="voice-speed">{t('voiceSpeed')}: {settings.voiceSpeed.toFixed(1)}x</Label>
                            <Slider id="voice-speed" min={0.5} max={2} step={0.1} value={[settings.voiceSpeed]} onValueChange={(value) => setVoiceSpeed(value[0])} />
                        </div>
                        <div className="flex items-center justify-between">
                             <Label htmlFor="high-contrast" className="flex flex-col gap-1">
                                <span>{t('highContrastMode')}</span>
                                <span className="text-sm text-muted-foreground">{t('highContrastModeDesc')}</span>
                            </Label>
                            <Switch id="high-contrast" checked={settings.highContrast} onCheckedChange={setHighContrast} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><ShieldCheck /> {t('dataAndPrivacy')}</CardTitle>
                        <CardDescription>{t('dataAndPrivacyDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                             <Label htmlFor="store-history" className="flex flex-col gap-1">
                                <span>{t('storeHistory')}</span>
                                <span className="text-sm text-muted-foreground">{t('storeHistoryDesc')}</span>
                            </Label>
                            <Switch id="store-history" checked={settings.storeHistory} onCheckedChange={setStoreHistory} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><CreditCard /> {t('subscriptionAndBilling')}</CardTitle>
                        <CardDescription>{t('subscriptionAndBillingDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Current Plan Section */}
                        <div className="space-y-4">
                            <div className="p-6 rounded-lg bg-primary/10 border border-primary/20">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                    <div>
                                        <h5 className="font-bold text-primary flex items-center gap-2 text-lg"><Star className="h-5 w-5"/> {t('freePlan')}</h5>
                                        <p className="text-sm text-muted-foreground mt-1">{t('freePlanDesc')}</p>
                                    </div>
                                    <Button asChild>
                                        <Link href="/dashboard/pricing">{t('upgradeToPremium')}</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Usage Stats Section */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-lg">{t('usageStatistics')}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <Card className="p-4">
                                    <CardContent className="p-2 flex flex-col items-center gap-2">
                                        <MessageSquare className="h-6 w-6 text-primary" />
                                        <p className="text-2xl font-bold">{stats.dailyPromptCount}</p>
                                        <p className="text-sm text-muted-foreground">{t('queriesToday')}</p>
                                    </CardContent>
                                </Card>
                                <Card className="p-4">
                                    <CardContent className="p-2 flex flex-col items-center gap-2">
                                        <Clock className="h-6 w-6 text-primary" />
                                        <p className="text-2xl font-bold">0<span className="text-lg">m</span></p>
                                        <p className="text-sm text-muted-foreground">{t('voiceMinutesUsed')}</p>
                                    </CardContent>
                                </Card>
                                <Card className="p-4">
                                    <CardContent className="p-2 flex flex-col items-center gap-2">
                                        <BrainCircuit className="h-6 w-6 text-primary" />
                                        <p className="text-2xl font-bold">~15k</p>
                                        <p className="text-sm text-muted-foreground">{t('llmTokensConsumed')}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Billing History Section */}
                        <div className="space-y-4">
                             <h4 className="font-semibold text-lg">{t('billingHistory')}</h4>
                             <div className="border rounded-lg p-4 text-center text-muted-foreground">
                                <p>{t('noBillingHistory')}</p>
                            </div>
                        </div>
                        
                        {/* Payment Methods Section */}
                         <div className="space-y-4">
                             <h4 className="font-semibold text-lg">{t('paymentMethods')}</h4>
                            <div className="flex justify-between items-center p-4 border rounded-lg">
                                 <p className="text-muted-foreground">{t('noPaymentMethods')}</p>
                                <Button variant="outline">{t('addMethod')}</Button>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><LifeBuoy /> {t('supportAndFeedback')}</CardTitle>
                        <CardDescription>{t('supportAndFeedbackDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/support">{t('goToSupportCenter')}</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><KeyRound /> {t('securityAndPrivacy')}</CardTitle>
                        <CardDescription>{t('securityAndPrivacyDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="flex items-center justify-between">
                            <Label htmlFor="change-password">
                                <span className="font-semibold">{t('changePassword')}</span>
                                <p className="text-sm text-muted-foreground">{t('changePasswordDesc')}</p>
                            </Label>
                            <Button variant="outline" asChild id="change-password"><Link href="/dashboard/account/change-password"><Lock className="mr-2 h-4 w-4" />{t('changePassword')}</Link></Button>
                        </div>
                        <div className="flex items-center justify-between">
                             <Label htmlFor="enable-2fa" className="flex flex-col gap-1">
                                <span>{t('enable2FA')}</span>
                                <span className="text-sm text-muted-foreground">{t('enable2FADesc')}</span>
                            </Label>
                            <Switch id="enable-2fa" />
                        </div>
                        <div>
                             <h4 className="font-semibold text-lg text-destructive">{t('deleteAccount')}</h4>
                             <p className="text-sm text-muted-foreground mb-4">{t('deleteAccountDesc')}</p>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                     <Button variant="destructive"><UserX className="mr-2 h-4 w-4" />{t('deleteMyAccount')}</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>{t('areYouSure')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('deleteAccountWarning')}
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="py-2">
                                        <Label htmlFor="password-confirm" className="sr-only">{t('passwordLabel')}</Label>
                                        <Input
                                            id="password-confirm"
                                            type="password"
                                            placeholder={t('enterPasswordPlaceholder')}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isDeleting}
                                        />
                                    </div>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isDeleting}>{t('cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {t('deleteAccount')}
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>

                    </CardContent>
                </Card>
            </div>
             <div className="flex justify-end">
                <Button onClick={handleSaveChanges}>{t('savePreferences')}</Button>
            </div>
        </div>
    );
}

    