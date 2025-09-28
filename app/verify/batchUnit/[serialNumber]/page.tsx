// app/verify/batchUnit/[serialNumber]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { africanLanguages } from "@/database";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Shield, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface GeminiResponse {
    Title: [string, string];
    Summary: [string, string]; 
    Reasons: [string, string[]]; 
    RecommendedAction: [string, string[]];
}

export default function VerifyUnitPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const serialNumber = params.serialNumber as string;
    const sig = searchParams.get("sig");

    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState<boolean | null>(null);
    const [unit, setUnit] = useState<any>(null);
    const [authenticityResultCheck, setAuthenticityResultCheck] = useState<object | undefined>();
    const [batch, setBatch] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [language, setLanguage] = useState(africanLanguages[0]);
    const [aiTranslation, setAiTranslation] = useState<GeminiResponse | undefined>();

    useEffect(() => {
        if (authenticityResultCheck) {
            setAiTranslation(undefined);
            const getComprehensiveInfoFromGemini = async () => {
                const res = await fetch("/api/geminiTranslation", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        language,
                        message: authenticityResultCheck
                    }),
                });
                const data = await res.json();
                setAiTranslation(data.response as GeminiResponse);
            };
            getComprehensiveInfoFromGemini();
        }
    }, [authenticityResultCheck, language]);

    useEffect(() => {
        const verifyUnit = async (latitude: number, longitude: number) => {
            if (!serialNumber || !sig) {
                setError("Missing serial number or signature");
                setLoading(false);
                return;
            }
            try {
                console.log("Verifying unit:", serialNumber, "with sig:", sig, "at location:", latitude, longitude);

                const res = await fetch(`/api/verify/unit/${serialNumber}?sig=${sig}&lat=${latitude}&long=${longitude}`);

                const data = await res.json();
                
                if (!res.ok) {
                    setError(data.error || "Verification failed");
                } else {
                    setValid(data.valid);
                    setUnit(data.unit);
                    setBatch(data.batch);
                    setAuthenticityResultCheck(data.authenticityResultCheck);
                }
            } catch (err) {
                setError("Something went wrong during verification");
                alert(err)
            } finally {
                setLoading(false);
            }
        };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                verifyUnit(latitude, longitude);
            });
        }
    }, [serialNumber, sig]);

    // Mobile header (like manufacturer dashboard)
    const MobileHeader = () => (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg">MediCheck</span>
                </div>
                <ThemeToggle />
            </div>
        </div>
    );

    // Desktop header
    const DesktopHeader = () => (
        <div className="hidden lg:flex items-center justify-between w-full px-8 py-6 border-b bg-background/95 backdrop-blur-sm z-40">
            <div className="flex items-center space-x-2">
                <Shield className="h-7 w-7 text-primary" />
                <span className="font-bold text-2xl">MediCheck</span>
            </div>
            <ThemeToggle />
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
                <MobileHeader />
                <DesktopHeader />
                {/* Background Decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-20 w-56 h-56 bg-purple-500/6 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-500/8 rounded-full blur-xl"></div>
                </div>
                <main className="flex flex-1 items-center justify-center w-full px-2 sm:px-4">
                    <Card className="w-full max-w-xs sm:max-w-sm mx-auto bg-white/90 dark:bg-zinc-900/90 rounded-xl shadow-lg border border-border/60 z-10">
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl font-bold text-foreground text-center">Verifying Unit</CardTitle>
                            <CardDescription className="text-muted-foreground text-center text-xs sm:text-sm">
                                Please wait while we verify this unit. This may take a few seconds.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center space-y-4 py-2">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                <div className="text-sm text-muted-foreground">Verifying unit authenticity...</div>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
                <MobileHeader />
                <DesktopHeader />
                {/* Background Decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-20 w-56 h-56 bg-red-500/6 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-20 left-20 w-40 h-40 bg-orange-500/8 rounded-full blur-xl"></div>
                </div>
                <main className="flex flex-1 items-center justify-center w-full px-2 sm:px-4">
                    <Card className="w-full max-w-md mx-auto bg-white/90 dark:bg-zinc-900/90 rounded-xl shadow-lg border border-border/60 z-10">
                        <CardHeader>
                            <CardTitle className="text-xl sm:text-2xl font-bold text-red-600">Verification Error</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm sm:text-base">{error}</p>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
            <MobileHeader />
            <DesktopHeader />
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-64 h-64 bg-green-500/6 rounded-full blur-2xl"></div>
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-500/8 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-purple-500/10 rounded-full blur-lg transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            <main className="flex flex-1 items-center justify-center w-full px-2 sm:px-4">
                <Card className="w-full max-w-lg mx-auto bg-white/90 dark:bg-zinc-900/90 rounded-xl shadow-lg p-4 sm:p-8 my-8 sm:my-16 border border-border/60 relative z-10">
                    <CardHeader className="pb-2">
                        <CardTitle className="font-bold text-xl sm:text-2xl text-primary">Batch Unit Verification</CardTitle>
                        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                            Serial: <span className="font-mono">{serialNumber}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                            <Badge variant={valid ? "default" : "destructive"} className="text-xs px-3 py-1">
                                {valid === null ? "Checking..." : valid ? "GENUINE" : "SUSPICIOUS"}
                            </Badge>
                            <div className="flex items-center gap-2">
                                <label htmlFor="language" className="text-sm font-medium">Language:</label>
                                <select
                                    id="language"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="border border-border rounded px-2 py-1 text-sm focus:outline-none bg-background dark:bg-zinc-900"
                                >
                                    {africanLanguages.map((lang) => (
                                        <option key={lang} value={lang}>{lang}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {aiTranslation ? (
                            <div className="space-y-4 text-left">
                                <div>
                                    <h2 className="font-semibold text-lg text-primary">{aiTranslation.Title[0]}</h2>
                                    <p className="text-base font-medium">{aiTranslation.Title[1]}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-md">{aiTranslation.Summary[0]}</h3>
                                    <p className="text-sm">{aiTranslation.Summary[1]}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-md">{aiTranslation.Reasons[0]}</h4>
                                    <ul className="list-disc list-inside text-sm pl-2">
                                        {aiTranslation.Reasons[1].map((reason, index) => (
                                            <li key={index}>{reason}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-md">{aiTranslation.RecommendedAction[0]}</h4>
                                    <ul className="list-disc list-inside text-sm pl-2">
                                        {aiTranslation.RecommendedAction[1].map((action, index) => (
                                            <li key={index}>{action}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-8">
                                <span className="text-muted-foreground">Loading translation...</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
