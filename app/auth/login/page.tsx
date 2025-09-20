"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSignIn, useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { getRedirectPath } from "@/utils"


export default function LoginPage() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { signIn, setActive } = useSignIn();

  const { user, isSignedIn } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    if (!signIn) return;

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      console.log("Sign-in result:", result);

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Successfully signed in!");
      }

    }
    catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isSignedIn && user) {

      const role = user.publicMetadata?.role as string | undefined;

      const orgType = user.publicMetadata?.organizationType as string | undefined;

      console.log("User Role:", role);
      
      console.log("Organization Type:", orgType);

      const redirectPath = getRedirectPath(role, orgType);

      router.push(redirectPath);
    }
  }, [isSignedIn, user, router]);


  return (
    <div className="min-h-screen bg-background">
      {/* CAPTCHA element for Clerk Smart CAPTCHA */}
      <div id="clerk-captcha"></div>
      {/* Navigation - Updated to match landing page */}
      <nav className="border-b border-border/50 bg-card/95 backdrop-blur-xl sticky top-0 z-50 shadow-lg glass-effect">
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
                <span className="font-bold text-lg sm:text-2xl text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">MedChain</span>
                <span className="text-xs text-muted-foreground font-mono hidden sm:block">Blockchain Verified</span>
              </div>
            </Link>
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
      </nav>

      {/* Main Content with matching background effects */}
      <section className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8"></div>
        <div className="absolute top-20 left-4 sm:left-10 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-4 sm:right-10 w-48 h-48 sm:w-80 sm:h-80 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-md mx-auto animate-slide-in-up">
          <Card className="glass-effect border-2 border-primary/20 shadow-2xl backdrop-blur-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="font-bold text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2 text-lg">
                Sign in to your MedChain account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-background/50 border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 rounded-lg px-4 py-3"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-background/50 border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 rounded-lg px-4 py-3"
                    required
                  />
                </div>
                <Button 
                  disabled={isLoading} 
                  type="submit" 
                  variant="gradient"
                  size="lg"
                  className="w-full cursor-pointer font-medium shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  {isLoading ? "Loading..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/auth/register" className="text-primary hover:text-accent transition-colors duration-300 font-medium hover:underline">
                    Register here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
