import apiClient from "@/utils/apiClient";
import { Taxonomy } from "@/types/assessment";

interface AssessmentData {
  assessmentId?: string;
  assessmentName: string | undefined;
  assessmentDesc: string | undefined;
  orgId?: string;
  orgName?: string;
  orgDesc?: string | null;
  businessUnitId?: string;
  businessUnitName?: string;
  businessUnitDesc?: string | null;
  status?: string;
  userId: string | undefined;
}

interface AssessmentProcess {
  id: string | undefined;
  processes: Process[] | undefined;
  status: string;
  userId: string;
}

interface Process {
  id: string;
  processName: string;
  processDescription: string;
  order?: number;
}

interface AssessmentRisk {
  assessmentId?: string;
  status: string;
  userId: string;
  riskScenarios?: RiskScenarios[];
}

interface RiskScenarios {
  assessmentProcessId: string;
  id: string;
  riskScenario: string;
  riskDescription: string;
  taxonomy?: Taxonomy[];
}

/**
 * Save Assessment
 */
export const saveAssessment = async (data: AssessmentData) => {
  const res = await apiClient.post("/assessment", data);
  return res.data;
};

/**
 * Get all Assessments
 */
export const getAssessment = async () => {
  const res = await apiClient.get("/assessment");
  return res.data;
};

/**
 * Get Assessment by ID
 */
export const getAssessmentById = async (assessmentId: string) => {
  const res = await apiClient.get(`/assessment/${assessmentId}`);
  return res.data;
};

/**
 * Save Processes under Assessment
 */
export const saveAssessmentProcess = async (data: AssessmentProcess) => {
  const res = await apiClient.post(
    `/assessment/${data.id}/save_processes`,
    data
  );
  return res.data;
};

/**
 * Save Risk Scenarios
 */
export const saveAssessmentRisk = async (data: AssessmentRisk) => {
  const res = await apiClient.post(
    `/assessment/assessment-process-risk-scenarios`,
    data
  );
  return res.data;
};

/**
 * Save Risk Taxonomy
 */
export const saveAssessmentRiskTaxonomy = async (data: AssessmentRisk) => {
  const res = await apiClient.post(`/assessment/assessment-risk-details`, data);
  return res.data;
};

/**
 * Save Assets under Assessment
 */
export const saveAssessmentAssets = async (data: any) => {
  const res = await apiClient.post(
    `/assessment/assessment-process-assets`,
    data
  );
  return res.data;
};

/**
 * Get Asset Questionnaires
 */
export const getAssetQuestionnaire = async () => {
  const res = await apiClient.get(`/library/questionnaire?limit=-1`);
  return res.data;
};

/**
 * Save Asset Questionnaire
 */
export const saveAssetQuestionnaire = async (data: any) => {
  const res = await apiClient.post(`/assessment/assessment-questionaire`, data);
  return res.data;
};

/**
 * Delete Assessment
 */
export const deleteAssessment = async (
  id: string | undefined,
  userId: string
) => {
  const res = await apiClient.delete(`/assessment/${id}?userId=${userId}`);
  return res.data;
};
