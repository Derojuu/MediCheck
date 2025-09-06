import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";
import { ORG_TYPE_MAP } from "@/utils";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    console.log("Starting user registration...");
    
    try {

        const data = await req.json();

        console.log("Received data:", data);

        const {
            clerkUserId,
            accountType,
            organizationType,
            companyName,
            contactEmail,
            contactPhone,
            address,
            country,
            state,
            contactPersonName,
            fullName,
            dateOfBirth,
        } = data;

        const clerk = await clerkClient();
        
        await clerk.users.updateUser(clerkUserId, {
            publicMetadata: {
                role:
                accountType === "organization"
                    ? UserRole.ORGANIZATION_MEMBER
                    : UserRole.CONSUMER,
                organizationType:
                accountType === "organization" ? organizationType : null,
            },
        });

        console.log("saved metadata in clerk");

        if (!["organization", "consumer"].includes(accountType)) {
        return NextResponse.json(
            { error: "Invalid account type" },
            { status: 400 }
        );
        }

        // Create user
        const user = await prisma.user.create({
            data: {
                clerkUserId,
                isActive: true,
                userRole:
                accountType === "organization"
                    ? UserRole.ORGANIZATION_MEMBER
                    : UserRole.CONSUMER,
            },
        });

        console.log("saved in user table")


        console.log("User created:", user.id);

        console.log("commencing saving organization");

        // Handle Organization
        if (accountType === "organization") {

            console.log("Registering organization of type:", organizationType);
            console.log(ORG_TYPE_MAP);

            if (!ORG_TYPE_MAP[organizationType]) {
                return NextResponse.json(
                { error: "Invalid organization type" },
                { status: 400 }
                );
            }

            const organization = await prisma.organization.create({
                data: {
                    adminId: user.id,
                    organizationType: ORG_TYPE_MAP[organizationType],
                    companyName,
                    contactEmail,
                    contactPhone,
                    address,
                    country,
                    state,
                },
            });

            console.log("Organization created:", organization.id);

            // Add the admin as a team member
            const teamMember = await prisma.teamMember.create({
                data: {
                    userId: user.id,
                    organizationId: organization.id,
                    isAdmin: true,
                    name: contactPersonName || companyName,
                    email: contactEmail,
                    role: "Admin", // NEED TO ADD A FIELD FOR THIS IN THE FORM
                    department: "Admin", // NEED TO ADD A FIELD FOR THIS IN THE FORM
                },
            });

            console.log("Team member created:", teamMember.id);
        }

        console.log("commencing saving cosumer")

        // Handle Consumer
        if (accountType === "consumer") {
            const consumer = await prisma.consumer.create({
                data: {
                    userId: user.id,
                    fullName,
                    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                    phoneNumber: contactPhone,
                    address,
                    country,
                    state,
                },
            });

            console.log("Consumer created:", consumer.id);
        }


        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Failed to register user" },{ status: 500 }
);
    }
}
