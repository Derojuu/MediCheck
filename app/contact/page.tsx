"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, ArrowLeft, Mail, Send, MessageSquare, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "react-toastify"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.")
      setFormData({ name: "", email: "", subject: "", message: "" })
      setIsSubmitting(false)
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/4 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-accent/6 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-border/50 bg-card/95 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-primary to-accent p-1.5 sm:p-2 rounded-xl shadow-lg">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg sm:text-2xl text-foreground">MediCheck</span>
                <span className="text-xs text-muted-foreground font-mono hidden sm:block">Blockchain Verified</span>
              </div>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 cursor-pointer transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to our team and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-xl sm:text-2xl">
                  <MessageSquare className="h-6 w-6 mr-3 text-primary" />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Send us a Message
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="border-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="border-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please provide details about your inquiry..."
                      rows={6}
                      required
                      className="border-primary/20 focus:border-primary resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Email Support */}
            <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Mail className="h-5 w-5 mr-2 text-primary" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">General Inquiries:</p>
                <a href="mailto:hellomedicheck@gmail.com" className="text-primary hover:underline block">
                  hellomedicheck@gmail.com
                </a>
                <p className="text-muted-foreground mt-4">Technical Support:</p>
                <a href="mailto:hellomedicheck@gmail.com" className="text-primary hover:underline block">
                  hellomedicheck@gmail.com
                </a>
              </CardContent>
            </Card>

            {/* Follow Us */}
            <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Follow Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Link
                    href="https://x.com/medi_check2025"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-all duration-300"
                  >
                    <svg className="h-6 w-6" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#55ACEE" d="M31.993,6.077C30.816,6.6,29.552,6.953,28.223,7.11c1.355-0.812,2.396-2.098,2.887-3.63c-1.269,0.751-2.673,1.299-4.168,1.592C25.744,3.797,24.038,3,22.149,3c-3.625,0-6.562,2.938-6.562,6.563c0,0.514,0.057,1.016,0.169,1.496C10.301,10.785,5.465,8.172,2.227,4.201c-0.564,0.97-0.888,2.097-0.888,3.3c0,2.278,1.159,4.286,2.919,5.464c-1.075-0.035-2.087-0.329-2.972-0.821c-0.001,0.027-0.001,0.056-0.001,0.082c0,3.181,2.262,5.834,5.265,6.437c-0.55,0.149-1.13,0.23-1.729,0.23c-0.424,0-0.834-0.041-1.234-0.117c0.834,2.606,3.259,4.504,6.13,4.558c-2.245,1.76-5.075,2.811-8.15,2.811c-0.53,0-1.053-0.031-1.566-0.092C2.905,27.913,6.355,29,10.062,29c12.072,0,18.675-10.001,18.675-18.675c0-0.284-0.008-0.568-0.02-0.85C30,8.55,31.112,7.395,31.993,6.077z"/>
                    </svg>
                  </Link>
                  <Link
                    href="https://www.linkedin.com/company/medicheck25"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-all duration-300"
                  >
                    <svg className="h-6 w-6" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#2867b2" d="M512,64c0,-35.323 -28.677,-64 -64,-64l-384,0c-35.323,0 -64,28.677 -64,64l0,384c0,35.323 28.677,64 64,64l384,0c35.323,0 64,-28.677 64,-64l0,-384Z"/>
                      <rect fill="#fff" height="257.962" width="85.76" x="61.053" y="178.667"/>
                      <path fill="#fff" d="M104.512,54.28c-29.341,0-48.512,19.29-48.512,44.573c0,24.752,18.588,44.574,47.377,44.574l0.554,0c29.903,0,48.516-19.822,48.516-44.574c-0.555-25.283-18.611-44.573-47.935-44.573Z"/>
                      <path fill="#fff" d="M357.278,172.601c-45.49,0-65.866,25.017-77.276,42.589l0,-36.523l-85.738,0c1.137,24.197,0,257.961,0,257.961l85.737,0l0,-144.064c0,-7.711,0.554,-15.42,2.827,-20.931c6.188,-15.4,20.305,-31.352,43.993,-31.352c31.012,0,43.436,23.664,43.436,58.327l0,138.02l85.741,0l0,-147.93c0,-79.237-42.305,-116.097-98.72,-116.097Z"/>
                    </svg>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </div>
      </main>
    </div>
  )
}
