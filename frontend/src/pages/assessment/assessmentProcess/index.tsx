// pages/bu-process-mapping.tsx
import { useState } from "react";
import { Box } from "@mui/material";
import TopBar from "@/components/Assessment/TopBar";
import ArrowStepper from "@/components/Assessment/ArrowStepper";
import SectionProcesses from "@/components/Assessment/SectionProcesses";
import BottomActionBar from "@/components/Assessment/BottomActionBar";
import StepIndicator from "@/components/Assessment/StepIndicator";
import AssignOrder from "@/components/Assessment/AssignOrder";
import { useAssessment } from "@/context/AssessmentContext";
import { useRouter } from "next/router";

interface Organisation {
  id: string;
  name: string;
}

interface BusinessUnit {
  id: string;
  name: string;
  orgId: string;
}

interface ProcessUnit {
  id: string;
  name: string;
  buId: string;
}

export default function BUProcessMappingPage() {
  const {
  assessmentName,
  selectedOrg,
  selectedBU,
  selectedProcesses,
  setSelectedProcesses,
  orderedProcesses,
  setOrderedProcesses,
  submitAssessment,
} = useAssessment();
  const router = useRouter();

  // Stepper State
  const steps = [
    "BU to Process Mapping",
    "Process to Risk Scenarios Mapping",
    "Business Impact",
  ];

  const stepsTab = [
    {
      title: "Select Processes",
      subtitle: "Select business processes for this BU",
    },
    {
      title: "Assign Order",
      subtitle: "Select the order of processes mapped to this BU",
    },
  ];

  const [activeStep, setActiveStep] = useState(0); // main stepper (ArrowStepper)
  const [activeTab, setActiveTab] = useState(0);   // inner tab (StepIndicator)

  const organisations: Organisation[] = [
    { id: "org1", name: "Blue Ocean" },
    { id: "org2", name: "Deloitte" },
  ];

  const businessUnits: BusinessUnit[] = [
    { id: "bu1", name: "Retail Banking", orgId: "org1" },
    { id: "bu2", name: "Loan Services", orgId: "org1" },
    { id: "bu3", name: "IT", orgId: "org2" },
    { id: "bu4", name: "Marketing", orgId: "org2" },
  ];

  const processes: ProcessUnit[] = [
    { id: "process1", name: "Electronic Banking", buId: "bu1" },
    { id: "process2", name: "ACH", buId: "bu1" },
    { id: "process3", name: "Wire Transfer", buId: "bu1" },
    { id: "process4", name: "ATM Management", buId: "bu1" },
    { id: "process5", name: "KYC", buId: "bu2" },
  ];

  // Navigation
  const handlePrev = () => {
    if (activeTab > 0) {
      setActiveTab((prev) => prev - 1);
    } else if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
      setActiveTab(0);
    }
  };

  const handleSaveContinue = () => {
    if (activeTab < stepsTab.length - 1) {
      setActiveTab((prev) => prev + 1);
    } else {
      // reached end of this module, go to next ArrowStepper step
      setActiveStep((prev) => prev + 1);
      setActiveTab(0);
    }
  };

  return (
    <>
      <Box sx={{ py: 3, px: 5 }}>
        {/* Top Navigation Bar */}
        <TopBar
          title={assessmentName}
          runId="2249"
          org={organisations.find((item) => item.id === selectedOrg)?.name}
          bu={businessUnits.find((item) => item.id === selectedBU)?.name}
          onBack={() => router.push("/assessment")}
        />

        {/* Stepper */}
        <Box mt={3}>
          <ArrowStepper steps={steps} activeStep={activeStep} />
        </Box>

        <Box mt={4}>
          <StepIndicator steps={stepsTab} activeStep={activeTab} />
        </Box>

        {/* Content Area */}
        <Box my={4}>
          {activeTab === 0 && (
            <SectionProcesses
              processes={processes.filter((item) => item.buId === selectedBU)}
              selected={selectedProcesses}
              onSelectionChange={setSelectedProcesses}
            />
          )}

          {activeTab === 1 && (
            <AssignOrder
              processes={selectedProcesses}
              onOrderChange={setOrderedProcesses}
            />
          )}
        </Box>
      </Box>

      {/* Bottom Action Bar */}
      <BottomActionBar
        onPrev={handlePrev}
        onCancel={() => router.push("/assessment")}
        onSaveDraft={() => console.log("Save Draft clicked")}
        onSaveContinue={handleSaveContinue}
      />
    </>
  );
}
