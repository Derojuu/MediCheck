import { orgnaizationRoutes, consumerRoutes, publicRoutes } from "@/utils";

export function getRedirectPath(role?: string, orgType?: string) {

    console.log(role, orgType);

    if (role === "CONSUMER" && !orgType) {
        return consumerRoutes.profile;
    }

    else if (role === "ORGANIZATION_MEMBER" && orgType){
        const lowerOrgType = orgType?.toLowerCase();
        return orgnaizationRoutes[lowerOrgType];
    }

    return publicRoutes.unauthorized; 
}