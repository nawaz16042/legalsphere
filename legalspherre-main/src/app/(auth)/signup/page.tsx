
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { FirebaseError } from 'firebase/app';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName || !phoneNumber || !age) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      await signup(email, password, { fullName, phoneNumber, age: parseInt(age) });
      toast({
          title: 'Verification Email Sent',
          description: "We've sent a verification link to your email address. Please verify your email before logging in.",
      });
      router.push('/login');
    } catch (error) {
        if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
            toast({
                title: 'Signup Failed',
                description: "This email address is already registered. Please log in or use a different email.",
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Signup Failed',
                description: (error as Error).message,
                variant: 'destructive',
            });
        }
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">{t('createAccount')}</CardTitle>
        <CardDescription>{t('signupDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">{t('fullNameLabel')}</Label>
          <Input id="fullName" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading} />
        </div>
         <div className="space-y-2">
          <Label htmlFor="phoneNumber">{t('phoneLabel')}</Label>
          <Input id="phoneNumber" type="tel" placeholder="+91 98765 43210" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={loading} />
        </div>
         <div className="space-y-2">
            <Label htmlFor="age">{t('ageLabel')}</Label>
            <Select onValueChange={setAge} value={age} disabled={loading}>
                <SelectTrigger id="age">
                    <SelectValue placeholder="Select your age range" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="18">18-25</SelectItem>
                    <SelectItem value="26">26-35</SelectItem>
                    <SelectItem value="36">36-45</SelectItem>
                    <SelectItem value="46">46-60</SelectItem>
                    <SelectItem value="61">61+</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t('emailLabel')}</Label>
          <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
        </div>
        <div className="space-y-2 relative">
          <Label htmlFor="password">{t('passwordLabel')}</Label>
          <Input 
            id="password" 
            type={showPassword ? 'text' : 'password'} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            disabled={loading}
            className="pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 top-6 flex items-center px-3 text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full" type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('signUpButton')}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          {t('alreadyHaveAccount')}{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            {t('logInLink')}
          </Link>
        </p>
      </CardFooter>
    </form>
  );
}
