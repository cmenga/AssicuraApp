


export interface UserRegisterDTO {
  user: UserData;
  address: UserAddress;
}

export type UserRegisterForm = UserData & UserLicense & UserAddress;
export interface UserData {
  first_name: string;
  last_name: string;
  fiscal_id: string;
  date_of_birth: string;
  place_of_birth: string;
  gender: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  accept_terms: boolean;
  accept_privacy_policy: boolean;
  subscribe_to_newsletter: boolean;
}

export interface UserLicense {
  license_number: string;
  license_issue_date: string;
  license_expiry_date: string;
  license_category: string;
}

export interface UserAddress {
  street: string;
  civic_number: string;
  cap: string;
  city: string;
  province: string;
  type: "domicile" | "residence";
}
export interface DropdownOptions {
  value: string;
  name: string;
}
