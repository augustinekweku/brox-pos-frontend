import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

export type SelectOption = {
  label: string;
  value: string;
};

const SelectInput = ({
  form,
  label,
  name,
  disabled,
  options,
  placeholder,
  onChange,
  emptyListMessage = "No items found",
  emptyListAction,
}: {
  form: any;
  label: string;
  name: string;
  disabled?: boolean;
  options: SelectOption[];
  placeholder: string;
  onChange?: (e: any) => void;
  emptyListMessage?: string;
  emptyListAction?: () => void;
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
            <Select
              value={field.value}
              disabled={disabled}
              onValueChange={(e) => {
                field.onChange(e);
                onChange && onChange(e);
                form.setValue(name, e);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options?.length ? (
                    <SelectLabel>{label}</SelectLabel>
                  ) : (
                    <Button
                      variant={"ghost"}
                      className="w-full text-center"
                      onClick={() => {
                        emptyListAction && emptyListAction();
                      }}
                    >
                      {emptyListMessage}
                    </Button>
                  )}

                  {options?.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString() ?? "null"}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectInput;
