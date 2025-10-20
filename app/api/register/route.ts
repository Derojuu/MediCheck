import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";
import { ORG_TYPE_MAP } from "@/utils";
import { clerkClient } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { createAndRegisterAgent } from "@/lib/hcs10.ts";
import {
  AIAgentCapability,
} from "@hashgraphonline/standards-sdk";


export async function POST(req: Request) {
    console.log("Starting user registration...");
    
    try {
      const data = await req.json();

      console.log("Received data:", data);

      const {
        clerkUserId,
        accountType,
        // formData Values
        organizationType,
        companyName,
        rcNumber,
        nafdacNumber,
        contactEmail,
        contactPhone,
        contactPersonName,
        address,
        country,
        state,
        fullName,
        dateOfBirth,
        businessRegNumber,
        licenseNumber,
        pcnNumber,
        agencyName,
        officialId,
        distributorType
      } = data;

      const clerk = await clerkClient();

      const role = accountType === "organization" ? UserRole.ORGANIZATION_MEMBER : UserRole.CONSUMER

      const orgType =  accountType === "organization" ? organizationType : null

      console.log("Register api", role, orgType)
      
      await clerk.users.updateUser(clerkUserId, {
        publicMetadata: {
          role: role,
          organizationType: orgType,
        },
      });

      // Set fallback cookie (1 hour expiry)
      (await cookies()).set(
        "user_fallback",
        JSON.stringify({ role, organizationType: orgType }),
        {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60, // 1 hour
          path: "/",
        }
      );

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

      console.log("saved in user table");

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
            contactPersonName,
            address,
            country,
            state,
            rcNumber,
            nafdacNumber,
            businessRegNumber,
            licenseNumber,
            pcnNumber,
            agencyName,
            officialId,
            distributorType,
          },
        });

        console.log("Organization created:", organization.id);

        // ✅ create Hedera counterpart agent
        const agentResult = await createAndRegisterAgent({
          name: `${companyName}-Agen`,
          description: `${companyName} Hedera Agent`,
          orgId: organization.id,
          role: organizationType, // manufacturer | distributor | pharmacy | etc
          model: "gpt-4",
          capabilities: [AIAgentCapability.TEXT_GENERATION],
          metadata: {
            contactEmail,
            contactPhone,
            country,
          },
        });

          if (!agentResult.success) {
            console.error("Failed to create HCS-10 agent:", agentResult.error);
            // optional rollback or alert handling here
          } else {
            console.log("HCS-10 agent registered:", agentResult?.data?.accountId);
          }


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

      console.log("commencing saving cosumer");

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
