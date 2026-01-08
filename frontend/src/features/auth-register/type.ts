
export interface PersonalDataModel {
  firstName: string;
  lastName: string;
  fiscalId: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: string;
}

export interface ContactModel {
  email: string;
  phoneNumber: string;
}

export interface ResidenceModel {
  street: string;
  civicNumber: string;
  cap: string;
  city: string;
  province: string;
}

export interface LicenseModel {
  licenseNumber: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  licenseCategory: string;
}

export interface AccountModel {
  password: string,
  confirmPassword: string,
  acceptTerms: boolean,
  acceptPrivacyPolicy: boolean,
  subscribeToNewsletter: boolean,
}

export type RegisterFormModel = PersonalDataModel & ContactModel & ResidenceModel & LicenseModel & AccountModel;