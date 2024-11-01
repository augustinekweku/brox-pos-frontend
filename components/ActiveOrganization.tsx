"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon, ReloadIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { storeCartActions } from "@/store/cart-reducer";
import useGetCompanies from "@/hooks/useGetCompanies";
import DI from "@/di-container";

export function ActiveOrganization({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  const userFromRedux = useSelector((state: RootState) => state.auth);
  const organizationsFromRedux = userFromRedux.organizations;

  async function setCompanyActive(companyId: string) {
    !userFromRedux.userProfile?._id?.toString() && toast.error("No user found");
    try {
      await DI.organizationService.setOrganizationAsActive(
        userFromRedux.userProfile?._id?.toString(),
        companyId
      );
      toast.success("Company set as active");
      //set active company in redux
      setLoading(false);
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  }

  const [
    getCompanies,
    isLoadingCompanies,
    companiesResponse,
    errorForGettingCompanies,
  ] = useGetCompanies({});

  React.useEffect(() => {
    getCompanies();
  }, [userFromRedux?.userProfile?.email]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="max-w-[200px] justify-between overflow-hidden"
          disabled={isLoadingCompanies}
          isLoading={isLoadingCompanies}
        >
          <p className="text-ellipsis overflow-hidden">
            {organizationsFromRedux?.find(
              (org) => org._id === userFromRedux.userProfile.activeOrganization
            )?.name ?? "Select Company"}
          </p>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50 z-10" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search company..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Company found.</CommandEmpty>
            <CommandGroup>
              {organizationsFromRedux?.map((org) => (
                <CommandItem
                  key={org._id}
                  value={org._id}
                  onSelect={(currentValue) => {
                    setCompanyActive(currentValue);
                  }}
                  disabled={isLoadingCompanies}
                >
                  {org.name}

                  {isLoadingCompanies ? (
                    <ReloadIcon className=" ml-2 mr-2 h-4 w-4 animate-spin opacity-100" />
                  ) : (
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        userFromRedux.userProfile.activeOrganization === org._id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
