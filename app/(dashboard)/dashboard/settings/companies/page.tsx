import { CompaniesTable } from "../components/companies-tables";

export default async function SettingsAccountPage() {
  return (
    <div className="flex-1 ">
      <div className="space-y-6">
        <CompaniesTable />
      </div>
    </div>
  );
}
