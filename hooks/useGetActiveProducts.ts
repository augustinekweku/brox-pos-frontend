import DI from "@/di-container";
import { RootState } from "@/store";
import { PaginationResponse } from "@/types";
import { ProductType } from "@/types/product";
import { useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface StateType {
  loadingProducts: boolean;
  productsResponse: PaginationResponse<ProductType>;
  error: any;
  searchString: string | undefined;
  pageNumber: number | undefined;
  pageSize: number | undefined;
}

export default function useGetActiveProducts({
  pageSize = 10,
  pageNumber = 1,
  searchString,
}: {
  pageSize?: number;
  pageNumber?: number;
  searchString?: string;
}): [() => void, boolean, PaginationResponse<ProductType>, any] {
  const userFromRedux = useSelector(
    (state: RootState) => state.auth.userProfile
  );

  const [state, updateState] = useReducer(
    (state: StateType, newState: Partial<StateType>) => {
      const update = { ...state, ...newState };
      return update;
    },
    {
      loadingProducts: false,
      productsResponse: {} as PaginationResponse<ProductType>,
      searchString: searchString,
      pageNumber: pageNumber,
      error: null,
      pageSize: pageSize,
    }
  );
  async function getActiveProducts() {
    updateState({ loadingProducts: true });
    try {
      const res = await DI.productService.getProductsInStockByOrganization({
        organizationId: userFromRedux?.activeOrganization,
        email: userFromRedux.email,
        searchString: searchString,
        pageNumber: pageNumber,
        pageSize: pageSize,
      });
      updateState({ loadingProducts: false, productsResponse: res.data });
      return res;
    } catch (error) {
      updateState({ loadingProducts: false });
      toast.error("Error fetching products");
    }
  }

  useEffect(() => {
    getActiveProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageNumber, searchString, userFromRedux?.activeOrganization]);

  return [
    getActiveProducts,
    state.loadingProducts,
    state.productsResponse,
    state.error,
  ];
}
