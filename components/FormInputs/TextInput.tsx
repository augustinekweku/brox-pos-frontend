import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const TextInput = ({
  form,
  label,
  placeholder,
  type,
  inputMode,
  name,
  disabled,
}: {
  form: any;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  inputMode?:
    | "text"
    | "email"
    | "tel"
    | "url"
    | "numeric"
    | "decimal"
    | "none"
    | "search"
    | undefined;
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
            <Input
              disabled={disabled}
              id={label}
              type={type}
              className="account-form_input no-focus w-full"
              inputMode={inputMode}
              placeholder={placeholder}
              {...field}
              onChange={(e) => {
                if (type === "number") {
                  field.onChange(Number(e.target.value));
                } else {
                  field.onChange(e.target.value);
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextInput;
