import DI from "@/di-container";
import { RootState } from "@/store";
import { PaginationResponse } from "@/types";
import { CategoryType } from "@/types/category";
import { useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface StateType {
  loadingCategories: boolean;
  categoriesResponse: PaginationResponse<CategoryType>;
  error: any;
  searchString: string | undefined;
  pageNumber: number | undefined;
  pageSize: number | undefined;
}

export default function useGetCategories({
  pageSize = 10,
  pageNumber = 1,
  searchString,
}: {
  pageSize?: number;
  pageNumber?: number;
  searchString?: string;
}): [() => void, boolean, PaginationResponse<CategoryType>, any] {
  const userFromRedux = useSelector(
    (state: RootState) => state.auth.userProfile
  );

  const [state, updateState] = useReducer(
    (state: StateType, newState: Partial<StateType>) => {
      const update = { ...state, ...newState };
      return update;
    },
    {
      loadingCategories: false,
      categoriesResponse: {} as PaginationResponse<CategoryType>,
      searchString: searchString,
      pageNumber: pageNumber,
      error: null,
      pageSize: pageSize,
    }
  );
  async function getCategories() {
    updateState({ loadingCategories: true });
    try {
      const res = await  DI.categoryService.getCategoriesByOrganization({
        organizationId: userFromRedux?.activeOrganization,
        email: userFromRedux.email,
        searchString: state.searchString,
        pageNumber: state.pageNumber,
        pageSize: state.pageSize || 25,
      });
      updateState({ loadingCategories: false, categoriesResponse: res.data });
      return res;
    } catch (error) {
      updateState({ loadingCategories: false });
      toast.error("Error fetching state.categories");
    }
  }

  useEffect(() => {
    getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageNumber, searchString, userFromRedux?.activeOrganization]);

  return [
    getCategories,
    state.loadingCategories,
    state.categoriesResponse,
    state.error,
  ];
}
