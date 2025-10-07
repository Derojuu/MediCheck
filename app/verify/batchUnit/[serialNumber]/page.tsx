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
    const [showFullDetails, setShowFullDetails] = useState(false);

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
                    <Card className="w-full max-w-xs sm:max-w-sm mx-auto rounded-xl shadow-lg z-10">
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl font-bold text-foreground text-center">Verifying Unit</CardTitle>
                            <CardDescription className="text-muted-foreground text-center text-xs sm:text-sm">
                                Please wait while we verify this unit. This may take a few seconds.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center space-y-4 py-2">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                    <Card className="w-full max-w-md mx-auto rounded-xl shadow-lg z-10">
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
            <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-20 lg:pt-16 pb-8">
                <div className="w-full max-w-7xl mx-auto space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 lg:gap-6 mb-6">
                        <div className="flex-1 min-w-0">
                            <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-foreground mb-2 leading-tight">
                                Batch Unit Verification
                            </h1>
                            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                                Serial: <span className="font-mono text-foreground text-sm sm:text-base lg:text-lg break-all">{serialNumber}</span>
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row sm:items-center gap-3 lg:gap-4 shrink-0">
                            <Badge variant={valid ? "default" : "destructive"} className="text-sm px-4 py-2 w-fit">
                                {valid === null ? "Checking..." : valid ? "GENUINE" : "SUSPICIOUS"}
                            </Badge>
                            <div className="flex items-center gap-2">
                                <label htmlFor="language" className="text-sm font-medium">Language:</label>
                                <select
                                    id="language"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground min-w-[120px]"
                                >
                                    {africanLanguages.map((lang) => (
                                        <option key={lang} value={lang}>{lang}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {aiTranslation ? (
                        <div className="space-y-6">
                            {/* Title and Summary Cards - Always Visible */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg sm:text-xl text-primary">
                                            {aiTranslation.Title[0]}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-base font-medium text-foreground leading-relaxed">
                                            {aiTranslation.Title[1]}
                                        </p>
                                    </CardContent>
                                </Card>
                                
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg sm:text-xl text-primary">
                                            {aiTranslation.Summary[0]}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                            {aiTranslation.Summary[1]}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* See More Button */}
                            {!showFullDetails && (
                                <div className="flex justify-center lg:justify-start">
                                    <button
                                        onClick={() => setShowFullDetails(true)}
                                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
                                    >
                                        See More Details
                                    </button>
                                </div>
                            )}

                            {/* Detailed Content Cards - Expandable */}
                            {showFullDetails && (
                                <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg sm:text-xl text-primary">
                                                    {aiTranslation.Reasons[0]}
                                                </CardTitle>
                                                <CardDescription>
                                                    Analysis and reasoning behind the verification result
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="space-y-3">
                                                    {aiTranslation.Reasons[1].map((reason, index) => (
                                                        <li key={index} className="flex items-start gap-3 text-sm sm:text-base">
                                                            <span className="text-primary font-bold mt-1 flex-shrink-0">•</span>
                                                            <span className="text-muted-foreground leading-relaxed">{reason}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                        
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg sm:text-xl text-primary">
                                                    {aiTranslation.RecommendedAction[0]}
                                                </CardTitle>
                                                <CardDescription>
                                                    Recommended next steps and actions to take
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="space-y-3">
                                                    {aiTranslation.RecommendedAction[1].map((action, index) => (
                                                        <li key={index} className="flex items-start gap-3 text-sm sm:text-base">
                                                            <span className="text-green-600 font-bold mt-1 flex-shrink-0">✓</span>
                                                            <span className="text-muted-foreground leading-relaxed">{action}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    </div>
                                    
                                    {/* Show Less Button - At the bottom of expanded content */}
                                    <div className="flex justify-center lg:justify-start">
                                        <button
                                            onClick={() => setShowFullDetails(false)}
                                            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
                                        >
                                            Show Less
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12">
                                <div className="flex items-center justify-center">
                                    <div className="text-center space-y-3">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                                        <span className="text-muted-foreground text-base">Loading translation...</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
