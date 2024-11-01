"use client";
import { GenericDialog } from "./GenericDialog";
import { SupplierType } from "@/types/supplier";
import SupplierForm from "../forms/SupplierForm";
import { useEffect } from "react";

export function SupplierFormModal({
  editObj,
  open,
  openOpenChange,
  onSuccess,
}: {
  editObj: SupplierType | null;
  open: boolean;
  openOpenChange: () => void;
  onSuccess: () => void;
}) {
  useEffect(() => {
    console.log("mounted");
  }, []);
  return (
    <GenericDialog
      open={open}
      onOpenChange={() => {
        openOpenChange();
      }}
      description=""
      title={editObj?._id?.toString() ? "Edit Supplier" : "Add Supplier"}
    >
      <div>
        Supplier Form
        {/* <SupplierForm
        editObj={editObj}
        onSuccess={() => {
          openOpenChange();
          onSuccess();
        }}
      /> */}
      </div>
    </GenericDialog>
  );
}
