import React, { use, useEffect } from "react";
import useGet10MostSoldProducts from "@/hooks/useGet10MostSoldProducts";
import { DataTable } from "@/components/DataTable";
import { useBestSellingProductsTableColumns } from "./Columns";

const BestSellingProductsTable = () => {
  const tableColumns = useBestSellingProductsTableColumns();

  const [
    getMostSoldProducts,
    loadingMostSoldProducts,
    mostSoldProductsResponse,
    errorForGettingMostSoldProducts,
  ] = useGet10MostSoldProducts();

  useEffect(() => {
    getMostSoldProducts();
  }, []);
  return (
    <div>
      <DataTable
        title="Best Selling Products"
        isLoading={loadingMostSoldProducts}
        columns={tableColumns}
        data={mostSoldProductsResponse || []}
      />
    </div>
  );
};

export default BestSellingProductsTable;
