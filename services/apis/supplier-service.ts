import { RootState } from "@/store";
import { AuthActions } from "@/store/auth-reducer";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { fetchData } from "../factory";
import { ApiResponse, PaginationResponse } from "@/types";
import {
  createSupplierParams,
  fetchAllSuppliersParams,
  fetchAllSuppliersResponse,
  fetchSuppliersByUserParams,
  SupplierType,
  updateSupplierParams,
} from "@/types/supplier";

export default class SupplierService {
  constructor(
    private store: ToolkitStore<RootState>,
    private authActions: AuthActions
  ) {}
  BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/suppliers";

  async fetchAllSuppliers(params: fetchAllSuppliersParams) {
    const response = await fetchData<ApiResponse<fetchAllSuppliersResponse>>({
      endpoint: this.BASE_URL,
      method: "GET",
      params,
    });
    return response;
  }

  async getSuppliersByOrganization(params: fetchSuppliersByUserParams) {
    const response = await fetchData<
      ApiResponse<PaginationResponse<SupplierType>>
    >({
      endpoint: `${this.BASE_URL}/get-suppliers-by-organization`,
      method: "GET",
      params,
    });
    return response;
  }

  async createSupplier(params: createSupplierParams) {
    const response = await fetchData<ApiResponse<SupplierType>>({
      endpoint: `${this.BASE_URL}/create-supplier`,
      method: "POST",
      params,
    });
    return response;
  }

  async updateSupplier(payload: updateSupplierParams) {
    const response = await fetchData<ApiResponse<SupplierType>>({
      endpoint: `${this.BASE_URL}/update-supplier`,
      method: "PATCH",
      payload,
    });
    return response;
  }

  async deleteSupplier(supplierId: string) {
    const response = await fetchData<ApiResponse<SupplierType>>({
      endpoint: `${this.BASE_URL}/delete-supplier`,
      method: "DELETE",
      payload: {
        supplierId,
      },
    });
    return response;
  }
}
