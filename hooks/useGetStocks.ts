import DI from "@/di-container";
import { PaginationResponse } from "@/types";
import { StockFilterOptions, StockType } from "@/types/stock";
import { useEffect, useReducer } from "react";
import toast from "react-hot-toast";

interface StateType {
  loadingStocks: boolean;
  stocksResponse: PaginationResponse<StockType> | null;
  error: any;
}

export default function useGetStocks({
  organizationId,
  searchString,
  pageNumber,
  pageSize,
}: StockFilterOptions): [
  () => void,
  boolean,
  PaginationResponse<StockType> | null,
  any
] {
  const [state, updateState] = useReducer(
    (state: StateType, newState: Partial<StateType>) => {
      const update = { ...state, ...newState };
      return update;
    },
    {
      loadingStocks: false,
      stocksResponse: null,
      error: null,
    }
  );
  async function getSale() {
    updateState({ loadingStocks: true });

    try {
      const res = await DI.stockService.getStockByOrganization({
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchString: searchString,
        organizationId: organizationId,
        sortBy: "createdAt",
      });
      updateState({ loadingStocks: false, stocksResponse: res.data });
      return res;
    } catch (error: any) {
      updateState({ loadingStocks: false });
      toast.error(error.message);
    } finally {
      updateState({ loadingStocks: false });
    }
  }

  useEffect(() => {
    getSale();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString, pageNumber, pageSize, organizationId]);

  return [getSale, state.loadingStocks, state.stocksResponse, state.error];
}
