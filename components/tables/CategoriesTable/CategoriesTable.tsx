"use client";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEffect, useReducer } from "react";
import { CategoryType } from "@/types/category";
import useGetUserSession from "@/hooks/useGetUserSession";
import toast from "react-hot-toast";

import { CategoryFormModal } from "../../modals/CategoryFormModal";
import { ConfirmDeleteModal } from "../../modals/ConfirmDeleteModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useCategoriesTableColums } from "./Columns";
import { DataTable } from "@/components/DataTable";
import DI from "@/di-container";

type State = {
  editObj: CategoryType | null;
  openDialog: boolean;
  openDeleteDialog: boolean;
  loading: boolean;
  searchString: string;
  pageNumber: number;
  pageSize: number | undefined;
  categories: CategoryType[];
};

export function CategoriesTable() {
  const user = useGetUserSession();
  const userFromRedux = useSelector(
    (state: RootState) => state.auth.userProfile
  );

  const [state, updateState] = useReducer(
    (state: State, newState: Partial<State>) => {
      return { ...state, ...newState };
    },
    {
      editObj: null,
      openDialog: false,
      openDeleteDialog: false,
      loading: false,
      searchString: "",
      pageNumber: 1,
      pageSize: 25,
      categories: [],
    }
  );

  const categoriesTableColumns = useCategoriesTableColums({
    onDelete(id) {
      const category = state.categories.find((c) => c._id === id);
      updateState({ editObj: category, openDeleteDialog: true });
    },
    onEdit(id) {
      const category = state.categories.find((c) => c._id === id);
      updateState({ editObj: category, openDialog: true });
    },
  });

  async function getCategories() {
    updateState({ loading: true });
    try {
      const res = await DI.categoryService.getCategoriesByOrganization({
        organizationId: userFromRedux?.activeOrganization,
        email: user.email,
        searchString: state.searchString,
        pageNumber: state.pageNumber,
        pageSize: state.pageSize || 25,
      });
      updateState({ loading: false, categories: res.data.results });
      return res;
    } catch (error) {
      console.log(error);
      updateState({ loading: false });
      toast.error("Error fetching categories");
    }
  }

  async function deleteCategory(id: string) {
    try {
      await DI.categoryService.deleteCategory(id);
      toast.success("Category deleted");
      getCategories();
      updateState({ openDeleteDialog: false, editObj: null });
    } catch (error) {
      toast.error("Error deleting category");
      updateState({ openDeleteDialog: false, editObj: null });
    }
  }
  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div>
      <CategoryFormModal
        openOpenChange={() => {
          updateState({ openDialog: false });
        }}
        editObj={state.editObj}
        open={state.openDialog}
        onSuccess={() => {
          getCategories();
        }}
      />
      <ConfirmDeleteModal
        open={state.openDeleteDialog}
        openOpenChange={() => {
          updateState({ openDeleteDialog: false, editObj: null });
        }}
        onConfirm={() => {
          !state.editObj?._id.toString() &&
            toast.error("No category to delete");
          state.editObj?._id.toString() &&
            deleteCategory(state.editObj?._id.toString());
        }}
        onCancel={() => {
          toast.error("Category not deleted");
          updateState({ openDeleteDialog: false, editObj: null });
        }}
        title="Delete Category"
        description="Are you sure you want to delete this category?"
      />

      <Tabs defaultValue="all">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
            <Button
              onClick={() => {
                updateState({ openDialog: true, editObj: null });
              }}
              size="sm"
              className="h-7 gap-1"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Category
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Manage your product categories here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={categoriesTableColumns}
                data={state.categories}
                isLoading={state.loading}
              />
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
