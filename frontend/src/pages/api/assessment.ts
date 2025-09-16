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
  order: number;
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
