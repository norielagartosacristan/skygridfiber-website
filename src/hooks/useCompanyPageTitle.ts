import { useEffect } from "react";

type CompanyBranding = {
  companyName?: string | null;
  tradeName?: string | null;
};

export function useCompanyPageTitle(
  branding: CompanyBranding | null
) {
  useEffect(() => {
    const name =
      branding?.tradeName?.trim() ||
      branding?.companyName?.trim() ||
      "Company Portal";

    document.title = name;
  }, [branding?.tradeName, branding?.companyName]);
}
