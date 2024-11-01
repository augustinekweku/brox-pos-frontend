"use client";
import { Button } from "@/components/ui/button";
import { GenericDialog } from "./GenericDialog";
import { PlusCircle } from "lucide-react";
import AddCompanyForm from "../forms/AddCompanyForm";
import { useToast } from "../ui/use-toast";
import { Organization } from "@/types/organization";

export function AddCompanyModal({
  editObj,
  open,
  openOpenChange,
  onSuccess,
}: {
  editObj: Organization | null;
  open: boolean;
  openOpenChange: () => void;
  onSuccess: () => void;
}) {
  return (
    <GenericDialog
      open={open}
      onOpenChange={() => {
        openOpenChange();
      }}
      description=""
      title={editObj?._id.toString() ? "Edit Company" : "Add Company"}
    >
      <AddCompanyForm
        editObj={editObj}
        onSuccess={() => {
          openOpenChange();
          onSuccess();
        }}
      />
    </GenericDialog>
  );
}
