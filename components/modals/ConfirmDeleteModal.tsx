"use client";
import { Button } from "../ui/button";
import { GenericDialog } from "./GenericDialog";
import { Organization } from "@/types/organization";

export function ConfirmDeleteModal({
  open,
  openOpenChange,
  onConfirm,
  onCancel,
  title,
  description,
}: {
  open: boolean;
  openOpenChange: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
}) {
  return (
    <GenericDialog
      open={open}
      onOpenChange={() => {
        openOpenChange();
      }}
      description=""
      title={""}
      hideHeader
    >
      {/* create a card for confirming delete */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>

        <div className="mt-4 flex gap-4">
          <Button
            variant="destructive"
            onClick={() => {
              // deleteCompany(editObj._id);
              onConfirm();
            }}
          >
            Delete
          </Button>
          <Button
            variant="default"
            onClick={() => {
              openOpenChange();
              onCancel();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </GenericDialog>
  );
}
