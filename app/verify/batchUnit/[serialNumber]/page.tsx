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

    // const getUserLocation = (): Promise< { latitude: number; longitude: number }> => {
    //     return new Promise((resolve, reject) => {
    //         if (!navigator.geolocation) {
    //             return reject(new Error("Geolocation not supported"));
    //         }

    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 resolve({
    //                     latitude: position.coords.latitude,
    //                     longitude: position.coords.longitude,
    //                 });
    //             },
    //             (err) => reject(err)
    //         );
    //     });
    // }

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
            <div className="flex h-screen items-center justify-center text-lg">
                Verifying unit…
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold text-red-600">Verification Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-xl p-6">
            <select onChange={(e) => setLanguage(e.target.value)} className="border-2 border-black" name="" id="">
                <option value={africanLanguages[0]}>{africanLanguages[0]}</option>
                {africanLanguages.map((lang) => (
                    <option value={lang}>{lang}</option>
                ))}
            </select>
            {aiTranslation ? (
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
