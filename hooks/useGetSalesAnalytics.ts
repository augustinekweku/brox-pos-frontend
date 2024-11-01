import DI from "@/di-container";
import { RootState } from "@/store";
import { PaginationResponse } from "@/types";
import {
  getSalesAnalyticsResponse,
  GetSalesMadeInAPeriodResponse,
  ISale,
  SaleFilterOptions,
  SaleStatus,
} from "@/types/sale";
import { useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface StateType {
  loadingAnalytics: boolean;
  analyticsResponse: getSalesAnalyticsResponse | null;
  error: any;
}

export default function useGetSalesAnalytics({
  status,
}: {
  status?: SaleStatus;
}): [() => void, boolean, getSalesAnalyticsResponse | null, any] {
  const [state, updateState] = useReducer(
    (state: StateType, newState: Partial<StateType>) => {
      const update = { ...state, ...newState };
      return update;
    },
    {
      loadingAnalytics: false,
      analyticsResponse: null,
      error: null,
    }
  );

  const activeOrganization = useSelector(
    (state: RootState) => state?.auth?.userProfile?.activeOrganization
  );

  async function getAnalytics() {
    if (!activeOrganization) {
      return;
    }
    updateState({ loadingAnalytics: true });

    try {
      const res = await DI.saleService.getDashboardAnalytics({
        organizationId: activeOrganization,
        status,
      });
      updateState({ loadingAnalytics: false, analyticsResponse: res.data });
      return res;
    } catch (error: any) {
      updateState({ loadingAnalytics: false });
      toast.error(error.message);
    } finally {
      updateState({ loadingAnalytics: false });
    }
  }

  useEffect(() => {
    getAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOrganization]);

  return [
    getAnalytics,
    state.loadingAnalytics,
    state.analyticsResponse,
    state.error,
  ];
}
