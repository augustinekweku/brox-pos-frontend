"use client";
import { ColumnDef } from "@tanstack/react-table";
import { StockType } from "@/types/stock";
import moment from "moment";

// the  type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const useStocksTableColums = () => {
  const stocksTableColums: ColumnDef<StockType>[] = [
    {
      header: "Item Name",
      accessorKey: "itemName",
    },
    {
      header: "Old Quantity",
      accessorKey: "oldQuantity",
    },
    {
      header: "Quantity Added",
      accessorKey: "quantityAdded",
    },
    {
      header: "New Quantity",
      accessorKey: "newQuantity",
    },
    {
      header: "Date Created",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const stock = row.original;
        return (
          <div className=" font-medium">
            {moment(stock.createdAt).format("DD/MM/YYYY hh:mm A")}
          </div>
        );
      },
    },
  ];

  return stocksTableColums;
};
