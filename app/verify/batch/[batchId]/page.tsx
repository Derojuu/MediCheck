// app/verify/batch/[batchId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";

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
    async function verifyBatch() {
      if (!batchId || !sig) {
        setError("Missing batch ID or signature");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/verify/batch/${batchId}?sig=${sig}`);
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

    verifyBatch();
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

          {units.length > 0 && (
            <div className="mt-6 text-left">
              <h2 className="text-xl font-semibold">Units in this batch:</h2>
              <ul className="list-disc pl-6">
                {units.map((u) => (
                  <li key={u.serialNumber}>
                    {u.serialNumber} – {u.status}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl bg-red-100 p-6">
          <h1 className="text-3xl font-bold text-red-700">
            ⚠️ Invalid Signature
          </h1>
          <p>This batch QR code does not match any authentic record.</p>
        </div>
      )}
    </div>
  );
}
