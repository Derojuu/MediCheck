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
      {/* Navigation - Updated to match landing page */}
      <nav className="border-b bg-card/95 backdrop-blur-xl sticky top-0 z-50 shadow-lg glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-4">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-primary to-accent p-2 rounded-xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-foreground">MedChain</span>
                <span className="text-xs text-muted-foreground font-mono">Blockchain Verified</span>
              </div>
            </Link>
            <Link href="/">
              <Button 
                variant="outline"
                className="cursor-pointer bg-transparent hover:bg-primary/10 transition-all duration-300 border-2 border-primary/30 hover:border-primary/60 font-medium px-6 py-2.5"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content with matching background effects */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>

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
                  className="w-full cursor-pointer bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 font-medium py-3 text-white rounded-lg"
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
