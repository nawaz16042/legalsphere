
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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      // Redirect is handled by the auth context
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">{t('welcomeBack')}</CardTitle>
        <CardDescription>{t('loginDescription')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('emailLabel')}</Label>
            <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
          </div>
          <div className="space-y-2">
              <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t('passwordLabel')}</Label>
                   <Link href="/forgot-password" passHref>
                      <Button variant="link" className="text-xs h-auto p-0" type="button">Forgot Password?</Button>
                  </Link>
              </div>
              <div className="relative">
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
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
              </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('logInButton')}
          </Button>
        </CardFooter>
      </form>
       <CardFooter className="flex-col gap-4 items-center justify-center text-sm">
         <p className="text-muted-foreground">
          {t('dontHaveAccount')}{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            {t('signUpLink')}
          </Link>
        </p>
      </CardFooter>
    </>
  );
}
