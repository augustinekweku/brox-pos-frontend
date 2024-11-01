import { ReloadIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import React from "react";

const LoadingIcon = ({ customClass }: { customClass?: string }) => {
  return (
    <ReloadIcon
      className={clsx(
        " ml-2 mr-2 h-4 w-4 animate-spin opacity-100",
        customClass
      )}
    />
  );
};

export default LoadingIcon;
