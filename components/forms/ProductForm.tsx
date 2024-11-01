"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, use, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import TextInput from "../FormInputs/TextInput";
import TextareaInput from "../FormInputs/TextareaInput";
import useGetUserSession from "@/hooks/useGetUserSession";
import toast from "react-hot-toast";
import { CategoryValidation } from "@/lib/form-validations/category";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ProductType } from "@/types/product";
import SelectInput from "../FormInputs/SelectInput";
import DateInput from "../FormInputs/DateInput";
import useGetCategories from "@/hooks/useGetCategories";
import useGetSuppliers from "@/hooks/useGetSuppliers";
import { ProductValidation } from "@/lib/form-validations/product";
import { SupplierType } from "@/types/supplier";
import DI from "@/di-container";

interface Props {
  editObj: ProductType | null;
  onSuccess: () => void;
}

const ProductForm = ({ editObj, onSuccess }: Props) => {
  const router = useRouter();
  const user = useGetUserSession();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof ProductValidation>>({
    resolver: zodResolver(ProductValidation),
  });
  const userFromRedux = useSelector(
    (state: RootState) => state.auth.userProfile
  );

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

  const onSubmit = async (values: z.infer<typeof ProductValidation>) => {
    setLoading(true);
    try {
      editObj?._id?.toString()
        ? await DI.productService.updateProduct({
            organizationId: editObj.organization ?? "",
            name: values.name ?? "",
            description: values.description ?? "",
            categoryId: editObj._id,
            productId: editObj._id,
            genericName: values.genericName,
            productCode: values.productCode,
            costPrice: values.costPrice,
            sellingPrice: values.sellingPrice,
            quantity: values.quantity,
            supplierId: values.supplierId,
            dateOfArrival: values.dateOfArrival,
          })
        : await DI.productService.createProduct({
            createdById: user?._id,
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
      ${editObj?._id ? "updated" : "added"} successfully`);
      router.refresh();
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
      //refresh the route with a new query called refreshId with the current time
    } finally {
      setLoading(false);
    }
    // if (pathname === "/profile/edit") {
    //   router.back();
    // } else {
    //   router.push("/");
    // }
  };

  useEffect(() => {
    if (editObj?._id) {
      form.setValue("name", editObj?.name);
      form.setValue("description", editObj?.description);
    }
  }, [editObj?._id?.toString()]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
              placeholder="Select Category "
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
              label="Supllier"
              placeholder="Enter  Supplier"
              name="supplierId"
              options={
                suppliersResponse?.results?.map((supplier: SupplierType) => ({
                  label: supplier.name,
                  value: supplier._id,
                })) ?? []
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

        <Button isLoading={loading} disabled={loading} type="submit">
          {editObj?._id ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
