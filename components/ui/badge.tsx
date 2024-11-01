import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",

        outline: "text-foreground",
        success: "border-green-500 bg-[#00c85328] text-green-600",
        active: "border-green-500 bg-[#00c85328] text-green-600",
        paid: "border-green-500 bg-[#00c85328] text-green-600",
        pending: "border-yellow-500 bg-[#ffeb3b75] text-yellow-600",

        unpaid: "border-yellow-500 bg-[#ffeb3b75] text-yellow-600",

        warning: "border-yellow-500 bg-[#ffeb3b75] text-yellow-600",
        info: "border-blue-500 bg-[#2196f375] text-blue-600",
        danger: "border-red-500 bg-[#f4433675] text-red-600",
        inactive: "border-red-500 bg-[#f4433675] text-red-600",
        cancelled: "border-red-500 bg-[#f4433675] text-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
