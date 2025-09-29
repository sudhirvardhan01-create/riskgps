export interface Assessment {
  assessmentId: string;
  assessmentName: string;
  assessmentDesc: string;
  runId: string;
  orgId: string;
  orgName: string;
  orgDesc?: string;
  businessUnitId: string;
  businessUnitName: string;
  businessUnitDesc?: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
  lastActivity: Date;
}

export interface Organisation {
  organizationId: string;
  name: string;
  desc?: string;
  businessUnits: BusinessUnit[];
}

export interface BusinessUnit {
  orgBusinessUnitId: string;
  businessUnitName: string;
  businessUnitDesc?: string;
}

export interface Severity {
  severityId: string;
  name: string;
  minRange: string;
  maxRange: string;
  color: string;
}

export interface Taxonomy {
  [key: string]: string;
}

export interface Risk {
  orgRiskId: string;
  name: string;
  description: string;
  thresholdHours?: number;
  thresholdCost?: number;
  taxonomy?: Taxonomy[];
}

export interface ProcessUnit {
  assessmentProcessId: string;
  orgProcessId: string;
  name: string;
  order?: number;
  risks: Risk[];
}
