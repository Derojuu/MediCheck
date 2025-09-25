import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {auth} from "@clerk/nextjs/server";

export async function GET() {
  try {
    const entities = await prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ entities });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch entities" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Basic validation
    if (
      !data.companyName ||
      !data.organizationType ||
      !data.contactEmail ||
      !data.address ||
      !data.country
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const entity = await prisma.organization.create({
      data: {
        companyName: data.companyName,
        organizationType: data.organizationType,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        contactPersonName: data.contactPersonName,
        address: data.address,
        country: data.country,
        state: data.state,
        licenseNumber: data.licenseNumber,
        nafdacNumber: data.nafdacNumber,
        businessRegNumber: data.businessRegNumber,
        rcNumber: data.rcNumber,
        pcnNumber: data.pcnNumber,
        agencyName: data.agencyName,
        officialId: data.officialId,
        distributorType: data.distributorType,
        // Add other fields as needed

        users: data.users, // Ensure this is provided and matches the expected type
      },
    });

    return NextResponse.json({ entity }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create entity" }, { status: 500 });
  }
}