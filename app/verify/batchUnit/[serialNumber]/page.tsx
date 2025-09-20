// app/verify/batchUnit/[serialNumber]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";

export default function VerifyUnitPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const serialNumber = params.serialNumber as string;
    const sig = searchParams.get("sig");

    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState<boolean | null>(null);
    const [unit, setUnit] = useState<any>(null);
    const [batch, setBatch] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

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
            <div className="flex h-screen items-center justify-center text-base sm:text-lg px-4">
                Verifying unit…
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 sm:p-6 text-center">
                <h1 className="text-xl sm:text-2xl font-bold text-red-600">Verification Error</h1>
                <p className="text-sm sm:text-base">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-4 sm:p-6 text-center">
            {valid ? (
                <div className="rounded-xl bg-green-100 p-4 sm:p-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-green-700">✅ Authentic Unit</h1>
                    <p className="mt-2 text-sm sm:text-base break-all">Serial Number: {unit.serialNumber}</p>
                    <p className="text-sm sm:text-base break-all">Batch: {batch.batchId}</p>
                    <p className="text-sm sm:text-base">Status: {unit.status}</p>
                </div>
            ) : (
                <div className="rounded-xl bg-red-100 p-4 sm:p-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-red-700">⚠️ Invalid Signature</h1>
                    <p className="text-sm sm:text-base">This QR code does not match any authentic record.</p>
                </div>
            )}
        </div>
    );
}
