"use client";
import { GenericDialog } from "./GenericDialog";
import { CategoryType } from "@/types/category";
import CategoryForm from "../forms/CategoryForm";

export function CategoryFormModal({
  editObj,
  open,
  openOpenChange,
  onSuccess,
}: {
  editObj: CategoryType | null;
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
      title={editObj?._id?.toString() ? "Edit Category" : "Add Category"}
    >
      <CategoryForm
        editObj={editObj}
        onSuccess={() => {
          openOpenChange();
          onSuccess();
        }}
      />
    </GenericDialog>
  );
}
