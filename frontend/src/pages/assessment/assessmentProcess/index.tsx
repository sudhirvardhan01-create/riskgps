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
import {
  getOrganization,
  getOrganizationProcess,
} from "../../api/organization";
import { saveAssessment, saveAssessmentProcess } from "@/pages/api/assessment";

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
  orgProcessId: string;
  name: string;
}

export default function BUProcessMappingPage() {
  const {
    assessmentId,
    assessmentName,
    selectedOrg,
    selectedBU,
    selectedProcesses,
    setSelectedProcesses,
    orderedProcesses,
    setOrderedProcesses,
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
  const [activeTab, setActiveTab] = useState(0); // inner tab (StepIndicator)
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [processes, setProcesses] = useState<ProcessUnit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        setLoading(true);
        const res = await getOrganization();
        setOrganisations(res.data.organizations);

        const response = await getOrganizationProcess(selectedOrg, selectedBU);
        setProcesses(response.data);
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

    const org = organisations.find((o) => o.organizationId === selectedOrg);
    setBusinessUnits(org?.businessUnits || []);
  }, [selectedOrg, organisations]);

  // Navigation
  const handlePrev = () => {
    if (activeTab > 0) {
      setActiveTab((prev) => prev - 1);
    } else if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
      setActiveTab(0);
    }
  };

  const handleSaveContinue = (status: string) => {
    if (activeTab < stepsTab.length - 1) {
      setActiveTab((prev) => prev + 1);
    } else {
      setActiveStep((prev) => prev + 1);
      setActiveTab(0);
      saveAssessmentProcess({
        id: assessmentId,
        processes: selectedProcesses.map((item) => {
          return {
            processName: item.name,
            order: orderedProcesses[item.orgProcessId],
          };
        }),
        status: status,
        userId: "2",
      });
    }
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Box sx={{ py: 3, px: 5 }}>
            {/* Top Navigation Bar */}
            <TopBar
              title={assessmentName}
              runId="1004"
              org={
                organisations.find(
                  (item) => item.organizationId === selectedOrg
                )?.name || ""
              }
              bu={
                businessUnits.find(
                  (item) => item.orgBusinessUnitId === selectedBU
                )?.businessUnitName || ""
              }
              onBack={() => router.push("/assessment")}
            />

            {/* Stepper */}
            <Box mt={3}>
              <ArrowStepper steps={steps} activeStep={activeStep} />
            </Box>

            {activeStep === 0 && (
              <Box mt={4}>
                <StepIndicator steps={stepsTab} activeStep={activeTab} />
              </Box>
            )}

            {/* Content Area */}
            <Box my={4}>
              {activeStep === 0 && activeTab === 0 && (
                <SectionProcesses
                  processes={processes}
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

              {activeStep === 1 && <DragDropRiskScenarios />}
            </Box>
          </Box>

          {/* Bottom Action Bar */}
          <BottomActionBar
            onPrev={handlePrev}
            onCancel={() => router.push("/assessment")}
            onSaveDraft={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSaveContinue("draft")
            }}
            onSaveContinue={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSaveContinue("in_progress")
            }}
          />
        </>
      )}
    </>
  );
}
