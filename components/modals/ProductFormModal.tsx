"use client";
import ProductForm from "../forms/ProductForm";
import { GenericDialog } from "./GenericDialog";
import { ProductType } from "@/types/product";

export function ProductFormModal({
  editObj,
  open,
  openOpenChange,
  onSuccess,
}: {
  editObj: ProductType | null;
  open: boolean;
  openOpenChange: () => void;
  onSuccess: () => void;
}) {
  return (
    <GenericDialog
      size="lg"
      open={open}
      onOpenChange={() => {
        openOpenChange();
      }}
      description=""
      title={editObj?._id?.toString() ? "Edit Product" : "Add Product"}
    >
      <ProductForm
        editObj={editObj}
        onSuccess={() => {
          openOpenChange();
          onSuccess();
        }}
      />
    </GenericDialog>
  );
}
