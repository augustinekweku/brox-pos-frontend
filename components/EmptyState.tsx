import React from "react";
import { Button } from "./ui/button";
import { File } from "lucide-react";

const EmptyState = ({
  title,
  description,
  actionButtonFn,
  actionButtonLabel,
  customChidren,
}: {
  title: string;
  description: string;
  actionButtonFn?: () => void;
  actionButtonLabel?: string;
  customChidren?: React.ReactNode;
}) => {
  return (
    <div className="gap-3 w-60 flex flex-col justify-center items-center mx-auto py-5">
      <div className="mx-auto bg-gray-50 rounded-full shadow-sm">
        <File className="h-20 w-20 text-gray-500 mx-auto" />
      </div>
      <div>
        <h2 className="text-center text-black text-base font-semibold leading-relaxed pb-1">
          {title}
        </h2>
        <p className="text-center text-black text-sm font-normal leading-snug pb-4">
          {description}
        </p>
        {actionButtonFn && (
          <div className="flex gap-3 justify-center items-center">
            <Button onClick={actionButtonFn} variant="default">
              {actionButtonLabel}
            </Button>
          </div>
        )}
        {customChidren && (
          <div className="flex justify-center items-center">
            {customChidren}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
