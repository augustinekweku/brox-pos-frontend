"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductType } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";

// the  type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const useProductsTableColumns = ({
  onDelete,
}: {
  onDelete: (id: string) => void;
}) => {
  const router = useRouter();
  const ProductsTableColumns: ColumnDef<ProductType>[] = [
    {
      accessorKey: "name",
      header: "Product Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as "active" | "inactive";
        return <Badge variant={status}>{status}</Badge>;
      },
    },
    {
      accessorKey: "costPrice",
      header: "Cost Price",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("costPrice"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "GHS",
        }).format(amount);

        return <div className=" font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "sellingPrice",
      header: "Selling Price",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("sellingPrice"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "GHS",
        }).format(amount);

        return <div className=" font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "onHandQuantity",
      header: "Quantity",
    },
    {
      accessorKey: "createdAt",
      header: "Date Created",
      cell: ({ row }) => {
        const date = moment(row.getValue("createdAt")).format(
          "MMM DD, YYYY h:mm A"
        );

        return <div className=" font-medium">{date}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(product.categoryName)
                  }
                >
                  Copy Product Url
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    router.push(
                      `/dashboard/products/edit-product/${product._id}`
                    );
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    onDelete(product._id);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  return ProductsTableColumns;
};
