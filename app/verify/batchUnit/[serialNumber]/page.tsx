// app/verify/batchUnit/[serialNumber]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { africanLanguages } from "@/database";

interface GeminiResponse {
    Title: [string, string];
    Summary: [string, string]; 
    Reasons: [string, string[]]; 
    RecommendedAction: [string, string[]];
}
import { ThemeToggle } from "@/components/theme-toggle";

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
    const [aiTranslation, setAiTranslation] = useState<GeminiResponse | undefined>()

    useEffect(() => {
        if (authenticityResultCheck) {

            setAiTranslation(undefined);

            const getComprehensiveInfoFromGemini = async () => {

                console.log(language, authenticityResultCheck)

                const res = await fetch("/api/geminiTranslation", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        language,
                        message: authenticityResultCheck
                    }),
                });

                const data = await res.json();
                console.log(data.response)
                setAiTranslation(data.response as GeminiResponse)

                // if (!res.ok) throw new Error(data.error || "Traslation Failed");
            }

            getComprehensiveInfoFromGemini();
        }
    }, [authenticityResultCheck, language])


    useEffect(() => {
        const verifyUnit = async (latitude: number, longitude: number) => {

            if (!serialNumber || !sig) {
                setError("Missing serial number or signature");
                setLoading(false);
                return;
            }

            try {

                const res = await fetch(`/api/verify/unit/${serialNumber}?sig=${sig}&lat=${latitude}&long=${longitude}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "Verification failed");
                }
                else {
                    setValid(data.valid);
                    setUnit(data.unit);
                    setBatch(data.batch);
                    setAuthenticityResultCheck(data.authenticityResultCheck);
                }
            }
            catch (err) {
                console.error(err);
                setError("Something went wrong");
            }
            finally {
                setLoading(false);
            }
        }


        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                verifyUnit(latitude, longitude);
            })
        }
    }, [serialNumber, sig]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-base sm:text-lg px-4 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-20 w-56 h-56 bg-purple-500/6 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-500/8 rounded-full blur-xl"></div>
                </div>
                <div className="absolute top-6 right-6 z-10">
                    <ThemeToggle />
                </div>
                <div className="relative z-10">Verifying unit…</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 sm:p-6 text-center relative overflow-hidden min-h-screen">
                {/* Background Decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-20 w-56 h-56 bg-red-500/6 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-20 left-20 w-40 h-40 bg-orange-500/8 rounded-full blur-xl"></div>
                </div>
                <div className="absolute top-6 right-6 z-10">
                    <ThemeToggle />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-red-600 relative z-10">Verification Error</h1>
                <p className="text-sm sm:text-base relative z-10">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-4 sm:p-6 text-center relative overflow-hidden min-h-screen">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-64 h-64 bg-green-500/6 rounded-full blur-2xl"></div>
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-500/8 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-purple-500/10 rounded-full blur-lg transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            <div className="absolute top-6 right-6 z-10">
                <ThemeToggle />
            </div>
            <select onChange={(e) => setLanguage(e.target.value)} className="border-2 border-black" name="" id="">
                <option value={africanLanguages[0]}>{africanLanguages[0]}</option>
                {africanLanguages.map((lang) => (
                    <option value={lang}>{lang}</option>
                ))}
            </select>
            {aiTranslation ?
                (
                    <div className="space-y-4">
                        <h1>{aiTranslation?.Title[0]}: <br /> {aiTranslation?.Title[1]}</h1>
                        <h2>{aiTranslation?.Summary[0]}: <br /> {aiTranslation?.Summary[1]}</h2>
                        <div>
                            <h3>{aiTranslation?.Reasons[0]}:</h3>
                            <ul>
                                {aiTranslation?.Reasons[1].map((reason, index) => (
                                    <li key={index}>{reason}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3>{aiTranslation?.RecommendedAction[0]}:</h3>
                            <ul>
                                {aiTranslation?.RecommendedAction[1].map((reason, index) => (
                                    <li key={index}>{reason}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )
                :
                (
                    <p>LOADING....</p>
                )
        }

        </div>
    );
}
