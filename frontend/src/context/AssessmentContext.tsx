"use client";

import React, { createContext, useContext, useState } from "react";

interface ProcessUnit {
  orgProcessId: string;
  name: string;
}

interface AssessmentContextType {
  assessmentId: string;
  setAssessmentId: (name: string) => void;
  assessmentName: string;
  setAssessmentName: (name: string) => void;
  assessmentDescription: string;
  setAssessmentDescription: (desc: string) => void;
  selectedOrg: string;
  setSelectedOrg: (org: string) => void;
  selectedBU: string;
  setSelectedBU: (bu: string) => void;
  selectedProcesses: ProcessUnit[];
  setSelectedProcesses: (processes: ProcessUnit[]) => void;
  orderedProcesses: { [key: string]: number };
  setOrderedProcesses: (order: { [key: string]: number }) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(
  undefined
);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [assessmentId, setAssessmentId] = useState("");
  const [assessmentName, setAssessmentName] = useState("");
  const [assessmentDescription, setAssessmentDescription] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedBU, setSelectedBU] = useState("");
  const [selectedProcesses, setSelectedProcesses] = useState<ProcessUnit[]>([]);
  const [orderedProcesses, setOrderedProcesses] = useState<{
    [key: string]: number;
  }>({});

  return (
    <AssessmentContext.Provider
      value={{
        assessmentId,
        setAssessmentId,
        assessmentName,
        setAssessmentName,
        assessmentDescription,
        setAssessmentDescription,
        selectedOrg,
        setSelectedOrg,
        selectedBU,
        setSelectedBU,
        selectedProcesses,
        setSelectedProcesses,
        orderedProcesses,
        setOrderedProcesses,
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
