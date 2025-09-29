import { NextResponse } from "next/server";
import { createBatchRegistry } from "@/lib/hedera";

export async function GET() {
  try {
    const registry = await createBatchRegistry("TEST-" + Date.now());
    return NextResponse.json({ ok: registry });
  } catch (err) {
    console.error(err);
    const errorMessage = typeof err === "object" && err !== null && "message" in err ? (err as { message: string }).message : String(err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
