"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { authRoutes } from "@/utils";
import { useSignIn } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Shield, ArrowLeft, Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useSignIn();

  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpCode || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: otpCode,
        password: password,
      });

      toast.success("Password updated successfully!");
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Reset password error:", error);
      
      if (error.errors) {
        const errorMessage = error.errors[0]?.message || "Failed to reset password";
        toast.error(errorMessage);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden page-transition">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-32 w-64 h-64 bg-primary/8 rounded-full blur-2xl bg-decoration gradient-transition animate-pulse duration-[8000ms]"></div>
        <div className="absolute bottom-40 -left-24 w-48 h-48 bg-accent/6 rounded-full blur-xl bg-decoration gradient-transition animate-pulse duration-[6000ms] delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-primary/4 rounded-full blur-lg bg-decoration gradient-transition animate-pulse duration-[4000ms] delay-2000"></div>
      </div>

      {/* Navigation */}
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
            <CardTitle className="text-2xl font-bold text-foreground">Set New Password</CardTitle>
            <CardDescription className="text-muted-foreground">
              {email ? (
                <>Enter the verification code sent to <strong>{email}</strong> and your new password</>
              ) : (
                "Enter the verification code from your email and your new password"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otpCode" className="text-foreground font-medium">
                  Verification Code
                </Label>
                <Input
                  id="otpCode"
                  type="text"
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                  className="glass-input text-center tracking-widest text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="glass-input pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>At least 8 characters long</li>
                  <li>Mix of letters, numbers, and symbols recommended</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Updating Password..." : "Update Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}