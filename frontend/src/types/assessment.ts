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

export interface Taxonomy {}

export interface Risk {
  orgRiskId: string;
  name: string;
  description: string;
  thresholdHours?: number;
  thresholdCost?: number;
  taxonomy?: Taxonomy[];
  financial?: string;
  regulatory?: string;
  reputational?: string;
  operational?: string;
}

export interface ProcessUnit {
  assessmentProcessId: string;
  orgProcessId: string;
  name: string;
  order?: number;
  risks: Risk[];
}
