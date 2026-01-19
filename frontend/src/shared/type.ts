export type InputProps = {
  labelName: string;
  previous?: string;
};

export interface UserModel {
  first_name: string;
  last_name: string;
  fiscal_id: string;
  date_of_birth: string;
  place_of_birth: string;
  gender: string;
  email: string;
  phone_number: string;
}

export interface AddressModel {
  cap: number;
  city: string;
  civic_number: string;
  province: string;
  street: string;
  type: string;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  data?: any;
}
