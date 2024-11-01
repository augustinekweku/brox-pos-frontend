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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetUserSession from "@/hooks/useGetUserSession";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ProductType } from "@/types/product";
import { useReducer } from "react";
import toast from "react-hot-toast";
import useGetProducts from "@/hooks/useGetProducts";
import { ProductFormModal } from "@/components/modals/ProductFormModal";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { DataTable } from "@/components/DataTable";
import { useProductsTableColumns } from "./Columns";
import DI from "@/di-container";

const IntialState = {
  editObj: {} as ProductType | null,
  openDialog: false,
  openDeleteDialog: false,
  loading: false,
  searchString: "",
  pageNumber: 1,
  pageSize: 25,
};

type State = typeof IntialState;

export function ProductsTable() {
  const user = useGetUserSession();
  const userFromRedux = useSelector(
    (state: RootState) => state.auth.userProfile
  );

  const [state, updateState] = useReducer(
    (state: State, newState: Partial<State>) => {
      return { ...state, ...newState };
    },
    IntialState
  );

  const ProductsTableColumns = useProductsTableColumns({
    onDelete(id) {
      const product = productsResponse.results.find((p) => p._id === id);
      updateState({ editObj: product, openDeleteDialog: true });
    },
  });

  const [
    getProducts,
    isLoadingProducts,
    productsResponse,
    errorForGettingProducts,
  ] = useGetProducts({});

  async function deleteProduct(id: string) {
    try {
      await DI.productService.deleteProduct(id);
      toast.success("Product deleted");
      getProducts();
      updateState({ openDeleteDialog: false, editObj: null });
    } catch (error) {
      toast.error("Error deleting product");
      updateState({ openDeleteDialog: false, editObj: null });
    }
  }
  return (
    <div>
      <ProductFormModal
        openOpenChange={() => {
          updateState({ openDialog: false });
        }}
        editObj={state.editObj}
        open={state.openDialog}
        onSuccess={() => {
          getProducts();
        }}
      />
      <ConfirmDeleteModal
        open={state.openDeleteDialog}
        openOpenChange={() => {
          updateState({ openDeleteDialog: false, editObj: null });
        }}
        onConfirm={() => {
          !state.editObj?._id.toString() && toast.error("No product to delete");
          state.editObj?._id.toString() &&
            deleteProduct(state.editObj?._id.toString());
        }}
        onCancel={() => {
          toast.error("Product not deleted");
          updateState({ openDeleteDialog: false, editObj: null });
        }}
        title="Delete Product"
        description="Are you sure you want to delete this product?"
      />

      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Inactive</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button
              onClick={() => {
                updateState({ openDialog: true });
              }}
              size="sm"
              className="h-7 gap-1"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="">
              <DataTable
                columns={ProductsTableColumns}
                data={productsResponse.results}
                isLoading={isLoadingProducts}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="">
              <DataTable
                columns={ProductsTableColumns}
                data={productsResponse.results}
                isLoading={isLoadingProducts}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
