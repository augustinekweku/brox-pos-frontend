"use client";
import Image from "next/image";
import { ChevronLeft, PlusCircle, Upload } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useReducer } from "react";
import { ProductStatus, ProductType } from "@/types/product";
import InnerRelativeLoader from "@/components/loaders/InnerRelativeLoader";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useGetCategories from "@/hooks/useGetCategories";
import useGetSuppliers from "@/hooks/useGetSuppliers";
import { ProductValidation } from "@/lib/form-validations/product";
import DateInput from "@/components/FormInputs/DateInput";
import TextareaInput from "@/components/FormInputs/TextareaInput";
import SelectInput from "@/components/FormInputs/SelectInput";
import TextInput from "@/components/FormInputs/TextInput";
import { AddStockModal } from "@/components/modals/AddStockModal";
import { delayFunction } from "@/lib/utils";
import { get } from "http";
import { SupplierType } from "@/types/supplier";
import DI from "@/di-container";

type Props = {
  id?: string;
  isEditing?: boolean;
};

const InitialState = {
  isLoading: false,
  editObj: null as ProductType | null,
  isSubmittingForm: false,
  openAddStockModal: false,
};

type State = typeof InitialState;
const SingleProduct = ({ id, isEditing = false }: Props) => {
  const [state, updateState] = useReducer(
    (state: State, newState: Partial<State>) => {
      return { ...state, ...newState };
    },
    InitialState
  );

  const userFromRedux = useSelector(
    (state: RootState) => state.auth.userProfile
  );
  const router = useRouter();

  const [
    getCategories,
    isLoadingCategories,
    categoriesResponse,
    errorForGettingCategories,
  ] = useGetCategories({});
  const [
    getSuppliers,
    isLoadingSuppliers,
    suppliersResponse,
    errorForGettingSuppliers,
  ] = useGetSuppliers({});

  const form = useForm<z.infer<typeof ProductValidation>>({
    resolver: zodResolver(ProductValidation),
  });

  const onSubmit = async (values: z.infer<typeof ProductValidation>) => {
    updateState({ isSubmittingForm: true });
    try {
      state.editObj?._id?.toString()
        ? await DI.productService.updateProduct({
            organizationId: state.editObj.organization,
            name: values.name,
            description: values.description,
            categoryId: values.categoryId,
            productId: state.editObj._id,
            genericName: values.genericName,
            productCode: values.productCode,
            costPrice: values.costPrice,
            sellingPrice: values.sellingPrice,
            quantity: values.quantity,
            supplierId: values.supplierId,
            dateOfArrival: values.dateOfArrival,
            status: values.status,
          })
        : await DI.productService.createProduct({
            createdById: userFromRedux?._id,
            name: values.name ?? "",
            description: values.description ?? "",
            image: "",
            organizationId: userFromRedux?.activeOrganization,
            categoryId: values.categoryId ?? "",
            genericName: values.genericName ?? "",
            productCode: values.productCode ?? "",
            costPrice: values.costPrice,
            sellingPrice: values.sellingPrice,
            quantity: values.quantity,
            supplierId: values.supplierId ?? "",
            dateOfArrival: values.dateOfArrival ?? "",
          });

      toast.success(`Product 
      ${state.editObj?._id ? "updated" : "added"} successfully`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      updateState({ isSubmittingForm: false });
    }
  };

  useEffect(() => {
    if (state.editObj?._id) {
      form.setValue("name", state.editObj?.name);
      form.setValue("description", state.editObj?.description);
      form.setValue("genericName", state.editObj?.genericName);
      form.setValue("costPrice", state.editObj?.costPrice);
      form.setValue("sellingPrice", state.editObj?.sellingPrice);
      form.setValue("quantity", state.editObj?.quantity);
      form.setValue("supplierId", state.editObj?.supplierId);
      form.setValue("categoryId", state.editObj?.categoryId);
      form.setValue("productCode", state.editObj?.productCode);
      form.setValue("dateOfArrival", new Date(state.editObj?.dateOfArrival));
      form.setValue("status", state.editObj?.status);
    }
  }, [state.editObj?._id?.toString()]);

  async function getProduct() {
    // Fetch product by id
    if (!id) return;
    updateState({ isLoading: true });
    try {
      const res = await DI.productService.getProductById(id);
      updateState({ isLoading: false, editObj: res.data });
    } catch (error) {
      updateState({ isLoading: false });
    }
  }

  useEffect(() => {
    if (isEditing) {
      getProduct();
    }
  }, [id, isEditing]);
  return (
    <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 relative">
      {state.isLoading && <InnerRelativeLoader />}
      {state.editObj && (
        <AddStockModal
          item={state.editObj}
          onSuccess={(stock) => {
            updateState({ openAddStockModal: false });
            stock.newQuantity && form.setValue("quantity", stock.newQuantity);
          }}
          open={state.openAddStockModal}
          openOpenChange={() =>
            updateState({ openAddStockModal: !state.openAddStockModal })
          }
        />
      )}

      <Form {...form}>
        <form
          className="flex flex-col justify-start gap-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={() => {
                router.back();
              }}
              variant="outline"
              type="button"
              size="icon"
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Pro Controller
            </h1>
            <Badge variant="outline" className="ml-auto sm:ml-0">
              In stock
            </Badge>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button type="button" variant="outline" size="sm">
                Discard
              </Button>
              <Button type="submit" size="sm">
                Save Product
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 items-center gap-4">
                      <TextInput
                        form={form}
                        label="Name"
                        placeholder="Product Name"
                        name="name"
                      />
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                      <TextInput
                        form={form}
                        label="Generic Name"
                        placeholder="Enter Product Generic Name"
                        name="genericName"
                      />
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                      <TextInput
                        form={form}
                        label="Product Code (SKU)"
                        placeholder="Enter Product Code"
                        name="productCode"
                      />
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                      <TextInput
                        form={form}
                        label="Cost Price"
                        placeholder="Enter Cost Price"
                        name="costPrice"
                        type="number"
                      />
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                      <TextInput
                        form={form}
                        label="Selling Price"
                        placeholder="Enter Selling Price"
                        name="sellingPrice"
                        type="number"
                      />
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                      <TextInput
                        form={form}
                        label="Quantity"
                        placeholder="Enter Quantity"
                        name="quantity"
                        type="number"
                      />
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                      <SelectInput
                        form={form}
                        label="Category"
                        placeholder="Select Category"
                        name="categoryId"
                        options={
                          categoriesResponse?.results?.map((category) => ({
                            label: category.name,
                            value: category._id,
                          })) ?? []
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                      <SelectInput
                        form={form}
                        label="Supplier"
                        placeholder="Enter  Supplier"
                        name="supplierId"
                        options={
                          suppliersResponse?.results?.map(
                            (supplier: SupplierType) => ({
                              label: supplier.name,
                              value: supplier._id,
                            })
                          ) ?? []
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 items-center gap-4">
                      <DateInput
                        form={form}
                        label="Date of Arrival"
                        placeholder="Enter Date of Arrival"
                        name="dateOfArrival"
                      />
                    </div>

                    <div className="grid grid-cols-1 items-center gap-4">
                      <TextareaInput
                        form={form}
                        label="Description"
                        placeholder="Product Description"
                        name="description"
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-1" className="hidden">
                <CardHeader>
                  <CardTitle>Stock</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">SKU</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="w-[100px]">Size</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold">
                          GGPC-001
                        </TableCell>
                        <TableCell>
                          <Label htmlFor="stock-1" className="sr-only">
                            Stock
                          </Label>
                          <Input
                            id="stock-1"
                            type="number"
                            defaultValue="100"
                          />
                        </TableCell>
                        <TableCell>
                          <Label htmlFor="price-1" className="sr-only">
                            Price
                          </Label>
                          <Input
                            id="price-1"
                            type="number"
                            defaultValue="99.99"
                          />
                        </TableCell>
                        <TableCell>
                          <ToggleGroup
                            type="single"
                            defaultValue="s"
                            variant="outline"
                          >
                            <ToggleGroupItem value="s">S</ToggleGroupItem>
                            <ToggleGroupItem value="m">M</ToggleGroupItem>
                            <ToggleGroupItem value="l">L</ToggleGroupItem>
                          </ToggleGroup>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">
                          GGPC-002
                        </TableCell>
                        <TableCell>
                          <Label htmlFor="stock-2" className="sr-only">
                            Stock
                          </Label>
                          <Input
                            id="stock-2"
                            type="number"
                            defaultValue="143"
                          />
                        </TableCell>
                        <TableCell>
                          <Label htmlFor="price-2" className="sr-only">
                            Price
                          </Label>
                          <Input
                            id="price-2"
                            type="number"
                            defaultValue="99.99"
                          />
                        </TableCell>
                        <TableCell>
                          <ToggleGroup
                            type="single"
                            defaultValue="m"
                            variant="outline"
                          >
                            <ToggleGroupItem value="s">S</ToggleGroupItem>
                            <ToggleGroupItem value="m">M</ToggleGroupItem>
                            <ToggleGroupItem value="l">L</ToggleGroupItem>
                          </ToggleGroup>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">
                          GGPC-003
                        </TableCell>
                        <TableCell>
                          <Label htmlFor="stock-3" className="sr-only">
                            Stock
                          </Label>
                          <Input id="stock-3" type="number" defaultValue="32" />
                        </TableCell>
                        <TableCell>
                          <Label htmlFor="price-3" className="sr-only">
                            Stock
                          </Label>
                          <Input
                            id="price-3"
                            type="number"
                            defaultValue="99.99"
                          />
                        </TableCell>
                        <TableCell>
                          <ToggleGroup
                            type="single"
                            defaultValue="s"
                            variant="outline"
                          >
                            <ToggleGroupItem value="s">S</ToggleGroupItem>
                            <ToggleGroupItem value="m">M</ToggleGroupItem>
                            <ToggleGroupItem value="l">L</ToggleGroupItem>
                          </ToggleGroup>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="justify-center border-t p-4">
                  <Button size="sm" variant="ghost" className="gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add Variant
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-3">
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <SelectInput
                        name="status"
                        label="Status"
                        form={form}
                        placeholder="Select Status"
                        options={[
                          { label: "Active", value: ProductStatus.active },
                          { label: "Inactive", value: ProductStatus.inactive },
                          { label: "Archived", value: ProductStatus.archived },
                        ]}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <Image
                      alt="Product image"
                      className="aspect-square w-full rounded-md object-cover"
                      height="300"
                      src="/placeholder.svg"
                      width="300"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <button>
                        <Image
                          alt="Product image"
                          className="aspect-square w-full rounded-md object-cover"
                          height="84"
                          src="/placeholder.svg"
                          width="84"
                        />
                      </button>
                      <button>
                        <Image
                          alt="Product image"
                          className="aspect-square w-full rounded-md object-cover"
                          height="84"
                          src="/placeholder.svg"
                          width="84"
                        />
                      </button>
                      <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-5">
                <CardHeader>
                  <CardTitle>Stock</CardTitle>
                  <CardDescription>Add stock to your product</CardDescription>
                </CardHeader>
                <CardContent>
                  <div></div>
                  <Button
                    onClick={() => {
                      updateState({
                        openAddStockModal: !state.openAddStockModal,
                      });
                    }}
                    size="sm"
                    variant="secondary"
                    type="button"
                  >
                    Add Stock
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <Button size="sm" type="submit">
              Save Product
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SingleProduct;
