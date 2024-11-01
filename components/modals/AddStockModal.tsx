"use client";
import { GenericDialog } from "./GenericDialog";
import StockForm from "../forms/StockForm";
import { ProductType } from "@/types/product";
import { StockType } from "@/types/stock";

export function AddStockModal({
  item,
  open,
  openOpenChange,
  onSuccess,
}: {
  item: ProductType;
  open: boolean;
  openOpenChange: () => void;
  onSuccess: (stock: StockType) => void;
}) {
  return (
    <GenericDialog
      open={open}
      onOpenChange={() => {
        openOpenChange();
      }}
      description=""
      title={"Add Stock"}
    >
      <StockForm
        item={item}
        onSuccess={(stock) => {
          openOpenChange();
          onSuccess(stock);
        }}
      />
    </GenericDialog>
  );
}
