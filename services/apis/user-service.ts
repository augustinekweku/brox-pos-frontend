import { RootState } from "@/store";
import { AuthActions } from "@/store/auth-reducer";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { fetchData } from "../factory";
import { ApiResponse } from "@/types";
import {
  createOrganizationParams,
  fetchAllOrganizationsParams,
  fetchOrganizationsByUserParams,
  fetchOrganizationsByUserResponse,
  Organization,
} from "@/types/organization";
import {
  fetchAllSuppliersParams,
  fetchAllSuppliersResponse,
} from "@/types/supplier";

export default class UserService {
  constructor(
    private store: ToolkitStore<RootState>,
    private authActions: AuthActions
  ) {}
  BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/users";

  async fetchAllSuppliers(params: fetchAllSuppliersParams) {
    const response = await fetchData<ApiResponse<fetchAllSuppliersResponse>>({
      endpoint: this.BASE_URL,
      method: "GET",
    });
    return response;
  }
}
