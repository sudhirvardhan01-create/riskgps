export interface UserData {
  userId: string;
  userCode: string;
  name: string;
  email: string;
  phone: string;
  communicationPreference: string;
  company: string;
  organization: string;
  organizationId?: string;
  role: string;
  roleId?: string;
  isTermsAndConditionsAccepted: boolean;
  isActive: boolean;
  createdDate: Date;
  modifiedDate: Date;
  createdBy?: string | null;
  modifiedBy?: string | null;
  isDeleted?: boolean;
}

export interface UserFormData {
  name: string;
  email: string;
  phone: string;
  communicationPreference: string;
  company: string;
  role: string;
  organization: string;
  isTermsAndConditionsAccepted: boolean;
  isActive: boolean;
  password: string;
  confirmPassword: string;
}

export interface UserEditFormData {
  userId: string;
  name: string;
  email: string;
  phone: string;
  communicationPreference: string;
  company: string;
  role: string | null;
  organization: string | null;
}
