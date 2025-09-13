// pages/bu-process-mapping.tsx
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import TopBar from "@/components/Assessment/TopBar";
import ArrowStepper from "@/components/Assessment/ArrowStepper";
import SectionProcesses from "@/components/Assessment/SectionProcesses";
import BottomActionBar from "@/components/Assessment/BottomActionBar";
import StepIndicator from "@/components/Assessment/StepIndicator";
import AssignOrder from "@/components/Assessment/AssignOrder";
import { useAssessment } from "@/context/AssessmentContext";
import { useRouter } from "next/router";
import DragDropRiskScenarios from "@/components/Assessment/DragDropRiskScenarios";
import { getOrganization } from "../../api/organization";

interface Organisation {
  organizationId: string;
  name: string;
  businessUnits: BusinessUnit[];
}

interface BusinessUnit {
  orgBusinessUnitId: string;
  businessUnitName: string;
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
    setOrderedProcesses
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
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
    const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
    const [loading, setLoading] = useState(false);

   useEffect(() => {
      const fetchOrgs = async () => {
        try {
          setLoading(true);
          const res = await getOrganization();
          setOrganisations(res.data.organizations);
        } catch (error) {
          console.error("Error fetching organisations:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchOrgs();
    }, []);
  
    // Update businessUnits whenever selectedOrg changes
    useEffect(() => {
      if (!selectedOrg) {
        setBusinessUnits([]);
        return;
      }
  
      const org = organisations.find(
        (o) => o.organizationId === selectedOrg
      );
      setBusinessUnits(org?.businessUnits || []);
    }, [selectedOrg, organisations]);

  const processes: ProcessUnit[] = [
    { id: "process1", name: "Electronic Banking", buId: "bu3" },
    { id: "process2", name: "ACH", buId: "bu3" },
    { id: "process3", name: "Wire Transfer", buId: "bu3" },
    { id: "process4", name: "ATM Management", buId: "bu3" },
    { id: "process5", name: "Fraud Monitoring", buId: "bu3" },
    { id: "process6", name: "KYC", buId: "bu4" },
    { id: "process7", name: "Loan Organisations", buId: "bu4" },
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
          runId="1004"
                  org={organisations.find((item) => item.organizationId === selectedOrg)?.name || ""}
                  bu={businessUnits.find((item) => item.orgBusinessUnitId === selectedBU)?.businessUnitName || ""}
          onBack={() => router.push("/assessment")}
        />

        {/* Stepper */}
        <Box mt={3}>
          <ArrowStepper steps={steps} activeStep={activeStep} />
        </Box>

        {activeStep === 0 && <Box mt={4}>
          <StepIndicator steps={stepsTab} activeStep={activeTab} />
        </Box>}

        {/* Content Area */}
        <Box my={4}>
          {activeStep === 0 && activeTab === 0 && (
            <SectionProcesses
              processes={processes.filter((item) => item.buId === selectedBU)}
              selected={selectedProcesses}
              onSelectionChange={setSelectedProcesses}
            />
          )}

          {activeStep === 0 && activeTab === 1 && (
            <AssignOrder
              processes={selectedProcesses}
              onOrderChange={setOrderedProcesses}
            />
          )}

          {activeStep === 1 && (
            <DragDropRiskScenarios />
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
