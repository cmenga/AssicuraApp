import type { ChangeEvent } from "react";

export type InputProps = {
  previous: string,
  onFormData: (event: ChangeEvent<HTMLInputElement>) => void;
};