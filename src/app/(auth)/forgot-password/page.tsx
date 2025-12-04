
"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { sendPasswordReset } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setSubmitted(true);
    } catch (error) {
       toast({
        title: 'An Error Occurred',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Forgot Your Password?</CardTitle>
        <CardDescription>
          {submitted 
            ? "Check your inbox for the next steps." 
            : "No problem. Enter your email address and we'll send you a link to reset it."
          }
        </CardDescription>
      </CardHeader>
      {submitted ? (
         <CardContent className="text-center">
            <Mail className="h-12 w-12 mx-auto text-primary mb-4" />
            <p className="text-muted-foreground">
                If an account with the email <span className="font-semibold text-foreground">{email}</span> exists, you will receive an email with instructions on how to reset your password.
            </p>
         </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
                </Button>
            </CardFooter>
        </form>
      )}
      <CardFooter>
        <Button variant="link" className="w-full" asChild>
            <Link href="/login">Back to Log In</Link>
        </Button>
      </CardFooter>
    </>
  );
}
