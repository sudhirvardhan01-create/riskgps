"use client";

import React, { createContext, useContext, useState } from "react";
import { ProcessUnit } from "@/types/assessment";

// ✅ Define Assessment Type (based on your API structure)
interface Assessment {
  assessmentId: string;
  assessmentName: string;
  assessmentDesc: string;
  runId?: string;
  orgId?: string;
  orgName?: string;
  orgDesc?: string;
  businessUnitId?: string;
  businessUnitName?: string;
  businessUnitDesc?: string;
  status?: string;
  startDate?: string | null;
  endDate?: string | null;
  lastActivity?: string | null;
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: string;
  modifiedDate?: string;
  isDeleted?: boolean;
  processes: ProcessUnit[];
}

interface AssessmentContextType {
  assessment: Assessment | null;
  setAssessment: (assessment: Assessment) => void;
  updateAssessment: (updates: Partial<Assessment>) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(
  undefined
);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [assessment, setAssessment] = useState<Assessment | null>(null);

  // ✅ Handy function to update parts of assessment without overwriting whole object
  const updateAssessment = (updates: Partial<Assessment>) => {
    setAssessment((prev) =>
      prev ? { ...prev, ...updates } : (updates as Assessment)
    );
  };

  return (
    <AssessmentContext.Provider
      value={{
        assessment,
        setAssessment,
        updateAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
};
