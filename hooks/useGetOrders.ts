import DI from "@/di-container";
import { PaginationResponse } from "@/types";
import {
  GetSalesMadeInAPeriodResponse,
  ISale,
  SaleFilterOptions,
  SaleStatus,
} from "@/types/sale";
import { useEffect, useReducer } from "react";
import toast from "react-hot-toast";

interface StateType {
  loadingSale: boolean;
  saleResponse:
    | (PaginationResponse<ISale> & GetSalesMadeInAPeriodResponse)
    | null;
  error: any;
}

export default function useGetOrders({
  email,
  organizationId,
  searchString,
  pageNumber,
  pageSize,
  sortBy,
  sortOrder,
  status,
  startDate,
  endDate,
  period,
}: SaleFilterOptions): [
  () => void,
  boolean,
  (PaginationResponse<ISale> & GetSalesMadeInAPeriodResponse) | null,
  any
] {
  const [state, updateState] = useReducer(
    (state: StateType, newState: Partial<StateType>) => {
      const update = { ...state, ...newState };
      return update;
    },
    {
      loadingSale: false,
      saleResponse: null,
      error: null,
    }
  );
  async function getSale() {
    if (!email || !organizationId) {
      return;
    }
    updateState({ loadingSale: true });

    try {
      const res = await DI.saleService.getSalesByOrganization({
        status: status as SaleStatus,
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchString: searchString,
        organizationId: organizationId,
        email: email,
        sortBy: "createdAt",
        sortOrder: sortOrder,
        startDate,
        endDate,
        period,
      });
      updateState({ loadingSale: false, saleResponse: res.data });
      return res;
    } catch (error: any) {
      updateState({ loadingSale: false });
      toast.error(error.message);
    } finally {
      updateState({ loadingSale: false });
    }
  }

  useEffect(() => {
    getSale();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString, pageNumber, pageSize, email, organizationId, status]);

  return [getSale, state.loadingSale, state.saleResponse, state.error];
}
