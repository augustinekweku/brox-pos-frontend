"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, use, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CompanyValidation } from "@/lib/form-validations/organization";
import TextInput from "../FormInputs/TextInput";
import TextareaInput from "../FormInputs/TextareaInput";
import useGetUserSession from "@/hooks/useGetUserSession";
import { Organization } from "@/types/organization";
import toast from "react-hot-toast";
import DI from "@/di-container";

interface Props {
  editObj: Organization | null;
  onSuccess: () => void;
}

const AddCompanyForm = ({ editObj, onSuccess }: Props) => {
  const router = useRouter();
  const user = useGetUserSession();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof CompanyValidation>>({
    resolver: zodResolver(CompanyValidation),
  });

  console.log("useGetUserSession", user);

  const onSubmit = async (values: z.infer<typeof CompanyValidation>) => {
    setLoading(true);
    try {
      editObj?._id.toString()
        ? await DI.organizationService.updateOrganization({
            organizationId: editObj._id,
            name: values.name ?? "",
            address: values.address ?? "",
            description: values.description ?? "",
            logo: values?.logo ?? "",
            phone: values.phone ?? "",
          })
        : await DI.organizationService.createOrganization({
            name: values.name ?? "",
            address: values.address ?? "",
            description: values.description ?? "",
            logo: values?.logo ?? "",
            phone: values.phone ?? "",
            createdById: values.createdById ?? "",
          });

      toast.success(`Company 
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
    form.setValue("createdById", user?._id);
    if (editObj?._id) {
      form.setValue("name", editObj?.name);
      form.setValue("description", editObj?.description);
      form.setValue("address", editObj?.address);
      form.setValue("phone", editObj?.phone);
    }
  }, [editObj?._id.toString(), user?._id]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4 ">
            <TextInput
              form={form}
              label="User ID"
              placeholder="User ID"
              name="createdById"
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <TextInput
              form={form}
              label="Name"
              placeholder="Company Name"
              name="name"
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <TextInput
              form={form}
              label="Address"
              placeholder="Company Address"
              name="address"
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <TextInput
              form={form}
              label="Company Phone Number"
              placeholder="Enter Company Phone Number"
              name="phone"
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <TextareaInput
              form={form}
              label="Description"
              placeholder="Company Description"
              name="description"
              rows={2}
            />
          </div>
        </div>

        <Button isLoading={loading} disabled={loading} type="submit">
          {editObj?._id ? "Update Company" : "Add Company"}
        </Button>
      </form>
    </Form>
  );
};

export default AddCompanyForm;
