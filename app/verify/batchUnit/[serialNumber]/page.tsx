// app/verify/batchUnit/[serialNumber]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { getComprehensiveUnitVerificationExplanation } from "@/lib/verificationResponse";

export default function VerifyUnitPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const serialNumber = params.serialNumber as string;
    const sig = searchParams.get("sig");

    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState<boolean | null>(null);
    const [unit, setUnit] = useState<any>(null);
    const [authenticityResultCheck, setAuthenticityResultCheck] = useState<object>({});
    const [batch, setBatch] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [language, setLanguage] = useState("ENGLISH");
    const [aiTranslation, setAiTranslation] = useState<object>({})

    const getUserLocation = (): Promise< { latitude: number; longitude: number }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                return reject(new Error("Geolocation not supported"));
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (err) => reject(err)
            );
        });
    }

    useEffect(() => {
        if (authenticityResultCheck) {
            const getComprehensiveInfoFromGemini = async () => {
                const translateAuthenticityChecks = await getComprehensiveUnitVerificationExplanation("FRENCH", authenticityResultCheck);
                setAiTranslation(translateAuthenticityChecks);
            }
        }
    }, [])


    useEffect(() => {
        const verifyUnit = async (latitude: number, longitude: number) => {

            if (!serialNumber || !sig) {
                setError("Missing serial number or signature");
                setLoading(false);
                return;
            }

            try {

                console.log(serialNumber, sig)
                const res = await fetch(`/api/verify/unit/${serialNumber}?sig=${sig}&lat=${latitude}&long=${longitude}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "Verification failed");
                }
                else {
                    setValid(data.valid);
                    setUnit(data.unit);
                    setBatch(data.batch);
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
        <div className="max-w-xl mx-auto p-6 text-center">
            {valid ? (
                <div className="rounded-xl bg-green-100 p-6">
                    <h1 className="text-3xl font-bold text-green-700">✅ Authentic Unit</h1>
                </div>
            ) : (
                <div className="rounded-xl bg-red-100 p-6">
                    <h1 className="text-3xl font-bold text-red-700">⚠️ Invalid Signature</h1>
                </div>
            )}
        </div>
    );
}
