import useGetOrders from "@/hooks/useGetOrders";
import { RootState } from "@/store";
import { SaleStatus } from "@/types/sale";
import React from "react";
import { useSelector } from "react-redux";
import { useOrdersTableColumns } from "./Columns";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/DataTable";
import TablePagination from "@/components/TablePagination";

const OrdersTable = () => {
  const user = useSelector((state: RootState) => state.auth.userProfile);
  const orderColumns = useOrdersTableColumns();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "5");
  const route = useRouter();

  const [getOrders, isGettingOrders, ordersResponse, errorForGettingOrders] =
    useGetOrders({
      email: user.email,
      organizationId: user.activeOrganization,
      searchString: "",
      pageNumber: page,
      pageSize: pageSize,
      sortBy: "createdAt",
      sortOrder: "desc",
      status: SaleStatus.ALL,
    });
  return (
    <div>
      <DataTable
        title="Orders"
        isLoading={isGettingOrders}
        columns={orderColumns}
        data={ordersResponse?.results || []}
        paginationProps={{
          currentPage: page,
          pageSize: pageSize,
          totalCount: ordersResponse?.total ?? 0,
          totalPages: ordersResponse?.totalPages ?? 0,
          onPageChange: (pageProps) => {
            route.push(
              `/dashboard?page=${pageProps.page}&pageSize=${pageProps.rowsPerPage}`
            );
          },
        }}
      />
    </div>
  );
};

export default OrdersTable;
