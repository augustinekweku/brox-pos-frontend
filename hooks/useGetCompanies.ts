import { PaginationResponse } from "@/types";
import { useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import useGetUserSession from "./useGetUserSession";
import {
  fetchOrganizationsByUserParams,
  Organization,
} from "@/types/organization";
import DI from "@/di-container";

interface StateType {
  loadingCompanies: boolean;
  companiesResponse: PaginationResponse<Organization> | null;
  error: any;
}

export default function useGetCompanies({
  searchString,
  pageNumber,
  pageSize,
  sortBy,
}: Omit<fetchOrganizationsByUserParams, "email">): [
  () => void,
  boolean,
  PaginationResponse<Organization> | null,
  any
] {
  const [state, updateState] = useReducer(
    (state: StateType, newState: Partial<StateType>) => {
      const update = { ...state, ...newState };
      return update;
    },
    {
      //set loading to true on first render
      loadingCompanies: true,
      companiesResponse: null,
      error: null,
    }
  );
  const user = useGetUserSession();
  async function getSale() {
    updateState({ loadingCompanies: true });
    try {
      const res = await DI.organizationService.getOrganizationByUser({
        email: user.email,
        searchString: searchString,
        pageNumber: pageNumber,
        pageSize: pageSize || 25,
        sortBy: sortBy,
      });
      updateState({
        loadingCompanies: false,
        companiesResponse: res.data,
      });
      return res;
    } catch (error) {
      updateState({ loadingCompanies: false });
      toast.error("Error fetching companies");
    }
  }

  useEffect(() => {
    getSale();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString, pageNumber, pageSize, user.email]);

  return [
    getSale,
    state.loadingCompanies,
    state.companiesResponse,
    state.error,
  ];
}
