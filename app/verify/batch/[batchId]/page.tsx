// app/verify/batch/[batchId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";

export default function VerifyBatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, isSignedIn } = useUser();

  const batchId = params.batchId as string;
  const sig = searchParams.get("sig");

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState<boolean | null>(null);
  const [batch, setBatch] = useState<any>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyBatch(latitude: number, longitude: number) {
      if (!batchId || !sig) {
        setError("Missing batch ID or signature");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/verify/batch/${batchId}?sig=${sig}&lat=${latitude}&long=${longitude}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Verification failed");
        } else {
          setValid(data.valid);
          setBatch(data.batch);
          setUnits(data.units || []);
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        verifyBatch(latitude, longitude);
      })
    }

  }, [batchId, sig]);

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-base sm:text-lg px-4 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-56 h-56 bg-blue-500/6 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-green-500/8 rounded-full blur-xl"></div>
        </div>
        <div className="absolute top-6 right-6 z-10">
          <ThemeToggle />
        </div>
        <div className="relative z-10">Verifying batch…</div>
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
    <div className="max-w-2xl mx-auto p-4 sm:p-6 text-center relative overflow-hidden min-h-screen">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-green-500/6 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-500/8 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-green-500/10 rounded-full blur-lg transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      {valid ? (
        <div className="rounded-xl bg-green-100 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700">
            ✅ Authentic Batch
          </h1>
          <p className="mt-2 text-sm sm:text-base">Batch ID: {batch.batchId}</p>
          <p className="text-sm sm:text-base">Status: {batch.status}</p>

          {units.length > 0 && (
            <div className="mt-4 sm:mt-6 text-left">
              <h2 className="text-lg sm:text-xl font-semibold">Units in this batch:</h2>
              <ul className="list-disc pl-4 sm:pl-6 text-sm sm:text-base">
                {units.map((u) => (
                  <li key={u.serialNumber} className="break-all">
                    {u.serialNumber} – {u.status}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl bg-red-100 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-red-700">
            ⚠️ Invalid Signature
          </h1>
          <p className="text-sm sm:text-base">This batch QR code does not match any authentic record.</p>
        </div>
      )}
    </div>
  );
}
