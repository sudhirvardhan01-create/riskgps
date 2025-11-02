import React, { useEffect, useState } from "react";
import ProcessAssetFlow from "@/components/Reports/ProcessAssetFlow";
import { Box, Button, Stack, Tab, Tabs, Typography } from "@mui/material";
import RiskDashboard from "@/components/Reports/CustomReports";
import { ChartProcess } from "@/types/reports";
import { transformProcessData } from "@/utils/utility";
import { getProcessList } from "../api/reports";
import { getOrganization, getOrganizationAssets } from "../api/organization";
import GenerateReportModal from "@/components/Reports/GenerateReportModal";
import { Assessment, BusinessUnit, Organisation } from "@/types/assessment";
import { getAssessmentsByBusinessUnit } from "@/services/businessUnitService";

function Reports() {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [processData, setProcessData] = useState<ChartProcess[]>([]);
  const [assetData, setAssetData] = useState([]);
  const [open, setOpen] = useState(true);
  const [orgLevel, setOrgLevel] = useState(false);
  const [organisation, setOrganisation] = useState("");
  const [businessUnit, setBusinessUnit] = useState("");
  const [assessment, setAssessment] = useState("");
  const [organisationsList, setOrganisationsList] = useState<Organisation[]>(
    []
  );
  const [businessUnitsList, setBusinessUnitsList] = useState<BusinessUnit[]>(
    []
  );

  const [assessments, setAssessments] = useState<Assessment[]>([]);

  const handleGenerate = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      const processData = await getProcessList();
      const formatted = transformProcessData(processData.data);
      setProcessData(formatted);

      if (organisation !== "") {
        const assetData = await getOrganizationAssets(organisation);
        setAssetData(assetData.data ?? []);
      }
    }
    fetchData();
  }, [organisation, businessUnit, assessment]);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await getOrganization();
        setOrganisationsList(res.data.organizations);
      } catch (error) {
        console.error("Error fetching organisations:", error);
      }
    };

    fetchOrgs();
  }, []);

  useEffect(() => {
    if (!organisation) {
      setBusinessUnitsList([]);
      return;
    }

    const org = organisationsList.find(
      (o) => o.organizationId === organisation
    );
    setBusinessUnitsList(org?.businessUnits || []);
  }, [organisation, organisationsList]);

  useEffect(() => {
    if (!organisation || !businessUnit) {
      setAssessments([]);
      return;
    }

    const getAssessments = async () => {
      const response = await getAssessmentsByBusinessUnit(
        organisation,
        businessUnit
      );
      setAssessments(response.data);
    };
    getAssessments();
  }, [organisation, businessUnit]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <>
      <Box sx={{ m: 5, height: "63vh" }}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
            Reports
          </Typography>
          <Button
            variant="contained"
            size="small"
            sx={{ height: 48 }}
            onClick={() => setOpen(true)}
          >
            <Typography variant="body1" fontWeight={500}>
              Generate Report
            </Typography>
          </Button>
        </Stack>
        <Tabs
          value={currentTab}
          onChange={handleChange}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 550,
              py: 2,
              px: 6,
            },
            "& .MuiTabs-indicator": { display: "none" },
            mx: -5,
          }}
          variant="scrollable"
          scrollButtons
        >
          <Tab
            label={
              <Typography variant="body2" fontWeight={550}>
                Asset View
              </Typography>
            }
            sx={{
              border:
                currentTab == 0 ? "1px solid #E7E7E8" : "1px solid transparent",
              borderRadius: "8px 8px 0px 0px",
              borderBottom:
                currentTab == 0 ? "1px solid transparent" : "1px solid #E7E7E8",
              maxHeight: 48,
            }}
          />
          <Tab
            label={
              <Typography variant="body2" fontWeight={550}>
                Process View
              </Typography>
            }
            sx={{
              border:
                currentTab == 1 ? "1px solid #E7E7E8" : "1px solid transparent",
              borderRadius: "8px 8px 0px 0px",
              borderBottom:
                currentTab == 1 ? "1px solid transparent" : "1px solid #E7E7E8",
              maxHeight: 48,
            }}
          />
        </Tabs>

        {/* Tab Content */}
        {currentTab == 0 && (
          <Box
            sx={{
              display: "flex",
              flex: 1,
              mb: 0,
              maxHeight: 420,
              overflow: "auto",
            }}
          >
            <RiskDashboard assetData={assetData} />
          </Box>
        )}

        {/* Tab Content */}
        {currentTab == 1 && (
          <Box
            sx={{
              display: "flex",
              flex: 1,
              mb: 0,
              maxHeight: 420,
              overflow: "auto",
            }}
          >
            <ProcessAssetFlow processes={processData} />
          </Box>
        )}
      </Box>
      <GenerateReportModal
        open={open}
        organisation={organisation}
        orgLevel={orgLevel}
        businessUnit={businessUnit}
        onClose={() => setOpen(false)}
        onGenerate={handleGenerate}
        onOrganisationChange={setOrganisation}
        onOrgLevelChange={setOrgLevel}
        onBusinessUnitChange={setBusinessUnit}
        organisationsList={organisationsList}
        businessUnitsList={businessUnitsList}
        assessments={assessments}
        assessment={assessment}
        setAssessment={setAssessment}
      />
    </>
  );
}

export default Reports;
