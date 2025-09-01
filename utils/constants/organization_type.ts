import { OrganizationType } from "@/lib/generated/prisma";

export const ORG_TYPE_MAP: Record<string, OrganizationType> = {
  manufacturer: OrganizationType.MANUFACTURER,
  drug_distributor: OrganizationType.DRUG_DISTRIBUTOR,
  hospital: OrganizationType.HOSPITAL,
  pharmacy: OrganizationType.PHARMACY,
  regulator: OrganizationType.REGULATOR,
};
