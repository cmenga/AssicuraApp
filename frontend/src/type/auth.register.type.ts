
export interface RegisterDTO {
  first_name: string;
  last_name: string;
  fiscal_id: string;
  date_of_birth: string;
  place_of_birth: string;
  gender: string;
  email: string;
  phone_number: string;
  street: string;
  civic_number: string;
  cap: string;
  city: string;
  province: string;
  license_number: string;
  license_issue_date: string;
  license_expiry_date: string;
  license_category: string;
  password: string,
  confirm_password: string,
  accept_terms: boolean,
  accept_privacy_policy: boolean,
  subscribe_to_newsletter: boolean,
}


export interface DropdownOptions {
  value: string;
  name: string;
};



