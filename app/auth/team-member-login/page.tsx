"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { Shield, ArrowLeft, Users, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "react-toastify"
import { useSignIn } from "@clerk/nextjs"

export default function TeamMemberLoginPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { signIn } = useSignIn()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    if (!signIn) {
      toast.error("Sign in not initialized")
      return
    }

    setIsLoading(true)

    try {
      // First check if the user exists in our system
      const response = await fetch("/api/auth/team-member-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        // User exists, now send magic link using Clerk
        await signIn.create({
          identifier: email,
          strategy: "email_link",
          redirectUrl: `${window.location.origin}/dashboard`
        })

        setEmailSent(true)
        toast.success("Magic link sent! Check your email.")
      } else {
        toast.error(data.error || "Failed to send login email")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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
                <div className="relative bg-gradient-to-r from-primary to-accent p-2 sm:p-3 rounded-xl">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div>
                <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  MediCheck
                </span>
                <div className="text-xs sm:text-sm text-muted-foreground">Team Member Portal</div>
              </div>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 relative z-10">
          
          {/* Back Link */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Link href="/auth/login" className="flex items-center space-x-2 hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </div>

          <Card className="glass-effect border-2 border-primary/10 shadow-2xl backdrop-blur-xl theme-transition hover:shadow-3xl transition-all duration-500">
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Team Member Login
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Enter your email to receive a secure login link
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {!emailSent ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-base"
                      required
                    />
                  </div>

                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium py-3 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Magic Link...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Magic Link
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                      Magic Link Sent!
                    </h3>
                    <p className="text-muted-foreground">
                      We've sent a login link to <strong>{email}</strong>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Click the link in your email to securely login to your team dashboard.
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      💡 Didn't receive the email? Check your spam folder or try again with a different email address.
                    </p>
                  </div>

                  <Button 
                    onClick={() => {
                      setEmailSent(false)
                      setEmail("")
                    }}
                    variant="outline"
                    className="w-full cursor-pointer"
                  >
                    Try Different Email
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Help */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact your organization administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}