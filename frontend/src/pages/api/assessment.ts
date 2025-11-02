import { Taxonomy } from "@/types/assessment";

interface AssessmentData {
  assessmentId?: string | undefined;
  assessmentName: string | undefined;
  assessmentDesc: string | undefined;
  orgId?: string | undefined;
  orgName?: string | undefined;
  orgDesc?: string | undefined;
  businessUnitId?: string | undefined;
  businessUnitName?: string | undefined;
  businessUnitDesc?: string | undefined;
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
  order: number | undefined;
}

interface AssessmentRisk {
  assessmentId: string | undefined;
  status: string;
  userId: string;
  riskScenarios: RiskScenarios[] | undefined;
}

interface RiskScenarios {
  assessmentProcessId: string;
  id: string;
  riskScenario: string;
  riskDescription: string;
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

export const saveAssetQuestionnaire = async (data: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assessment/assessment-questionaire`,
    {
      method: "POST",
      body: JSON.stringify(data),
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
