import { store } from "@/store";
import { ObjectId } from "mongoose";
import CryptoJS from "crypto-js";

export const getSessionMaxAge = () => {
  const now = new Date();
  const targetTime = new Date();
  targetTime.setHours(0, 15);
  targetTime.setDate(targetTime.getDate() + 1);

  const difference = targetTime.getTime() - now.getTime();
  return Math.floor(difference / 1000);
};

export function getIdFromObjectId(objectId: ObjectId): string {
  return objectId.toString();
}

export function parseApiResults(results: any) {
  return JSON.parse(JSON.stringify(results));
}

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
}

export function decryptToken(token: string): string {
  let bytes = CryptoJS.AES.decrypt(
    token,
    process.env.NEXT_PUBLIC_ENC_KEY as unknown as string
  );
  let originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

export function encryptToken(token: string): string {
  let ciphertext = CryptoJS.AES.encrypt(
    token,
    process.env.NEXT_PUBLIC_ENC_KEY as unknown as string
  ).toString();
  return ciphertext;
}

export function getActiveOrganizationObject() {
  const state = store.getState();
  return (
    state.auth.organizations.find(
      (organization) =>
        organization._id === state.auth.userProfile.activeOrganization
    ) ?? null
  );
}

export function getWeekNumberInMonth(date: Date): number {
  // Create a new date object to avoid mutating the original
  const inputDate = new Date(date);

  // Set the date to the first day of the month
  inputDate?.setDate(1);

  // Get the day of the week for the first day of the month
  const firstDayOfMonth = inputDate?.getDay();

  // Calculate the day of the month for the given date
  const dayOfMonth = new Date(date)?.getDate();

  // Calculate the week number
  const weekNumber = Math.ceil((dayOfMonth + firstDayOfMonth) / 7);

  return weekNumber >= 4 ? 4 : weekNumber;
}

export function getMonthName(month: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months[month];
}

export function getDayName(day: number): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

export function getFormattedDate(date: Date): string {
  const day = date.getDate();
  const month = getMonthName(date.getMonth());
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
}

export function getFormattedTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours}:${minutes}`;
}

export function getFormattedDateTime(date: Date): string {
  return `${getFormattedDate(date)} ${getFormattedTime(date)}`;
}
export function calculatePercentageChange(
  currentValue: number,
  previousValue: number
): number {
  // return 0 if previous value is 0
  if (previousValue === 0) return 0;

  const change = currentValue - previousValue;
  const percentageChange = (change / previousValue) * 100;

  return Math.round(percentageChange);
}

export function getDayOfWeek(dateString: string | Date): string {
  const date = new Date(dateString);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return daysOfWeek[date.getUTCDay()];
}

export function formatMoney(amount: number): string {
  return amount?.toLocaleString("en-US", {
    style: "currency",
    currency: "GHS",
  });
}
