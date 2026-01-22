import type { KeyboardEvent } from "react";

/**
 * The function `getMaxRegisterDate` returns the date 18 years ago in ISO format.
 * @returns The function `getMaxRegisterDate` returns the current date with the year reduced by 18
 * years in ISO format (YYYY-MM-DD).
 */
export function getMaxRegisterDate() {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);

  return today.toISOString().split("T")[0];
}

const ALLOWED_KEYS = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];



/**
 * The function `handleFiscalIdKeyPress` restricts input on a keyboard event to alphanumeric characters
 * and a predefined list of allowed keys.
 * @param event - The `event` parameter is of type `KeyboardEvent<HTMLInputElement>`, which represents
 * an event that occurs when a keyboard key is pressed while the input element is focused.
 */
export function handleFiscalIdKeyPress(event: KeyboardEvent<HTMLInputElement>) {
  const key = event.key;
  const regex = /^[A-Za-z0-9]$/;

  if (!regex.test(key) && !ALLOWED_KEYS.includes(key)) {
    event.preventDefault();
  }
}







/**
 * The function `handleDrivingLicenseKeyPress` restricts input on a text field to alphanumeric
 * characters and specific allowed keys.
 * @param event - The `event` parameter is a KeyboardEvent object that represents an event which occurs
 * when a key is pressed while the input element is focused.
 */
export function handleDrivingLicenseKeyPress(
  event: KeyboardEvent<HTMLInputElement>,
) {
  const key = event.key;
  const regex = /^[A-Za-z0-9]$/;

  if (!regex.test(key) && !ALLOWED_KEYS.includes(key)) {
    event.preventDefault();
  }
}

