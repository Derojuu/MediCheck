// app/verify/batch/[batchId]/page.tsx
"use client";
// 
import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import { getRedirectPath } from "@/utils";
import { MyPublicMetadata } from "@/utils";
import Link from "next/link";

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

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-lg">
        Verifying batch…
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
    <div className="max-w-2xl mx-auto p-6 text-center">
      {valid ? (
        <div className="rounded-xl bg-green-100 p-6">
          <h1 className="text-3xl font-bold text-green-700">
            ✅ Authentic Batch
          </h1>
          <p className="mt-2">Batch ID: {batch.batchId}</p>
          <p>Status: {batch.status}</p>
          <p>Transfer completed!!</p>
        </div>
      )
      :
      (
        <div className="rounded-xl bg-red-100 p-6">
            <h1 className="text-3xl font-bold text-red-700">
              ⚠️ Invalid Signature
            </h1>
            <p>This batch QR code does not match any authentic record.</p>
            <p>Batch transfer has been cancelled, this batch id has been forged</p>
        </div>
        )}
      <Link
        className="mt-6 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        href={getRedirectPath(publicMetadata?.role, publicMetadata?.organizationType)}
      >
        Go To Dashboard
      </Link>
    </div>

  );
}
