"use client";
import { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useStocksTableColums } from "./Columns";
import useGetStocks from "@/hooks/useGetStocks";
import { DataTable } from "@/components/DataTable";
import TablePagination from "@/components/TablePagination";

const StocksTable = () => {
  const user = useSelector((state: RootState) => state.auth.userProfile);
  const orderColumns = useStocksTableColums();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "5");
  const route = useRouter();

  const [getStocks, isGettingStocks, stocksResponse, errorForGettingStocks] =
    useGetStocks({
      organizationId: user.activeOrganization,
      searchString: "",
      pageNumber: page,
      pageSize: pageSize,
      sortBy: "createdAt",
    });
  return (
    <div>
      <DataTable
        title="Stocks"
        isLoading={isGettingStocks}
        columns={orderColumns}
        data={stocksResponse?.results || []}
      />
      <div className="my-3">
        <TablePagination
          currentPage={page}
          pageSize={pageSize}
          totalCount={stocksResponse?.total}
          totalPages={stocksResponse?.totalPages}
          onPageChange={(pageProps) => {
            route.push(
              `/dashboard/inventory?page=${pageProps.page}&pageSize=${pageProps.rowsPerPage}`
            );
          }}
        />
      </div>
    </div>
  );
};

export default StocksTable;
