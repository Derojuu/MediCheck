// components/ClerkWrapper.tsx
"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function ClerkWrapper({ children }: { children: React.ReactNode }) {
    return <ClerkProvider>{children}</ClerkProvider>;
}
