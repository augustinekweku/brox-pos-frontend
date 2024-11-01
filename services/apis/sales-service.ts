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
import {
  getSalesAnalyticsResponse,
  GetSalesMadeInAPeriodResponse,
  ISale,
  ISaleItem,
  SaleFilterOptions,
  SaleStatus,
} from "@/types/sale";
type GetSaleAnalyticsPayload = Omit<
  SaleFilterOptions,
  "email" | "period" | "startDate" | "endDate"
>;

export type PayForSalePayload = {
  saleId: string;
  saleData: Partial<ISale>;
};

export default class SalesService {
  constructor(
    private store: ToolkitStore<RootState>,
    private authActions: AuthActions
  ) {}
  BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL! + "/sales";

  async createSaleWithSaleItems(
    saleData: Omit<ISale, "saleItems">,
    saleItemsData: Omit<ISaleItem, "parentSaleId">[]
  ) {
    const response = await fetchData<ApiResponse<ISale>>({
      endpoint: `${this.BASE_URL}/create-sale`,
      method: "POST",
      payload: {
        saleData,
        saleItemsData,
      },
    });
    return response;
  }

  async getSale(saleId: string) {
    const response = await fetchData<ApiResponse<ISale>>({
      endpoint: `${this.BASE_URL}/get-sale-by-id`,
      method: "GET",
      params: {
        saleId,
      },
    });
    return response;
  }

  async getDashboardAnalytics(params: GetSaleAnalyticsPayload) {
    const response = await fetchData<ApiResponse<getSalesAnalyticsResponse>>({
      endpoint: `${this.BASE_URL}/get-analytics`,
      method: "GET",
      params,
    });
    return response;
  }

  async get10MostSoldProductsByOrg(organizationId: string) {
    const response = await fetchData<ApiResponse<{ products: ISaleItem[] }>>({
      endpoint: `${this.BASE_URL}/get-most-sold-products`,
      method: "GET",
      params: {
        organizationId,
      },
    });
    return response;
  }

  async getSalesByOrganization(params: SaleFilterOptions) {
    const response = await fetchData<
      ApiResponse<PaginationResponse<ISale> & GetSalesMadeInAPeriodResponse>
    >({
      endpoint: `${this.BASE_URL}/get-organizational-sale`,
      method: "GET",
      params,
    });
    return response;
  }
  async deleteSale(saleId: string) {
    const response = await fetchData<ApiResponse<ISale>>({
      endpoint: `${this.BASE_URL}/delete-sale`,
      method: "DELETE",
      payload: {
        saleId,
      },
    });
    return response;
  }

  async deleteAllSales(organizationId: string) {
    const response = await fetchData<ApiResponse<ISale>>({
      endpoint: `${this.BASE_URL}/delete-all-sales`,
      method: "DELETE",
      payload: {
        organizationId,
      },
    });
    return response;
  }

  async getLeastSoldProductsByOrg(organizationId: string) {
    const response = await fetchData<ApiResponse<ISaleItem[]>>({
      endpoint: `${this.BASE_URL}/get-least-sold-products`,
      method: "GET",
      params: {
        organizationId,
      },
    });
    return response;
  }

  async payForSale(payload: PayForSalePayload) {
    const response = await fetchData<ApiResponse<ISale>>({
      endpoint: `${this.BASE_URL}/pay-for-sale`,
      method: "POST",
      payload,
    });
    return response;
  }
}
