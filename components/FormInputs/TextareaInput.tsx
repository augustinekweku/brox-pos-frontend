import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

const TextareaInput = ({
  form,
  label,
  placeholder,
  rows,
  name,
  disabled,
}: {
  form: any;
  label: string;
  placeholder: string;
  rows: number;
  name: string;
  disabled?: boolean;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col gap-3">
          <FormLabel className="text-base-semibold text-light-2">
            {label}
          </FormLabel>
          <FormControl>
            <Textarea
              id={label}
              className="account-form_input no-focus"
              placeholder={placeholder}
              {...field}
              rows={rows}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextareaInput;
