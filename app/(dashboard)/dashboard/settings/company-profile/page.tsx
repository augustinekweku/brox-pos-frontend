import { Separator } from "@/components/ui/separator";
import { CompanyProfileForm } from "./company-profile-form";

export default async function SettingsAccountPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  return (
    <div className="flex-1 lg:max-w-2xl">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Company Profile</h3>
          <p className="text-sm text-muted-foreground">
            Update your company profile information.
          </p>
        </div>
        <Separator />
        <CompanyProfileForm />
      </div>
    </div>
  );
}
