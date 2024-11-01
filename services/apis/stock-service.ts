import { RootState } from "@/store";
import { AuthActions } from "@/store/auth-reducer";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { fetchData } from "../factory";
import { ApiResponse, PaginationResponse } from "@/types";
import { StockFilterOptions, StockType } from "@/types/stock";

export default class StockService {
  constructor(
    private store: ToolkitStore<RootState>,
    private authActions: AuthActions
  ) {}
  BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/stocks";

  async getStockByOrganization(params: StockFilterOptions) {
    const response = await fetchData<
      ApiResponse<PaginationResponse<StockType>>
    >({
      endpoint: `${this.BASE_URL}/get-organizational-stock`,
      method: "GET",
      params,
    });
    return response;
  }

  async addStock(payload: StockType) {
    const response = await fetchData<ApiResponse<StockType>>({
      endpoint: `${this.BASE_URL}/add-stock`,
      method: "POST",
      payload,
    });
    return response;
  }
}
