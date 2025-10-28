export interface UserData {
  userId?: string;
  userCode?: string;
  name: string;
  email: string;
  phone: string;
  communicationPreference: string;
  password?: string;
  company: string;
  organization?: string;
  role: string;
  isTermsAndConditionsAccepted?: boolean;
  isActive?: boolean;
  createdDate?: Date;
  modifiedDate?: Date;
  createdBy?: string | null;
  modifiedBy?: string | null;
  isDeleted?: boolean;
}
