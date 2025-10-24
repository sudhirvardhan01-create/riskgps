export interface UserData {
  userId?: string;
  userCode?: string;
  userImage?: string;
  name: string;
  email: string;
  phone: string;
  communicationPreference: string;
  password?: string;
  company: string;
  organisation: string;
  businessUnit: string;
  userType: string;
  isTermsAndConditionsAccepted?: boolean;
  status: string;
  createdDate?: Date;
  modifiedDate?: Date;
  createdBy?: string | null;
  modifiedBy?: string | null;
  isDeleted?: boolean;
  lastLoginDate?: Date;
  passwordLastChanged?: Date;
}
