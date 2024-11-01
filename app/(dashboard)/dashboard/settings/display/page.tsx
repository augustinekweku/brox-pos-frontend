import { Separator } from "@/components/ui/separator";
import { DisplayForm } from "./display-form";

export default function SettingsDisplayPage() {
  return (
    <div className="flex-1 lg:max-w-2xl">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Display</h3>
          <p className="text-sm text-muted-foreground">
            Turn items on or off to control what&apos;s displayed in the app.
          </p>
        </div>
        <Separator />
        <DisplayForm />
      </div>
    </div>
  );
}
