import { SaleStatus } from "@/types/sale";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractNameFromEmail(email: string): string {
  // Find the index of the "@" symbol
  const atIndex = email.indexOf("@");

  // If "@" is not found, return an empty string
  if (atIndex === -1) {
    return "";
  }

  // Extract the part of the email before the "@" symbol
  return email.substring(0, atIndex);
}

export function delayFunction(fn: Function, delay: number) {
  return setTimeout(fn, delay);
}

export function getSalesStatusColor(status: SaleStatus | undefined) {
  switch (status) {
    case SaleStatus.PAID:
      return "success";
    case SaleStatus.UNPAID:
      return "warning";
    case SaleStatus.FAILED:
      return "destructive";
    case SaleStatus.CANCELLED:
      return "default";
    default:
      return "default";
  }
}
