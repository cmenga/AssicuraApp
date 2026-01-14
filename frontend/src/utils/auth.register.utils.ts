import type { KeyboardEvent } from "react";

export function getMaxRegisterDate() {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);

  return today.toISOString().split('T')[0];
}

const ALLOWED_KEYS = [
  'Backspace',
  'Delete',
  'ArrowLeft',
  'ArrowRight',
  'Tab',
]

export function handleNameKeyPress(event: KeyboardEvent<HTMLInputElement>) {
  const key = event.key;
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ' ]$/;
  if (!regex.test(key) && !ALLOWED_KEYS.includes(key)) {
    event.preventDefault();
  }
}