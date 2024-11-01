import { ReloadIcon } from "@radix-ui/react-icons";
import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-32">
      <ReloadIcon className="h-12 w-12 animate-spin text-gray-400" />
    </div>
  );
};

export default Loader;
