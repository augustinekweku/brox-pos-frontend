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
import organizationService from "@/services/organizationService";
import { userDetailsFromTokenType } from "@/types/user";
import { UserValidation } from "@/lib/form-validations/user";
import userService from "@/services/userService";

interface Props {
  userFromStore: userDetailsFromTokenType | null;
  onSuccess: () => void;
}

const UserProfileForm = ({ userFromStore, onSuccess }: Props) => {
  const router = useRouter();
  const user = useGetUserSession();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
  });

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    setLoading(true);
    try {
      const updatedUser = await userService.updateUserDetailsById({
        ...values,
        _id: user?._id,
      });
      toast.success("User details updated successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
      //refresh the route with a new query called refreshId with the current time
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userFromStore?._id?.toString()) {
      form.setValue("name", userFromStore?.name);
      form.setValue("email", userFromStore?.email);
      form.setValue("phone", userFromStore?.phone);
      form.setValue("username", userFromStore?.username);
    }
    return () => {
      form.reset();
    };
  }, [userFromStore?._id]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4 hidden">
            <TextInput
              form={form}
              label="User ID"
              placeholder="User ID"
              name="createdById"
              disabled
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <TextInput
              form={form}
              label="Name"
              placeholder="Full Name"
              name="name"
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <TextInput
              form={form}
              label="User Name"
              placeholder="UserName"
              name="username"
              disabled
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <TextInput
              form={form}
              label="User Email"
              placeholder="Enter Email"
              name="email"
              disabled
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <TextInput
              form={form}
              label="User Phone Number"
              placeholder="Enter Phone Number"
              name="phone"
              inputMode="tel"
            />
          </div>
        </div>

        <Button isLoading={loading} disabled={loading} type="submit">
          {"Update Account"}
        </Button>
      </form>
    </Form>
  );
};

export default UserProfileForm;
