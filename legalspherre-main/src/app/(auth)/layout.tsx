
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-background flex min-h-screen flex-col items-center justify-center p-4">
       <div className="absolute top-4 left-4">
         <Button variant="ghost" asChild>
          <Link href="/">&larr; Back to Home</Link>
        </Button>
      </div>
      <div className="w-full max-w-sm">
        <div className="relative z-10">
          <div className="auth-card space-y-6">
            <Link href="/" className="flex justify-center">
              <Logo />
            </Link>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
