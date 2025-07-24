import {
  Box,
  Typography,
  Stack,
  Select,
  MenuItem,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
  useMediaQuery,
  InputLabel,
  FormControl,
  TablePagination,
} from "@mui/material";
import { useRouter } from "next/router";
import { FilterAltOutlined, ArrowBack, Search } from "@mui/icons-material";
import React, { useState } from "react";
import ViewRiskScenarioModal from "@/components/library/risk-scenario/ViewRiskScenarioModalPopup";
import RiskScenarioCard from "@/components/library/risk-scenario/RiskScenarioCard";
import RiskScenarioFormModal from "@/components/library/risk-scenario/RiskScenarioFormModal";
import { RiskScenarioAttributes, RiskScenarioData } from "@/types/risk-scenario";

const riskScenarioDatas =  [
  {
    "id": 1,
    "risk_code": "RSK-001",
    "riskScenario": "Unauthorized access to sensitive data",
    "riskStatement": "Attackers may gain unauthorized access to confidential information",
    "riskDescription": "Inadequate access control could lead to data leaks.",
    "industry": ["Finance", "Healthcare"],
    "tags": 3,
    "processes": 2,
    "assets": 5,
    "threats": 4,
    "riskField1": "Confidentiality",
    "riskField2": "High",
    "attributes": [
      { "meta_data_key": 101, "value": ["Access Control", "Authentication"] },
      { "meta_data_key": 102, "value": ["User Management"] }
    ],
    "lastUpdated": "2025-07-24T10:00:00Z",
    "status": "Open"
  },
  {
    "id": 2,
    "risk_code": "RSK-002",
    "riskScenario": "Data loss due to ransomware",
    "riskStatement": "Critical systems may be locked by ransomware",
    "riskDescription": "Ransomware can encrypt critical files if proper safeguards are not in place.",
    "industry": ["Technology"],
    "tags": 1,
    "processes": 3,
    "assets": 6,
    "threats": 2,
    "riskField1": "Availability",
    "riskField2": "Critical",
    "attributes": [
      { "meta_data_key": 201, "value": ["Patch Management", "Email Filtering"] }
    ],
    "lastUpdated": "2025-07-22T14:30:00Z",
    "status": "In Progress"
  },
  {
    "id": 3,
    "risk_code": "RSK-003",
    "riskScenario": "Third-party service breach",
    "riskStatement": "A breach at a vendor could affect internal systems",
    "riskDescription": "Weak vendor security practices might compromise internal data.",
    "industry": ["Retail", "Logistics"],
    "tags": 5,
    "processes": 1,
    "assets": 3,
    "threats": 6,
    "riskField1": "Integrity",
    "riskField2": "Medium",
    "attributes": [
      { "meta_data_key": 301, "value": ["Vendor Risk Assessment", "Data Encryption"] }
    ],
    "lastUpdated": "2025-07-20T09:15:00Z",
    "status": "Closed"
  },
  {
    "id": 4,
    "risk_code": "RSK-004",
    "riskScenario": "Phishing attacks on employees",
    "riskStatement": "Employees may unknowingly share credentials",
    "riskDescription": "Phishing emails could lead to credential theft and system compromise.",
    "industry": ["Finance", "Education"],
    "tags": 4,
    "processes": 2,
    "assets": 2,
    "threats": 3,
    "riskField1": "Confidentiality",
    "riskField2": "Medium",
    "attributes": [
      { "meta_data_key": 401, "value": ["Security Awareness Training", "Email Filtering"] }
    ],
    "lastUpdated": "2025-07-19T11:00:00Z",
    "status": "Open"
  },
  {
    "id": 5,
    "risk_code": "RSK-005",
    "riskScenario": "Misconfigured cloud storage",
    "riskStatement": "Data could be publicly exposed due to misconfigurations",
    "riskDescription": "Cloud storage misconfigurations are a common cause of breaches.",
    "industry": ["Technology", "Media"],
    "tags": 2,
    "processes": 4,
    "assets": 5,
    "threats": 1,
    "riskField1": "Confidentiality",
    "riskField2": "High",
    "attributes": [
      { "meta_data_key": 501, "value": ["Cloud Configuration Auditing", "Access Logs"] }
    ],
    "lastUpdated": "2025-07-18T16:00:00Z",
    "status": "In Review"
  },
  {
    "id": 6,
    "risk_code": "RSK-006",
    "riskScenario": "Denial of Service (DoS) attack",
    "riskStatement": "External attackers may flood the system with traffic",
    "riskDescription": "Excessive requests could render services unavailable.",
    "industry": ["Telecom"],
    "tags": 6,
    "processes": 1,
    "assets": 4,
    "threats": 7,
    "riskField1": "Availability",
    "riskField2": "High",
    "attributes": [
      { "meta_data_key": 601, "value": ["Rate Limiting", "Traffic Monitoring"] }
    ],
    "lastUpdated": "2025-07-17T08:30:00Z",
    "status": "Mitigated"
  }
]



const Index = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [selectedRiskScenario, setSelectedRiskScenario] = useState<RiskScenarioData | null>(null);
  const [isViewRiskScenarioOpen, setIsViewRiskScenarioOpen] = useState(true);
  const [isAddRiskScenarioOpen, setIsAddRiskScenarioOpen] = useState(false);
  const [isEditRiskScenarioOpen, setIsEditRiskScenarioOpen] = useState(true);
  const [riskData, setRiskData] = useState<RiskScenarioData>({
    riskScenario: "",
    riskStatement: "",
    riskDescription: "",
    riskField1: "",
    riskField2: "",
    attributes: [
      { meta_data_key: Date.now() * -1, value: [] },
    ] as RiskScenarioAttributes[],
  });

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <ViewRiskScenarioModal
        open={isViewRiskScenarioOpen}
        onClose={() => {
          setIsViewRiskScenarioOpen(false);
        }}
      />
      <RiskScenarioFormModal
        open={isAddRiskScenarioOpen}
        riskData={riskData}
        setRiskData={setRiskData}
        onSubmit={() => {
          setIsAddRiskScenarioOpen(false);
        }}
        onClose={() => {
          setIsAddRiskScenarioOpen(false);
        }}
      />

      <Box p={2}>
        <Box mb={3}>
          {/* Row 1: Breadcrumb + Add Button */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton onClick={() => router.back()} size="small">
                <ArrowBack fontSize="small" />
              </IconButton>
              <Typography variant="body1" color="textPrimary">
                Library /
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "primary.main", fontWeight: 600 }}
              >
                Risk Scenarios
              </Typography>
            </Stack>

            <Button
             onClick={() => {
              setIsAddRiskScenarioOpen(true)
             }}
              variant="contained"
              sx={{
                backgroundColor: "primary.main",
                textTransform: "none",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "#001080",
                },
              }}
            >
              Add Risk Scenario
            </Button>
          </Stack>

          {/* Row 2: Search + Sort + Filter */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            useFlexGap
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            {/* Search Bar */}
            <TextField
              size="small"
              placeholder="Search by keywords"
              variant="outlined"
              sx={{
                borderRadius: 1,
                height: "40px",
                width: "33%",
                minWidth: 200,
                backgroundColor: "#FFFFFF",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Right Controls */}
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              justifyContent={isMobile ? "flex-start" : "flex-end"}
            >
              <FormControl sx={{ backgroundColor: "#FFFFFF", borderRadius: 1 }}>
                <InputLabel id="sort-risk-scenarios">Sort</InputLabel>
                <Select
                  size="small"
                  defaultValue="Risk ID (Ascending)"
                  label="Sort"
                  labelId="sort-risk-scenarios"
                >
                  <MenuItem value="Risk ID (Ascending)">
                    Risk ID (Ascending)
                  </MenuItem>
                  <MenuItem value="Risk ID (Descending)">
                    Risk ID (Descending)
                  </MenuItem>
                  <MenuItem value="Created (Latest to Oldest)">
                    Created (Latest to Oldest)
                  </MenuItem>
                  <MenuItem value="Created (Oldest to Latest)">
                    Created (Oldest to Latest)
                  </MenuItem>
                  <MenuItem value="Updated (Latest to Oldest)">
                    Updated (Latest to Oldest)
                  </MenuItem>
                  <MenuItem value="Updated (Oldest to Latest)">
                    Updated (Oldest to Latest)
                  </MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                endIcon={<FilterAltOutlined />}
                sx={{
                  textTransform: "none",
                  borderColor: "#ccc",
                  color: "black",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 1,
                }}
              >
                Filter
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Stack spacing={2}>
          {riskScenarioDatas.map((item: RiskScenarioData, index) => (
            <div key={index} onClick={() => {
              setIsViewRiskScenarioOpen(true)
            }}>
            <RiskScenarioCard  key={index} riskScenarioData={item} setSelectedRiskScenario={setSelectedRiskScenario} setIsEditRiskScenarioOpen={setIsEditRiskScenarioOpen} setIsAddRiskScenarioOpen={setIsAddRiskScenarioOpen} />
            </div>
          ))}
        </Stack>

        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TablePagination
            component="div"
            count={100}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[6, 12, 18, 24, 30]}
          />
        </Box>
      </Box>
    </>
  );
};

export default Index;
