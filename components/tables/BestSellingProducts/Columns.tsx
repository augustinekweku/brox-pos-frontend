"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import moment from "moment";
import { formatMoney } from "@/helpers";
import { Badge } from "@/components/ui/badge";
import { ProductType } from "@/types/product";

// the  type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type IStatus =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "paid"
  | "pending"
  | "unpaid"
  | "warning"
  | "info"
  | "danger"
  | "cancelled"
  | null
  | undefined;

export const useBestSellingProductsTableColumns = () => {
  const router = useRouter();
  const Best10SellingProductsTableColumns: ColumnDef<ProductType>[] = [
    {
      header: "Product Name",
      accessorKey: "name",
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div>{moment(order.createdAt).format("MMM Do YYYY, h:mm:ss a")}</div>
        );
      },
    },
    {
      header: "Sales",
      accessorKey: "quantitySold",
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className=" font-medium">{formatMoney(order.sellingPrice)}</div>
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className=" font-medium">
            {formatMoney(order.sellingPrice * order.quantitySold)}
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <Badge
            variant={order.status as unknown as IStatus}
            className="capitalize"
          >
            {order.status}
          </Badge>
        );
      },
    },
  ];

  return Best10SellingProductsTableColumns;
};
