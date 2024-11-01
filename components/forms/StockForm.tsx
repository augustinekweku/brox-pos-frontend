"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import TextInput from "../FormInputs/TextInput";
import useGetUserSession from "@/hooks/useGetUserSession";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { StockValidation } from "@/lib/form-validations/stock";
import { ProductType } from "@/types/product";
import { StockType } from "@/types/stock";
import DI from "@/di-container";

interface Props {
  onSuccess: (stock: StockType) => void;
  item: ProductType;
}

const StockForm = ({ onSuccess, item }: Props) => {
  const router = useRouter();
  const user = useGetUserSession();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof StockValidation>>({
    resolver: zodResolver(StockValidation),
  });
  const userFromRedux = useSelector(
    (state: RootState) => state.auth.userProfile
  );

  const onSubmit = async (values: z.infer<typeof StockValidation>) => {
    setLoading(true);
    try {
      const res = await DI.stockService.addStock({
        quantityAdded: values.quantity,
        itemName: item.name,
        itemId: item._id,
        categoryId: item.categoryId,
        oldQuantity: item.quantity,
        organization: userFromRedux.activeOrganization,
        createdBy: userFromRedux._id,
        newQuantity: item.quantity + values.quantity,
      });

      toast.success(`Stock added successfully`);
      router.refresh();
      onSuccess(res.data);
    } catch (error: any) {
      toast.error(error.message);
      //refresh the route with a new query called refreshId with the current time
    } finally {
      setLoading(false);
    }
  };

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
              label="Quantity"
              placeholder="Enter quantity"
              name="quantity"
              type="number"
            />
          </div>
        </div>

        <Button isLoading={loading} disabled={loading} type="submit">
          {"Add Stock"}
        </Button>
      </form>
    </Form>
  );
};

export default StockForm;
