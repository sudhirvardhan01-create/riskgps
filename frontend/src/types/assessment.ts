export interface Assessment {
  assessmentId: string;
  assessmentName: string;
  assessmentDesc: string;
  runId: string;
  orgId: string;
  orgName: string;
  orgDesc: string | null;
  businessUnitId: string;
  businessUnitName: string;
  businessUnitDesc: string | null;
  status: string;
  progress: number;
  startDate: string;
  endDate: string | null;
  lastActivity: string | null;
  createdBy: string;
  modifiedBy: string;
  createdDate: string;
  modifiedDate: string;
  isDeleted: boolean;
  organizationId: string | null;
}

export interface Organisation {
  organizationId: string;
  name: string;
  desc?: string;
  businessUnits: BusinessUnit[];
}

export interface BusinessUnit {
  orgBusinessUnitId: string;
  name: string;
  desc?: string;
}

export interface Severity {
  severityId: string;
  name: string;
  minRange: string;
  maxRange: string;
  color: string;
}

export interface Taxonomy {
  taxonomyId: string;
  name: string;
  orgId: string;
  severityDetails: Severity;
}

export interface Risk {
  id: string;
  assessmentProcessRiskId?: string;
  riskScenario: string;
  riskDescription: string;
  taxonomy?: Taxonomy[];
}

export interface Asset {
  id: string;
  assessmentProcessAssetId?: string;
  applicationName: string;
  assetCategory: string;
  questionnaire: Questionnaire[];
}

export interface Questionnaire {
  assessmentQuestionaireId?: string;
  questionaireId: string;
  questionaireName: string;
  responseValue: string;
}

export interface ProcessUnit {
  assessmentProcessId: string;
  id: string;
  processName: string;
  processDescription: string;
  order?: number;
  risks: Risk[];
  assets: Asset[];
}
