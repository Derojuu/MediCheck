import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

// POST - Create new product
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      description,
      category,
      dosageForm,
      strength,
      activeIngredients,
      nafdacNumber,
      shelfLifeMonths,
      storageConditions,
      organizationId
    } = body;

    // Basic validation
    if (!name || !description || !category || !organizationId) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, category, organizationId" },
        { status: 400 }
      );
    }

    // Verify organization exists and user has access
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: { users: true }
    });

    if (!organization || organization.users.clerkUserId !== userId) {
      return NextResponse.json(
        { error: "Organization not found or access denied" },
        { status: 403 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        dosageForm,
        strength,
        activeIngredients: Array.isArray(activeIngredients) ? activeIngredients : [activeIngredients],
        nafdacNumber,
        shelfLifeMonths: shelfLifeMonths ? parseInt(shelfLifeMonths) : null,
        storageConditions,
        organizationId
      }
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      product
    }, { status: 201 });

  } catch (error) {
    console.error("Product Creation Error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// GET - Get all products for an organization
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json(
        { error: "organizationId parameter is required" },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      products
    }, { status: 200 });

  } catch (error) {
    console.error("Get Products Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve products" },
      { status: 500 }
    );
  }
}
