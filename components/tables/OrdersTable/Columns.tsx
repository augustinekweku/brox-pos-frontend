"use client";

import { Button } from "@/components/ui/button";
import { ISale } from "@/types/sale";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import moment from "moment";
import { formatMoney } from "@/helpers";
import { Badge } from "@/components/ui/badge";

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

export const useOrdersTableColumns = () => {
  const router = useRouter();
  const OrdersTableColumns: ColumnDef<ISale>[] = [
    {
      header: "Order ID",
      accessorKey: "orderNumber",
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
      header: "Amount",
      accessorKey: "amount",
      cell: ({ row }) => {
        const order = row.original;
        return <div className=" font-medium">{formatMoney(order.amount)}</div>;
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
    {
      header: "Cash Tendered",
      accessorKey: "cashTendered",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <p>{order.cashTendered ? formatMoney(order.cashTendered) : ""}</p>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <Button
            onClick={() => {
              router.push(`/dashboard/pos/order-details/${order._id}`);
            }}
            variant={"link"}
          >
            View{" "}
          </Button>
        );
      },
    },
  ];

  return OrdersTableColumns;
};
