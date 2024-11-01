"use client";
import { ActiveOrganization } from "@/components/ActiveOrganization";
import EmptyState from "@/components/EmptyState";
import AddCompanyForm from "@/components/forms/AddCompanyForm";
import useGetActiveOrganization from "@/hooks/useGetActiveOrganization";

export function CompanyProfileForm() {
  const { activeOrganization } = useGetActiveOrganization();
  return (
    <>
      {activeOrganization ? (
        <AddCompanyForm editObj={activeOrganization} onSuccess={() => {}} />
      ) : (
        <div className="mx-auto">
          <EmptyState
            title="No company found"
            description="You have not selected any company yet."
            customChidren={<ActiveOrganization />}
          />
        </div>
      )}
    </>
  );
}
