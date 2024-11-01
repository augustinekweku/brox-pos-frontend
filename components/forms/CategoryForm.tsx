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
import { Organization } from "@/types/organization";
import toast from "react-hot-toast";
import { CategoryType } from "@/types/category";
import { CategoryValidation } from "@/lib/form-validations/category";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import DI from "@/di-container";

interface Props {
  editObj: CategoryType | null;
  onSuccess: () => void;
}

const CategoryForm = ({ editObj, onSuccess }: Props) => {
  const router = useRouter();
  const user = useGetUserSession();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof CategoryValidation>>({
    resolver: zodResolver(CategoryValidation),
  });
  const userFromRedux = useSelector(
    (state: RootState) => state.auth.userProfile
  );

  const onSubmit = async (values: z.infer<typeof CategoryValidation>) => {
    setLoading(true);
    console.log("useGetUserSession", userFromRedux);
    try {
      editObj?._id.toString()
        ? await DI.categoryService.updateCategory({
            organizationId: editObj.organization ?? "",
            name: values.name ?? "",
            description: values.description ?? "",
            categoryId: editObj._id,
          })
        : await DI.categoryService.createCategory({
            createdById: userFromRedux?._id,
            name: values.name ?? "",
            description: values.description ?? "",
            image: "",
            organizationId: userFromRedux?.activeOrganization,
          });

      toast.success(`Category 
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
  }, [editObj?._id.toString()]);

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
              placeholder="Category Name"
              name="name"
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <TextareaInput
              form={form}
              label="Description"
              placeholder="Category Description"
              name="description"
              rows={2}
            />
          </div>
        </div>

        <Button isLoading={loading} disabled={loading} type="submit">
          {editObj?._id ? "Update Category" : "Add Category"}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryForm;
