import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkWrapper } from "@/components/ClerkWrapper";
import { ToastWrapper } from "@/components/ToastWrapper";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "MedChain - Blockchain Medication Verification",
  description: "Professional blockchain-powered medication verification and traceability system",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} min-h-screen bg-background font-sans antialiased theme-transition`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ClerkWrapper>
            <ToastWrapper />
            <main className="page-transition">
              {children}
            </main>
          </ClerkWrapper>
        </ThemeProvider>
      </body>
    </html>

  )
}
