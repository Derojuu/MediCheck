// app/verify/batch/[batchId]/page.tsx
"use client";
// 
import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { getRedirectPath } from "@/utils";
import { MyPublicMetadata } from "@/utils";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function VerifyBatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, isSignedIn } = useUser();

  const batchId = params.batchId as string;
  const sig = searchParams.get("sig");

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState<boolean | null>(null);
  const [batch, setBatch] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const publicMetadata = user?.publicMetadata as MyPublicMetadata; 

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
        }
        else {
          setValid(data.valid);
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
        verifyBatch(latitude, longitude);
      })
    }

  }, [batchId, sig]);


  const MobileHeader = () => (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-lg text-blue-700">MediCheck</span>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );

  // Helper to check flagged status robustly
  const isFlagged = (batch: any) => batch?.status?.toLowerCase() === "flagged";

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-base sm:text-lg px-4 relative overflow-hidden bg-background">
        <MobileHeader />
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-56 h-56 bg-blue-500/6 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-green-500/8 rounded-full blur-xl"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center mt-20 sm:mt-0 space-y-4 w-full max-w-xs sm:max-w-sm bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-lg border border-blue-200 dark:border-blue-700 p-6">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <span className="font-semibold text-base sm:text-lg text-blue-700">Verifying batch…</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden bg-background">
        <MobileHeader />
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-56 h-56 bg-red-500/6 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-orange-500/8 rounded-full blur-xl"></div>
        </div>
        <div className="w-full max-w-md mx-auto bg-white/90 rounded-xl shadow-lg p-6 mt-24 sm:mt-32 relative z-10">
          <h1 className="text-xl sm:text-2xl font-bold text-red-600 mb-2">Verification Error</h1>
          <p className="text-sm sm:text-base">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <MobileHeader />
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-green-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-green-500/10 rounded-full blur-lg transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div className="flex flex-1 items-center justify-center w-full px-2 sm:px-4">
        <div className="w-full max-w-lg mx-auto bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-lg p-4 sm:p-8 my-8 sm:my-16 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <div>
              <h1 className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">
                Batch Verification
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Batch ID: <span className="font-mono">{batchId}</span>
              </p>
            </div>
          </div>
          {/* Status Card */}
          {valid ? (
            isFlagged(batch) ? (
              // FLAGGED: RED CARD
              <div className="rounded-xl p-4 sm:p-6 text-center transition-all duration-300 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-red-700 dark:text-red-400">
                  🚩 Flagged Batch
                </h2>
                <p className="mt-2 text-base sm:text-lg font-medium">
                  Batch ID: <span className="font-mono">{batch?.batchId}</span>
                </p>
                <p className="text-sm sm:text-base">
                  Status:{" "}
                  <span className="font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                    Flagged
                  </span>
                </p>
                <p className="text-sm sm:text-base text-red-600 dark:text-red-400 font-semibold mt-2">
                  This batch has been <span className="underline">flagged for review</span>.<br />
                  Please contact support or your administrator.
                </p>
              </div>
            ) : (
              // AUTHENTIC: GREEN CARD
              <div className="rounded-xl p-4 sm:p-6 text-center transition-all duration-300 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-green-700 dark:text-green-400">
                  ✅ Authentic Batch
                </h2>
                <p className="mt-2 text-base sm:text-lg font-medium">
                  Batch ID: <span className="font-mono">{batch?.batchId}</span>
                </p>
                <p className="text-sm sm:text-base">
                  Status:{" "}
                  <span className="font-semibold uppercase tracking-wide text-green-700 dark:text-green-400">
                    {batch?.status}
                  </span>
                </p>
                <p className="text-sm sm:text-base text-green-700 dark:text-green-400 mt-2">
                  Transfer completed!
                </p>
              </div>
            )
          ) : (
            // INVALID: RED CARD
            <div className="rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 p-4 sm:p-6 text-center transition-all duration-300">
              <h2 className="text-2xl sm:text-3xl font-bold text-red-700 dark:text-red-400 mb-2">
                ⚠️ Invalid Signature
              </h2>
              <p className="text-sm sm:text-base text-red-700 dark:text-red-300">
                This batch QR code does not match any authentic record.
              </p>
              <p className="text-sm sm:text-base text-red-700 dark:text-red-300">
                Batch transfer has been cancelled, this batch id has been forged.
              </p>
            </div>
          )}
          <Link
            className="mt-6 inline-block rounded bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm sm:text-base font-semibold shadow transition-colors"
            href={getRedirectPath(publicMetadata?.role, publicMetadata?.organizationType)}
          >
            Go To Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
