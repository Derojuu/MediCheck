"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { authRoutes } from "@/utils";
import { useSignIn } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Shield, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const { signIn } = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      // Use Clerk's built-in password reset functionality
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      toast.success("Password reset code sent! Check your email for the OTP.");
      // Redirect to reset password page with email parameter
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      console.error("Reset password error:", error);
      
      if (error.errors) {
        const errorMessage = error.errors[0]?.message || "Failed to send reset email";
        toast.error(errorMessage);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden page-transition">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -right-32 w-64 h-64 bg-primary/8 rounded-full blur-2xl bg-decoration gradient-transition animate-pulse duration-[8000ms]"></div>
          <div className="absolute bottom-40 -left-24 w-48 h-48 bg-accent/6 rounded-full blur-xl bg-decoration gradient-transition animate-pulse duration-[6000ms] delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md glass-effect border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground">Check Your Email</CardTitle>
              <CardDescription className="text-muted-foreground">
                We've sent a password reset link to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                <p>Didn't receive the email? Check your spam folder or</p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary cursor-pointer"
                  onClick={() => setEmailSent(false)}
                >
                  try again
                </Button>
              </div>
              <div className="text-center">
                <Link href={authRoutes.login}>
                  <Button variant="outline" className="w-full cursor-pointer">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden page-transition">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-32 w-64 h-64 bg-primary/8 rounded-full blur-2xl bg-decoration gradient-transition animate-pulse duration-[8000ms]"></div>
        <div className="absolute bottom-40 -left-24 w-48 h-48 bg-accent/6 rounded-full blur-xl bg-decoration gradient-transition animate-pulse duration-[6000ms] delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-primary/4 rounded-full blur-lg bg-decoration gradient-transition animate-pulse duration-[4000ms] delay-2000"></div>
      </div>

      {/* Navigation - Updated to match login page */}
      <nav className="border-b border-border/50 bg-card/95 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 shadow-lg glass-effect theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-primary to-accent p-1.5 sm:p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg sm:text-2xl text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">MediCheck</span>
                <span className="text-xs text-muted-foreground font-mono hidden sm:block">Blockchain Verified</span>
              </div>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle />
              <Link href="/">
                <Button 
                  variant="outline"
                  size="sm"
                  className="cursor-pointer font-medium text-xs sm:text-sm px-3 sm:px-6"
                >
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 flex items-center justify-center min-h-screen pt-20">
        <Card className="w-full max-w-md glass-effect border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">Reset Your Password</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="glass-input"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>

              <div className="text-center">
                <Link 
                  href={authRoutes.login} 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Remember your password? Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}