export const publicRoutes: Record<string, string> = {
  home: "/",
  scan: "/scan",
  unauthorized: "/unauthorized",
  unitVerification: "/verify/batchUnit",

}

export const authRoutes: Record<string, string> = {
  login: "/auth/login",
  register: "/auth/register",
  teamMemberLogin: "/auth/team-member-login",
};

export const consumerRoutes: Record<string, string> = {
  profile: "/consumer/profile",
  scan: "/consumer/scan",
};

export const orgnaizationRoutes: Record<string, string> = {
  drug_distributor: "/dashboard/drug-distributor",
  hospital: "/dashboard/hospital",
  manufacturer: "/dashboard/manufacturer",
  pharmacy: "/dashboard/pharmacy",
  regulator: "/dashboard/regulator",
};
