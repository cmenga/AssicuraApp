import type { KeyboardEvent } from "react";


const ALLOWED_KEYS = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
/**
 * The function `handlePhoneNumberKeyPress` restricts input to only allow numeric characters and
 * specific allowed keys.
 * @param event - KeyboardEvent<HTMLInputElement>
 */
export function handleNumberKeyPress(event: KeyboardEvent<HTMLInputElement>) {
  const key = event.key;
  const regex = /^[0-9]$/;

  if (!regex.test(key) && !ALLOWED_KEYS.includes(key)) {
    event.preventDefault();
  }
}

/**
 * The function `handleEmailKeyPress` restricts input on an email field to specific characters.
 * @param event - The `event` parameter is a `KeyboardEvent` object that represents an event generated
 * by a keyboard input. In this case, it specifically refers to an event associated with an `<input>`
 * element.
 */
export function handleEmailKeyPress(event: KeyboardEvent<HTMLInputElement>) {
  const key = event.key;
  const regex = /^[A-Za-z0-9._%+-@]$/;

  if (!regex.test(key) && !ALLOWED_KEYS.includes(key)) {
    event.preventDefault();
  }
}

/**
 * The function `handleStreetKeyPress` restricts keyboard input to only allow certain characters for a
 * street address.
 * @param event - KeyboardEvent<HTMLInputElement>
 */
export function handleStreetKeyPress(event: KeyboardEvent<HTMLInputElement>) {
  const key = event.key;
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9.'\-/, ]$/;

  if (!regex.test(key) && !ALLOWED_KEYS.includes(key)) {
    event.preventDefault();
  }
}


/**
 * The function `handleCivicKeyPress` restricts keyboard input to alphanumeric characters and the
 * forward slash in an input field.
 * @param event - The `event` parameter is a KeyboardEvent object that represents an event which occurs
 * when a key on the keyboard is pressed. In this case, it is specifically typed as a KeyboardEvent for
 * an HTMLInputElement, indicating that the event is related to a key press within an input element on
 * an HTML form
 */
export function handleCivicKeyPress(event: KeyboardEvent<HTMLInputElement>) {
  const key = event.key;
  const regex = /^[0-9A-Za-z/]$/;

  if (!regex.test(key) && !ALLOWED_KEYS.includes(key)) {
    event.preventDefault();
  }
}

/**
 * The function `handleNameKeyPress` restricts input to only allow alphabetic characters, spaces, and
 * apostrophes.
 * @param event - The `event` parameter in the `handleNameKeyPress` function is of type
 * `KeyboardEvent<HTMLInputElement>`. This means it represents an event that occurs when a keyboard key
 * is pressed while the focus is on an input element.
 */
export function handleNameKeyPress(event: KeyboardEvent<HTMLInputElement>) {
  const key = event.key;
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ' ]$/;
  if (!regex.test(key) && !ALLOWED_KEYS.includes(key)) {
    event.preventDefault();
  }
}

/**
 * The function `handleProvinceKeyPress` prevents input of non-alphabetic characters and specific keys
 * in a province input field.
 * @param event - KeyboardEvent<HTMLInputElement>
 */
export function handleProvinceKeyPress(event: KeyboardEvent<HTMLInputElement>) {
  const key = event.key;
  const regex = /^[A-Za-z]$/;

  if (!regex.test(key) && !ALLOWED_KEYS.includes(key)) {
    event.preventDefault();
  }
}

/**
 * The function `handlePasswordKeyPress` restricts input to only allow certain characters for a
 * password field.
 * @param event - The `event` parameter is a `KeyboardEvent` object that represents an event generated
 * by a keyboard (usually related to a specific key being pressed). In this case, it specifically
 * refers to an event associated with an `<input>` element.
 */
export function handlePasswordKeyPress(event: KeyboardEvent<HTMLInputElement>) {
  const key = event.key;
  const regex = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]$/;

  if (!regex.test(key) && !ALLOWED_KEYS.includes(key)) {
    event.preventDefault();
  }
}