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
import {
  saveAssessmentAssets,
  saveAssessmentProcess,
  saveAssessmentRisk,
  saveAssessmentRiskTaxonomy,
} from "@/pages/api/assessment";
import ProcessTabs from "@/components/Assessment/ProcessTabs";
import {
  Assessment,
  BusinessUnit,
  Organisation,
  ProcessUnit,
} from "@/types/assessment";
import Cookies from "js-cookie";
import withAuth from "@/hoc/withAuth";
import DragDropAssets from "@/components/Assessment/DragDropAssets";
import ProcessTabsAssets from "@/components/Assessment/ProcessTabsAssets";

function BUProcessMappingPage() {
  const {
    assessmentId,
    assessmentName,
    selectedOrg,
    selectedBU,
    selectedProcesses,
    setSelectedProcesses,
  } = useAssessment();
  const router = useRouter();

  // Stepper State
  const steps = [
    "BU to Process Mapping",
    "Process to Risk Scenarios Mapping",
    "Business Impact",
    "Process to Asset Mapping",
    "Critical Systems Control Strength",
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
        response.data.forEach((item: any) => {
          item["risks"] = [];
          item["assets"] = [];
        });
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

  const prepareRiskPayload = () => {
    const obj = selectedProcesses.flatMap((process) =>
      process.risks.map((risk) => ({
        assessmentProcessId: process.assessmentProcessId ?? "",
        riskScenarioName: risk.name,
        riskScenarioDesc: risk.description,
      }))
    );
    return obj;
  };

  const prepareRiskTaxonomyPayload = () => {
    const obj = selectedProcesses.flatMap((process) =>
      process.risks.map((risk) => ({
        assessmentProcessId: process.assessmentProcessId ?? "",
        assessmentProcessRiskId: risk.assessmentProcessRiskId ?? "",
        riskScenarioName: risk.name,
        riskScenarioDesc: risk.description,
        thresholdHours: risk.thresholdHours,
        thresholdCost: risk.thresholdCost,
        taxonomy: risk.taxonomy,
      }))
    );
    return obj;
  };

  const prepareAssetPayload = () => {
    const obj = selectedProcesses.flatMap((process) =>
      process.assets.map((asset) => ({
        assessmentProcessId: process.assessmentProcessId,
        assetName: asset.name,
        assetDesc: asset.description,
        assetCategory: asset.assetCategory,
      }))
    );
    return obj;
  };

  // Navigation
  const handlePrev = () => {
    if (activeTab > 0) {
      setActiveTab((prev) => prev - 1);
    } else if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
      setActiveTab(0);
    }
  };

  const handleSaveContinue = async (status: string) => {
    if (activeStep == 0 && activeTab < stepsTab.length - 1) {
      setActiveTab((prev) => prev + 1);
    } else {
      switch (activeStep) {
        case 0:
          const res = await saveAssessmentProcess({
            id: assessmentId,
            processes: selectedProcesses.map((item) => {
              return {
                processName: item.name,
                order: item.order,
              };
            }),
            status: status,
            userId: JSON.parse(Cookies.get("user") ?? "")?.id,
          });

          const updatedProcesses = selectedProcesses.map((item) => {
            const match = res.processes.find(
              (obj: any) => obj.processName === item.name
            );
            return {
              ...item,
              assessmentProcessId: match?.assessmentProcessId ?? null, // add safely
            };
          });

          setSelectedProcesses(updatedProcesses);
          break;

        case 1:
          const riskScenarios = prepareRiskPayload();
          const response = await saveAssessmentRisk({
            assessmentId,
            userId: JSON.parse(Cookies.get("user") ?? "")?.id,
            riskScenarios,
          });

          const updatedProcessesRisk = selectedProcesses.map((process) => ({
            ...process,
            risks: process.risks.map((risk) => {
              const match = response.riskScenarios.find(
                (obj: any) => obj.riskScenarioName === risk.name
              );

              return {
                ...risk,
                assessmentProcessRiskId: match?.assessmentProcessRiskId ?? null,
              };
            }),
          }));

          setSelectedProcesses(updatedProcessesRisk);
          break;

        case 2:
          const riskTaxonomies = prepareRiskTaxonomyPayload();
          saveAssessmentRiskTaxonomy({
            assessmentId,
            userId: JSON.parse(Cookies.get("user") ?? "")?.id,
            riskScenarios: riskTaxonomies,
          });

          console.log(selectedProcesses);
          break;

        case 3:
          const assets = prepareAssetPayload();
          const result = await saveAssessmentAssets({
            assessmentId,
            userId: JSON.parse(Cookies.get("user") ?? "")?.id,
            assets,
          });

          const updatedProcessesAsset = selectedProcesses.map((process) => ({
            ...process,
            assets: process.assets.map((asset) => {
              const match = result.assets.find(
                (obj: any) => obj.assetName === asset.name
              );

              return {
                ...asset,
                assessmentProcessAssetId:
                  match?.assessmentProcessAssetId ?? null,
              };
            }),
          }));

          setSelectedProcesses(updatedProcessesAsset);
          break;
      }

      setActiveStep((prev) => prev + 1);
      setActiveTab(0);
    }
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Box sx={{ backgroundColor: "#ffffff" }}>
          <Box
            sx={{
              py: 3,
              px: 5,
              overflow: "auto",
              maxHeight: "calc(100vh - 109px)",
            }}
          >
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
                )?.name || ""
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
                  onOrderChange={setSelectedProcesses}
                />
              )}

              {activeStep === 1 && <DragDropRiskScenarios />}
              {activeStep === 2 && <ProcessTabs />}
              {activeStep === 3 && <DragDropAssets />}
              {activeStep === 4 && <ProcessTabsAssets />}
            </Box>
          </Box>

          {/* Bottom Action Bar */}
          <BottomActionBar
            onPrev={handlePrev}
            onCancel={() => router.push("/assessment")}
            onSaveDraft={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSaveContinue("draft");
              router.push("/assessment");
            }}
            onSaveContinue={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSaveContinue("in_progress");
            }}
            activeStep={activeStep}
          />
        </Box>
      )}
    </>
  );
}

export default withAuth(BUProcessMappingPage);
