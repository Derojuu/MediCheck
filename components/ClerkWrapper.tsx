// components/ClerkWrapper.tsx
"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function ClerkWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider
            // Enable CAPTCHA for bot protection
            appearance={{
                elements: {
                    // Ensure CAPTCHA is properly styled
                    captcha: "block"
                }
            }}
        >
            {children}
        </ClerkProvider>
    );
}
