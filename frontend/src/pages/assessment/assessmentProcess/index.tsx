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
  saveAssetQuestionnaire,
} from "@/pages/api/assessment";
import ProcessTabs from "@/components/Assessment/ProcessTabs";
import { BusinessUnit, Organisation, ProcessUnit } from "@/types/assessment";
import Cookies from "js-cookie";
import withAuth from "@/hoc/withAuth";
import DragDropAssets from "@/components/Assessment/DragDropAssets";
import ProcessTabsAssets from "@/components/Assessment/ProcessTabsAssets";
import AssessmentPreview from "@/components/Assessment/AssessmentPreview";

function BUProcessMappingPage() {
  const { assessment, updateAssessment } = useAssessment();
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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        setLoading(true);
        const res = await getOrganization();
        setOrganisations(res.data.organizations);

        const response = await getOrganizationProcess(
          assessment?.orgId,
          assessment?.businessUnitId
        );
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

  // Update businessUnits whenever assessment?.orgId changes
  useEffect(() => {
    if (!assessment?.orgId) {
      setBusinessUnits([]);
      return;
    }

    const org = organisations.find(
      (o) => o.organizationId === assessment?.orgId
    );
    setBusinessUnits(org?.businessUnits || []);
  }, [assessment?.orgId, organisations]);

  const prepareRiskPayload = () => {
    const obj = assessment?.processes.flatMap((process) =>
      process.risks.map((risk) => ({
        assessmentProcessId: process.assessmentProcessId ?? "",
        assessmentProcessRiskId: risk.assessmentProcessRiskId,
        id: risk.id,
        riskScenario: risk.riskScenario,
        riskDescription: risk.riskDescription,
      }))
    );
    return obj;
  };

  const prepareRiskTaxonomyPayload = () => {
    const obj = assessment?.processes.flatMap((process) =>
      process.risks.map((risk) => ({
        assessmentProcessId: process.assessmentProcessId ?? "",
        assessmentProcessRiskId: risk.assessmentProcessRiskId ?? "",
        id: risk.id,
        riskScenario: risk.riskScenario,
        riskDescription: risk.riskDescription,
        taxonomy: risk.taxonomy,
      }))
    );
    return obj;
  };

  const prepareAssetPayload = () => {
    const obj = assessment?.processes.flatMap((process) =>
      process.assets.map((asset) => ({
        assessmentProcessId: process.assessmentProcessId,
        assessmentProcessAssetId: asset.assessmentProcessAssetId,
        id: asset.id,
        applicationName: asset.applicationName,
        assetCategory: asset.assetCategory,
      }))
    );
    return obj;
  };

  const prepareQuestionnairePayload = () => {
    const obj = assessment?.processes.flatMap((process) =>
      process.assets.flatMap((asset) =>
        asset.questionnaire.map((question) => ({
          assessmentProcessId: process.assessmentProcessId ?? "",
          assessmentProcessAssetId: asset.assessmentProcessAssetId ?? "",
          id: asset.id,
          questionnaireId: question.questionnaireId,
          question: question.question,
          responseValue: question.responseValue,
        }))
      )
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
            id: assessment?.assessmentId,
            processes: assessment?.processes.map((item) => {
              return {
                id: item.id,
                assessmentProcessId: item.assessmentProcessId,
                processName: item.processName,
                processDescription: item.processDescription,
                order: item.order,
              };
            }),
            status: status,
            userId: JSON.parse(Cookies.get("user") ?? "")?.id,
          });

          const updatedProcesses = assessment?.processes.map((item) => {
            const match = res.processes.find((obj: any) => obj.id === item.id);
            return {
              ...item,
              assessmentProcessId: match?.assessmentProcessId ?? null, // add safely
            };
          });

          updateAssessment({ processes: updatedProcesses });
          break;

        case 1:
          const riskScenarios = prepareRiskPayload();
          const response = await saveAssessmentRisk({
            assessmentId: assessment?.assessmentId,
            status: "in_progress",
            userId: JSON.parse(Cookies.get("user") ?? "")?.id,
            riskScenarios,
          });

          const updatedProcessesRisk = assessment?.processes.map((process) => ({
            ...process,
            risks: process.risks.map((risk) => {
              const match = response.riskScenarios.find(
                (obj: any) => obj.id === risk.id
              );

              return {
                ...risk,
                assessmentProcessRiskId: match?.assessmentProcessRiskId ?? null,
              };
            }),
          }));

          updateAssessment({ processes: updatedProcessesRisk });
          break;

        case 2:
          const riskTaxonomies = prepareRiskTaxonomyPayload();
          const resp = await saveAssessmentRiskTaxonomy({
            assessmentId: assessment?.assessmentId,
            status: "in_progress",
            userId: JSON.parse(Cookies.get("user") ?? "")?.id,
            riskScenarios: riskTaxonomies,
          });

          const updatedProcessesRiskTaxonomy = assessment?.processes.map(
            (process) => ({
              ...process,
              risks: process.risks.map((risk) => ({
                ...risk,
                taxonomy: risk.taxonomy?.map((tax) => {
                  // Find a matching question entry from resultQues.questionnaire
                  const match = resp.taxonomies.find(
                    (obj: any) => obj.taxonomyId === tax.taxonomyId
                  );

                  // Return updated question
                  return {
                    ...tax,
                    assessmentRiskTaxonomyId: match?.assessmentRiskTaxonomyId,
                  };
                }),
              })),
            })
          );

          updateAssessment({ processes: updatedProcessesRiskTaxonomy });
          break;

        case 3:
          const assets = prepareAssetPayload();
          const result = await saveAssessmentAssets({
            assessmentId: assessment?.assessmentId,
            status: "in_progress",
            userId: JSON.parse(Cookies.get("user") ?? "")?.id,
            assets,
          });

          const updatedProcessesAsset = assessment?.processes.map(
            (process) => ({
              ...process,
              assets: process.assets.map((asset) => {
                const match = result.assets.find(
                  (obj: any) => obj.id === asset.id
                );

                return {
                  ...asset,
                  assessmentProcessAssetId:
                    match?.assessmentProcessAssetId ?? null,
                };
              }),
            })
          );

          updateAssessment({ processes: updatedProcessesAsset });
          break;

        case 4:
          const questionnaires = prepareQuestionnairePayload();
          const resultQues = await saveAssetQuestionnaire({
            assessmentId: assessment?.assessmentId,
            status: "in_progress",
            userId: JSON.parse(Cookies.get("user") ?? "")?.id,
            questionaires: questionnaires,
          });

          const updatedProcessesAssetQuestionnaire = assessment?.processes.map(
            (process) => ({
              ...process,
              assets: process.assets.map((asset) => ({
                ...asset,
                questionnaire: asset.questionnaire.map((question) => {
                  // Find a matching question entry from resultQues.questionnaire
                  const match = resultQues.data.questionnaire.find(
                    (obj: any) =>
                      obj.questionnaireId === question.questionnaireId
                  );

                  // Return updated question
                  return {
                    ...question,
                    assessmentQuestionaireId:
                      match?.assessmentQuestionaireId ?? null,
                    responseValue:
                      match?.responseValue ?? question.responseValue ?? null,
                  };
                }),
              })),
            })
          );

          updateAssessment({ processes: updatedProcessesAssetQuestionnaire });
          setOpen(true);
          break;
      }

      if (activeStep < 4) {
        setActiveStep((prev) => prev + 1);
        setActiveTab(0);
      }
    }
  };

  const getEnableCondition = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return assessment?.processes && assessment?.processes.length > 0;
      case 1:
        return assessment?.processes.some((item) => item.risks.length > 0);
      case 2:
        return assessment?.processes.some(
          (item) =>
            item.risks.length > 0 &&
            item.risks.some((risk) => risk.taxonomy?.length > 0)
        );
      case 3:
        return assessment?.processes.some((item) => item.assets.length > 0);
      case 4:
        return assessment?.processes.some(
          (item) =>
            item.assets.length > 0 &&
            item.assets.some((asset) => asset.questionnaire?.length > 0)
        );
    }
    return true;
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Box>
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
              title={assessment?.assessmentName}
              runId={assessment?.runId}
              org={
                organisations.find(
                  (item) => item.organizationId === assessment?.orgId
                )?.name || ""
              }
              bu={
                businessUnits.find(
                  (item) =>
                    item.orgBusinessUnitId === assessment?.businessUnitId
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
                  selected={assessment?.processes || []}
                />
              )}

              {activeStep === 0 && activeTab === 1 && (
                <AssignOrder processes={assessment?.processes || []} />
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
            disableButton={!getEnableCondition(activeStep)}
          />
        </Box>
      )}

      <AssessmentPreview
        open={open}
        onClose={handleClose}
        onSubmit={() => {
          router.push("/assessment");
        }}
      />
    </>
  );
}

export default withAuth(BUProcessMappingPage);
