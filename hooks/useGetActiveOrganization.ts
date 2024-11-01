// hooks/useUrlParams.ts
import { getActiveOrganizationObject } from "@/helpers";
import { RootState } from "@/store";
import { Organization } from "@/types/organization";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useGetActiveOrganization = () => {
  const [activeOrganization, setActiveOrganization] =
    useState<Organization | null>(null);
  const userFromRedux = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Fetch active organization
    let organization = getActiveOrganizationObject();
    setActiveOrganization(organization);
  }, [userFromRedux.userProfile.activeOrganization]);

  return { activeOrganization };
};

export default useGetActiveOrganization;
