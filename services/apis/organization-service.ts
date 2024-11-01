import { RootState } from "@/store";
import { AuthActions } from "@/store/auth-reducer";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { fetchData } from "../factory";
import { ApiResponse, PaginationResponse } from "@/types";
import {
  createOrganizationParams,
  fetchAllOrganizationsParams,
  fetchOrganizationsByUserParams,
  fetchOrganizationsByUserResponse,
  Organization,
} from "@/types/organization";

export default class OrganizationService {
  constructor(
    private store: ToolkitStore<RootState>,
    private authActions: AuthActions
  ) {}
  BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/organizations";

  async getAllOrganizations(params: fetchAllOrganizationsParams): Promise<any> {
    try {
      const responseData = await fetchData<ApiResponse<any>>({
        endpoint: `${this.BASE_URL}/get-all`,
        method: "GET",
        params,
      });
      return responseData.data;
    } catch (error) {
      throw error;
    }
  }

  async getOrganizationByUser(
    params: fetchOrganizationsByUserParams
  ): Promise<ApiResponse<PaginationResponse<Organization>>> {
    try {
      const responseData = await fetchData<
        ApiResponse<PaginationResponse<Organization>>
      >({
        endpoint: `${this.BASE_URL}/by-user`,
        method: "GET",
        params,
      });
      this.store.dispatch(
        this.authActions.setCompanies(responseData.data.results)
      );
      return responseData;
    } catch (error) {
      throw error;
    }
  }

  async setOrganizationAsActive(userId: string, organizationId: string) {
    try {
      const responseData = await fetchData<ApiResponse<any>>({
        endpoint: `${this.BASE_URL}/activate`,
        method: "PATCH",
        payload: { userId, organizationId },
      });
      return responseData.data;
    } catch (error) {
      throw error;
    }
  }

  async createOrganization(
    payload: createOrganizationParams
  ): Promise<ApiResponse<Organization>> {
    try {
      const responseData = await fetchData<ApiResponse<Organization>>({
        endpoint: `${this.BASE_URL}/`,
        method: "POST",
        payload: payload,
      });
      return responseData;
    } catch (error) {
      throw error;
    }
  }

  async updateOrganization(
    payload: createOrganizationParams
  ): Promise<ApiResponse<Organization>> {
    try {
      const responseData = await fetchData<ApiResponse<any>>({
        endpoint: `${this.BASE_URL}/`,
        method: "PATCH",
        payload: payload,
      });
      return responseData.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteOrganization(
    organizationId: string
  ): Promise<ApiResponse<Organization>> {
    try {
      const responseData = await fetchData<ApiResponse<any>>({
        endpoint: `${this.BASE_URL}/${organizationId}`,
        method: "DELETE",
      });
      return responseData.data;
    } catch (error) {
      throw error;
    }
  }
}
