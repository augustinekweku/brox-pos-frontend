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
  createProductParams,
  fetchProductsByOrganizationParams,
  ProductType,
  updateProductParams,
} from "@/types/product";

export default class ProductService {
  constructor(
    private store: ToolkitStore<RootState>,
    private authActions: AuthActions
  ) {}
  BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/products";

  async getProductsInStockByOrganization({
    organizationId,
    email,
    searchString,
    pageNumber,
    pageSize,
  }: {
    organizationId: string;
    email: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
  }) {
    const response = await fetchData<
      ApiResponse<PaginationResponse<ProductType>>
    >({
      endpoint: `${this.BASE_URL}/get-products-in-stock`,
      method: "GET",
      params: {
        organizationId,
        email,
        searchString,
        pageNumber,
        pageSize,
      },
    });
    return response;
  }

  async getProductsByOrganization(params: fetchProductsByOrganizationParams) {
    const response = await fetchData<
      ApiResponse<PaginationResponse<ProductType>>
    >({
      endpoint: `${this.BASE_URL}/get-by-organization`,
      method: "GET",
      params,
    });
    return response;
  }

  async createProduct(payload: createProductParams) {
    const response = await fetchData<ApiResponse<ProductType>>({
      endpoint: this.BASE_URL,
      method: "POST",
      payload,
    });
    return response;
  }

  async updateProduct(payload: updateProductParams) {
    const response = await fetchData<ApiResponse<ProductType>>({
      endpoint: `${this.BASE_URL}/update-product`,
      method: "PATCH",
      payload,
    });
    return response;
  }

  async deleteProduct(productId: string) {
    const response = await fetchData<ApiResponse<ProductType>>({
      endpoint: `${this.BASE_URL}/delete-product`,
      method: "DELETE",
      payload: {
        productId,
      },
    });
    return response;
  }

  async getProductById(productId: string) {
    const response = await fetchData<ApiResponse<ProductType>>({
      endpoint: `${this.BASE_URL}/get-product-by-id`,
      method: "GET",
      params: {
        productId,
      },
    });
    return response;
  }
}
