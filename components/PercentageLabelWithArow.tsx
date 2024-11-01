import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";

const PercentageLabelWithArow = ({ number }: { number: number }) => {
  return (
    <span className="pr-1">
      {number > 0 ? (
        <span className="text-green-500 flex items-center">
          <ArrowUp className="h-4 w-4 inline-block" />
          {number}%
        </span>
      ) : number < 0 ? (
        <span className="text-red-500">
          <ArrowDown className="h-4 w-4 inline-block" />
          {number}%
        </span>
      ) : (
        <span className="text-gray-500">{number}%</span>
      )}
    </span>
  );
};

export default PercentageLabelWithArow;
