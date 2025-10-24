import { Taxonomy } from "@/types/assessment";

interface AssessmentData {
  assessmentName: string;
  assessmentDesc: string;
  orgId?: string;
  orgName?: string;
  orgDesc?: string;
  businessUnitId?: string;
  businessUnitName?: string;
  businessUnitDesc?: string;
  runId: string;
  userId: string;
}

interface AssessmentProcess {
  id: string;
  processes: Process[];
  status: string;
  userId: string;
}

interface Process {
  processName: string;
  order: number | undefined;
}

interface AssessmentRisk {
  assessmentId: string;
  userId: string;
  riskScenarios: RiskScenarios[];
}

interface RiskScenarios {
  assessmentProcessId: string;
  riskScenarioName: string;
  riskScenarioDesc: string;
  thresholdHours?: number;
  thresholdCost?: number;
  taxonomy?: Taxonomy[];
}

export const saveAssessment = async (data: AssessmentData) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assessment`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch api data");
  }
  return response.json();
};

export const getAssessment = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assessment`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch api data");
  }
  return response.json();
};

export const getAssessmentById = async (assessmentId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assessment/${assessmentId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch api data");
  }
  return response.json();
};

export const saveAssessmentProcess = async (data: AssessmentProcess) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assessment/${data.id}/save_processes`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch api data");
  }
  return response.json();
};

export const saveAssessmentRisk = async (data: AssessmentRisk) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assessment/assessment-process-risk-scenarios`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch api data");
  }
  return response.json();
};

export const saveAssessmentRiskTaxonomy = async (data: AssessmentRisk) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assessment/assessment-risk-details`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch api data");
  }
  return response.json();
};

export const saveAssessmentAssets = async (data: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assessment/assessment-process-assets`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch api data");
  }
  return response.json();
};

export const getAssetQuestionnaire = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/questionnaire`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch login data");
  }
  return response.json();
};
