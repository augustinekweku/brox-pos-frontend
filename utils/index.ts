import { store } from "@/store";
import CryptoJS from "crypto-js";

export function callSnackbar(
  status: boolean,
  severity: "success" | "error" | "warning" | "info",
  message: string,
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  }
) {
  store.dispatch({
    type: "snackbar/setSnackbar",
    payload: {
      status,
      severity,
      message,
      anchorOrigin: anchorOrigin || {
        vertical: "top",
        horizontal: "right",
      },
    },
  });
}

export function callGenericDialog(
  status: boolean,
  title: string,
  type: "success" | "error" | "warning" | "info",
  message: string
) {
  store.dispatch({
    type: "genericDialog/setGenericDialog",
    payload: {
      status,
      title,
      type,
      message,
    },
  });
}

export function isEmailValid(email: string) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
}

export function isPhoneValid(phoneNumber: string) {
  const phoneNumberRegex = /^\d{10}$/;
  return phoneNumberRegex.test(phoneNumber);
}

export function ApiErrorParser(error: any) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error.message ||
    "Something went wrong"
  );
}

export function callGenericConfirmModal(message: string = "") {
  store.dispatch({
    type: "genericConfirmModal/callGenericConfirmModal",
    payload: {
      message,
    },
  });
}

export function trimText(text: string, length: number) {
  if (text?.length > length) {
    return text?.substring(0, length) + "...";
  } else {
    return text;
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatPhoneNumber(phoneNumber: string | number): string {
  // Remove any non-digit characters from the phone number
  const digitsOnly = phoneNumber?.toString().replace(/\D/g, "");

  // Check if the phone number starts with a zero
  if (digitsOnly?.startsWith("0")) {
    return digitsOnly; // No formatting needed
  }

  // Add a leading zero to the phone number
  const formattedNumber = `0${digitsOnly}`;

  return formattedNumber;
}

/** This password validation method returns either a string or true,
 *
 *  If the password is valid, it returns true,
 *
 *  If the password is invalid, it returns a string with the error message.
 *
 * @param password The password to validate
 *
 */
export function isPasswordValid(password: string): string | true {
  const regex =
    /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;

  if (!regex.test(password)) {
    let errorMessage = "";

    if (!/(?=.*?[A-Z])/.test(password)) {
      errorMessage += "Password must contain at least one uppercase letter. ";
    }

    if (!/(?=(.*[a-z]){1,})/.test(password)) {
      errorMessage += "Password must contain at least one lowercase letter. ";
    }

    if (!/(?=(.*[\d]){1,})/.test(password)) {
      errorMessage += "Password must contain at least one digit. ";
    }

    if (!/(?=(.*[\W]){1,})/.test(password)) {
      errorMessage += "Password must contain at least one special character. ";
    }

    if (!/(?!.*\s)/.test(password)) {
      errorMessage += "Password must not contain any whitespace. ";
    }

    if (errorMessage === "") {
      return true;
    } else {
      return errorMessage.trim();
    }
  }

  return true;
}

function isEmpty(value: any): boolean {
  // Define what is considered empty (you can adjust this as needed)
  if (value === undefined || value === null) {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  if (typeof value === "string" && value.trim() === "") {
    return true;
  }

  return false;
}

//function to check if an objects in array of objects has empty values

export function hasEmptyValues(objects: any[]): boolean {
  for (const obj of objects) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (isEmpty(obj[key])) {
          return true;
        }
      }
    }
  }

  return false;
}

export function getColorClassFromStatus(status: string): string {
  status = status.toUpperCase();
  switch (status) {
    case "A":
    case "A+":
    case "A-":
    case "B+":
    case "B":
    case "B-":
      return "success";

    case "C+":
    case "C":
    case "C-":
    case "D+":
    case "D":
    case "D-":
      return "warning";
    case "E":
    case "F":
    case "F-":
      return "error";
    default:
      return "warning";
  }
}

export function removeZeroFromFirstIndex(num: any) {
  let str = num.toString();
  if (str.charAt(0) === "0" && str.length > 1 && str.charAt(1) !== ".") {
    str = str.substring(1);
    return str;
  }
  return str;
}

export function hasNullOrEmptyValues(
  ...values: (string | null | undefined)[]
): boolean {
  for (const value of values) {
    if (value === "" || value === null || value === undefined) {
      return true; // Found an empty, null, or undefined value
    }
  }
  return false; // No empty, null, or undefined values found
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

export function getColorByNumber(value: number): string {
  value = Number(value);
  if (value < 0) {
    return "red";
  } else if (value > 0) {
    return "green";
  } else {
    return "black";
  }
}
