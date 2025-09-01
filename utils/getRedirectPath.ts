import { orgnaizationRoutes, consumerRoutes, publicRoutes } from "@/utils";

export function getRedirectPath(role?: string, orgType?: string) {
    if (role === "CONSUMER") {
        return consumerRoutes.profile;
    }

    if (role === "ORGANIZATION_MEMBER") {
        const lowerOrgType = orgType?.toLowerCase();
        return orgnaizationRoutes[lowerOrgType || "organization"] || publicRoutes.unauthorized;
    }

    return publicRoutes.unauthorized; 
}