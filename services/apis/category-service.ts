import { RootState } from "@/store";
import { AuthActions } from "@/store/auth-reducer";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { fetchData } from "../factory";
import { ApiResponse, PaginationResponse } from "@/types";
import {
  fetchOrganizationsByUserParams,
  Organization,
} from "@/types/organization";
import {
  CategoryType,
  createCategoryParams,
  fetchAllCategoriesParams,
  updateCategoryParams,
} from "@/types/category";

export default class CategoryService {
  constructor(
    private store: ToolkitStore<RootState>,
    private authActions: AuthActions
  ) {}
  BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL! + "/categories";

  async getCategoriesByOrganization(params: fetchOrganizationsByUserParams) {
    const response = await fetchData<
      ApiResponse<PaginationResponse<CategoryType>>
    >({
      endpoint: `${this.BASE_URL}/get-by-organization`,
      method: "GET",
      params,
    });
    return response;
  }

  async createCategory(payload: createCategoryParams) {
    const response = await fetchData<ApiResponse<CategoryType>>({
      endpoint: this.BASE_URL,
      method: "POST",
      payload,
    });
    return response;
  }

  async updateCategory(payload: updateCategoryParams) {
    const response = await fetchData<ApiResponse<CategoryType>>({
      endpoint: this.BASE_URL,
      method: "PATCH",
      payload,
    });
    return response;
  }

  async deleteCategory(categoryId: string) {
    const response = await fetchData<ApiResponse<CategoryType>>({
      endpoint: this.BASE_URL,
      method: "DELETE",
      payload: {
        categoryId,
      },
    });
    return response;
  }

  async getAllCategories(params: fetchAllCategoriesParams) {
    const response = await fetchData<ApiResponse<CategoryType[]>>({
      endpoint: `${this.BASE_URL}/get-all`,
      method: "GET",
      params,
    });
    return response;
  }
}
