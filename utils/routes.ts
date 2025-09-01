export const publicRoutes: Record<string, string> = {
  home: "/",
  scan: "/scan",
  unauthorized: "/unauthorized",
};

export const authRoutes: Record<string, string> = {
  login: "/auth/login",
  register: "/auth/register",
};

export const consumerRoutes: Record<string, string> = {
  profile: "/consumer/profile",
  scan: "/consumer/scan",
};

export const orgnaizationRoutes: Record<string, string> = {
  drug_distributor: "/dashboard/drug-distributor",
  hospital: "/dashboard/hospital",
  organization: "/dashboard/organization",
  pharmacy: "/dashboard/pharmacy",
  regulator: "/dashboard/regulator",
};
