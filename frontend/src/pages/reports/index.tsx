import React from "react";
import TreeChart from "@/components/Reports/TreeChart";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import RiskDashboard from "@/components/Reports/CustomReports";

const processes = [
  {
    assessmentProcessId: "79d4acc2-7548-4739-96e1-e79179aa4649",
    assets: [
      {
        createdBy: null,
        createdDate: "2025-10-10T07:00:25.244Z",
        description:
          "Stores sensitive customer information, including personally identifiable information (PII), contact details, and account relationships.",
        modifiedBy: null,
        modifiedDate: "2025-10-10T07:00:25.244Z",
        name: "Customer Database",
        orgAssetId: "62353e20-b3ac-495e-84b0-98300d6259e9",
        organizationId: "998b826c-3eb5-4eb4-a8c3-4d65c2204e1c",
      },
      {
        createdBy: null,
        createdDate: "2025-10-10T07:00:25.244Z",
        description:
          "Stores sensitive customer information, including personally identifiable information (PII), contact details, and account relationships.",
        modifiedBy: null,
        modifiedDate: "2025-10-10T07:00:25.244Z",
        name: "Customer Database",
        orgAssetId: "62353e20-b3ac-495e-84b0-98300d6259e9",
        organizationId: "998b826c-3eb5-4eb4-a8c3-4d65c2204e1c",
      },
      {
        createdBy: null,
        createdDate: "2025-10-10T07:00:25.244Z",
        description:
          "Stores sensitive customer information, including personally identifiable information (PII), contact details, and account relationships.",
        modifiedBy: null,
        modifiedDate: "2025-10-10T07:00:25.244Z",
        name: "Customer Database",
        orgAssetId: "62353e20-b3ac-495e-84b0-98300d6259e9",
        organizationId: "998b826c-3eb5-4eb4-a8c3-4d65c2204e1c",
      },
      {
        createdBy: null,
        createdDate: "2025-10-10T07:00:25.244Z",
        description:
          "Stores sensitive customer information, including personally identifiable information (PII), contact details, and account relationships.",
        modifiedBy: null,
        modifiedDate: "2025-10-10T07:00:25.244Z",
        name: "Customer Database",
        orgAssetId: "62353e20-b3ac-495e-84b0-98300d6259e9",
        organizationId: "998b826c-3eb5-4eb4-a8c3-4d65c2204e1c",
      },
    ],
    createdBy: null,
    createdDate: "2025-10-10T06:59:30.852Z",
    modifiedBy: null,
    modifiedDate: "2025-10-10T06:59:30.852Z",
    name: "Loan Servicing",
    orgBusinessUnitId: "b03062d6-379e-405d-a3f9-db6fa0577387",
    orgProcessId: "fefbe677-e6af-4ac9-aec8-708eef38bc4a",
    organizationId: "998b826c-3eb5-4eb4-a8c3-4d65c2204e1c",
    risks: [
      {
        assessmentProcessRiskId: "0e9c7413-f4a1-4620-bb80-52c01b62e71b",
        createdBy: null,
        createdDate: "2025-10-10T06:59:38.866Z",
        description: "Customer records are altered or damaged",
        field1: null,
        field2: null,
        modifiedBy: null,
        modifiedDate: "2025-10-10T06:59:38.866Z",
        name: "Customer account data is corrupted and no longer accurate",
        orgRiskId: "6b185d33-ec35-4a6a-986f-1cf9b877405b",
        organizationId: "998b826c-3eb5-4eb4-a8c3-4d65c2204e1c",
        riskCode: "1002",
        statement:
          "Integrity of customer account data is compromised, leading to data corruption.",
        status: null,
        taxonomy: [
          {
            name: "Operational",
            orgId: "998b826c-3eb5-4eb4-a8c3-4d65c2204e1c",
            severityDetails: {
              color: "#3BB966",
              maxRange: "100k",
              minRange: "50k",
              name: "Very Low",
              severityId: "0fe9e132-ffa5-47d9-aab7-f035e208e451",
            },
            taxonomyId: "b25cb301-3a72-468d-871f-5d0122353978",
          },
          {
            name: "Reputational",
            orgId: "998b826c-3eb5-4eb4-a8c3-4d65c2204e1c",
            severityDetails: {
              color: "#3BB966",
              maxRange: "100k",
              minRange: "50k",
              name: "Very Low",
              severityId: "9fb8e014-5592-42c0-8645-762c01f4f9d4",
            },
            taxonomyId: "d8ede369-913c-454c-8e16-c49ab4f135f9",
          },
          {
            name: "Regulatory",
            orgId: "998b826c-3eb5-4eb4-a8c3-4d65c2204e1c",
            severityDetails: {
              color: "#3BB966",
              maxRange: "100k",
              minRange: "50k",
              name: "Very Low",
              severityId: "0fe9e132-ffa5-47d9-aab7-f035e208e451",
            },
            taxonomyId: "7fd7af50-b7b1-465e-8d31-c0bfe97f0a75",
          },
          {
            name: "Financial Impact",
            orgId: "998b826c-3eb5-4eb4-a8c3-4d65c2204e1c",
            severityDetails: {
              color: "#3BB966",
              maxRange: "100k",
              minRange: "50k",
              name: "Very Low",
              severityId: "0fe9e132-ffa5-47d9-aab7-f035e208e451",
            },
            taxonomyId: "3377d0a6-c58e-40d4-b284-8275f942b845",
          },
        ],
      },
    ],
    thresholdCost: 4765,
    thresholdHours: 5,
  },
];

function Reports() {
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ m: 5, height: "63vh" }}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        Reports
      </Typography>
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
              Asset Reports
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
              Process Tree
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
          <RiskDashboard />
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
          <TreeChart processes={processes} />
        </Box>
      )}
    </Box>
  );
}

export default Reports;
