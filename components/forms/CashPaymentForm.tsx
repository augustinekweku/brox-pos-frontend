"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import TextInput from "../FormInputs/TextInput";
import TextareaInput from "../FormInputs/TextareaInput";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { CashPaymentValidation } from "@/lib/form-validations/cash-payment";
export type ICashPayment = z.infer<typeof CashPaymentValidation> & {
  cashTendered: number;
};

interface Props {
  onSubmit: (values: ICashPayment) => void;
  isLoading?: boolean;
}

const CashPaymentForm = ({ onSubmit, isLoading }: Props) => {
  const form = useForm<z.infer<typeof CashPaymentValidation>>({
    resolver: zodResolver(CashPaymentValidation),
  });

  const SubmitForm = async (values: z.infer<typeof CashPaymentValidation>) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(SubmitForm)}
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <TextInput
              form={form}
              label="Cash Tendered"
              placeholder="eg 100"
              name="cashTendered"
              type="number"
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <TextInput
              form={form}
              label="Name"
              placeholder="Customer Name"
              name="customerName"
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <TextInput
              form={form}
              label="Customer Phone Number"
              placeholder="eg 0241234567"
              name="customerPhone"
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <TextareaInput
              form={form}
              label="Note"
              placeholder="Enter note here"
              name="note"
              rows={2}
            />
          </div>
        </div>

        <Button isLoading={isLoading} type="submit">
          {"Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default CashPaymentForm;
