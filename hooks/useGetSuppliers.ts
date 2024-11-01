import DI from "@/di-container";
import { RootState } from "@/store";
import { PaginationResponse } from "@/types";
import { SupplierType } from "@/types/supplier";
import { useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface StateType {
  loadingSuppliers: boolean;
  suppliersResponse: PaginationResponse<SupplierType>;
  error: any;
  searchString: string | undefined;
  pageNumber: number | undefined;
  pageSize: number | undefined;
}

export default function useGetSuppliers({
  pageSize = 10,
  pageNumber = 1,
  searchString,
}: {
  pageSize?: number;
  pageNumber?: number;
  searchString?: string;
}): [() => void, boolean, PaginationResponse<SupplierType>, any] {
  const userFromRedux = useSelector(
    (state: RootState) => state.auth.userProfile
  );

  const [state, updateState] = useReducer(
    (state: StateType, newState: Partial<StateType>) => {
      const update = { ...state, ...newState };
      return update;
    },
    {
      loadingSuppliers: false,
      suppliersResponse: {} as PaginationResponse<SupplierType>,
      searchString: searchString,
      pageNumber: pageNumber,
      error: null,
      pageSize: pageSize,
    }
  );
  async function getSuppliers() {
    updateState({ loadingSuppliers: true });
    try {
      const res = await DI.supplierService.getSuppliersByOrganization({
        organizationId: userFromRedux?.activeOrganization,
        email: userFromRedux.email,
        searchString: state.searchString,
        pageNumber: state.pageNumber,
        pageSize: state.pageSize || 25,
      });
      updateState({ loadingSuppliers: false, suppliersResponse: res.data });
      return res;
    } catch (error) {
      updateState({ loadingSuppliers: false });
      toast.error("Error fetching suppliers");
    }
  }

  useEffect(() => {
    getSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageNumber, searchString, userFromRedux?.activeOrganization]);

  return [
    getSuppliers,
    state.loadingSuppliers,
    state.suppliersResponse,
    state.error,
  ];
}
