"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import TextInput from "../FormInputs/TextInput";
import TextareaInput from "../FormInputs/TextareaInput";
import useGetUserSession from "@/hooks/useGetUserSession";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { SupplierType } from "@/types/supplier";
import { SupplierValidation } from "@/lib/form-validations/supplier";
import DI from "@/di-container";

interface Props {
  editObj: SupplierType | null;
  onSuccess: () => void;
}

const SupplierForm = ({ editObj, onSuccess }: Props) => {
  const router = useRouter();
  const user = useGetUserSession();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof SupplierValidation>>({
    resolver: zodResolver(SupplierValidation),
  });
  const userFromRedux = useSelector(
    (state: RootState) => state.auth.userProfile
  );

  const onSubmit = async (values: z.infer<typeof SupplierValidation>) => {
    setLoading(true);
    try {
      editObj?._id.toString()
        ? await DI.supplierService.updateSupplier({
            organizationId: editObj.organization ?? "",
            name: values.name ?? "",
            description: values.description ?? "",
            address: values.address ?? "",
            phone: values.phone ?? "",
            email: values.email ?? "",
            image: "",
            supplierId: editObj._id,
          })
        : await DI.supplierService.createSupplier({
            address: values.address ?? "",
            email: values.email ?? "",
            phone: values.phone ?? "",
            createdById: user?._id,
            name: values.name ?? "",
            description: values.description ?? "",
            image: "",
            organizationId: userFromRedux?.activeOrganization,
          });

      toast.success(`Supplier 
      ${editObj?._id ? "updated" : "added"} successfully`);
      router.refresh();
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
      //refresh the route with a new query called refreshId with the current time
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editObj?._id) {
      form.setValue("name", editObj?.name ?? "");
      form.setValue("description", editObj?.description ?? "");
      form.setValue("phone", editObj?.phone ?? "");
      form.setValue("email", editObj?.email ?? undefined);
      form.setValue("address", editObj?.address ?? "");
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
              placeholder="Supplier Name"
              name="name"
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <TextInput
              form={form}
              label="Phone"
              placeholder="Supplier Phone"
              name="phone"
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <TextInput
              form={form}
              label="Email"
              placeholder="Supplier Email"
              name="email"
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <TextInput
              form={form}
              label="Address"
              placeholder="Supplier Address"
              name="address"
            />
          </div>

          <div className="grid grid-cols-1 items-center gap-4">
            <TextareaInput
              form={form}
              label="Description"
              placeholder="Supplier Description"
              name="description"
              rows={2}
            />
          </div>
        </div>

        <Button isLoading={loading} disabled={loading} type="submit">
          {editObj?._id ? "Update Supplier" : "Add Supplier"}
        </Button>
      </form>
    </Form>
  );
};

export default SupplierForm;
