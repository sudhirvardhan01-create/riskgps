import ProcessCriticalityCard from "@/components/Reports/BusinessProcessRiskDashboard/ProcessCriticalityCard";
import ReportIcon from "@mui/icons-material/Report";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import {
  Box,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import RiskExposureByProcessChart from "@/components/Reports/BusinessProcessRiskDashboard/ProcessesRiskExposureBarChart";
import { Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import TableViewHeader from "@/components/Reports/BusinessProcessRiskDashboard/TableViewHeader";
import TableViewRiskScenarioCard from "@/components/Reports/BusinessProcessRiskDashboard/TableViewRiskScenarioCard";
import TableViewAssetCard from "@/components/Reports/BusinessProcessRiskDashboard/TableViewAssetCard";

const data = [
  {
    businessUnitName: "Retail Banking",
    processName: "Account Management Process",
    severity: "high",
    riskAppetite: 70000000,
    maxRiskExposure: 1914000000,
    maxNetExposure: 1704000000,
    assets: [
      {
        applicationName: "Customer Database",
        controlStrength: 0.8,
        targetStrength: 4.8,
      },
      {
        applicationName: "Banking Application",
        controlStrength: 1.9,
        targetStrength: 4.8,
      },
    ],
    risks: [
      {
        riskScenario: "Customer account data is exposed",
        riskExposure: 1914000000,
        netExposure: 1704000000,
      },
      {
        riskScenario:
          "Customer account data is corrupted and no longer accurate.",
        riskExposure: 1005000000,
        netExposure: 874000000,
      },
      {
        riskScenario: "Customer accounts cannot be managed for 1 week.",
        riskExposure: 1450000000,
        netExposure: 1233000000,
      },
    ],
  },

  {
    businessUnitName: "Retail Banking",
    processName: "Electronic Banking",
    severity: "critical",
    riskAppetite: 70000000,
    maxRiskExposure: 1904000000,
    maxNetExposure: 1276000000,
    assets: [
      {
        applicationName: "Banking Application",
        controlStrength: 1.9,
        targetStrength: 4.8,
      },
      {
        applicationName: "Payment Rails",
        controlStrength: 2.7,
        targetStrength: 4.8,
      },
    ],
    risks: [
      {
        riskScenario: "Electronic banking accounts are exposed.",
        riskExposure: 1904000000,
        netExposure: 1276000000,
      },
      {
        riskScenario:
          "Electronic banking accounts are corrupted and no longer accurate.",
        riskExposure: 779000000,
        netExposure: 382000000,
      },
      {
        riskScenario:
          "Electronic banking applicaton cannot be accessed for 4 hours.",
        riskExposure: 127000000,
        netExposure: 620000000,
      },
      {
        riskScenario:
          "Electronic banking applicaton cannot be accessed for 1 day.",
        riskExposure: 358000000,
        netExposure: 176000000,
      },
      {
        riskScenario:
          "Electronic banking applicaton cannot be accessed for 1 week.",
        riskExposure: 1088000000,
        netExposure: 533000000,
      },
    ],
  },

  {
    businessUnitName: "Retail Banking",
    processName: "ACH",
    severity: "moderate",
    riskAppetite: 70000000,
    maxRiskExposure: 1092000000,
    maxNetExposure: 622000000,
    assets: [
      {
        applicationName: "Payment Rails",
        controlStrength: 2.7,
        targetStrength: 4.6,
      },
    ],
    risks: [
      {
        riskScenario: "Payments data is exposed.",
        riskExposure: 829000000,
        netExposure: 423000000,
      },
      {
        riskScenario: "Payment data is corrupted and no longer accurate.",
        riskExposure: 1092000000,
        netExposure: 622000000,
      },
      {
        riskScenario: "ACH payments cannot be completed for 4 hours.",
        riskExposure: 115000000,
        netExposure: 610000000,
      },
      {
        riskScenario: "ACH payments cannot be completed for 1 day.",
        riskExposure: 295000000,
        netExposure: 156000000,
      },
      {
        riskScenario: "ACH payments cannot be completed for 1 week.",
        riskExposure: 535000000,
        netExposure: 284000000,
      },
    ],
  },

  {
    businessUnitName: "Retail Banking",
    processName: "Wire Transfer",
    severity: "low",
    riskAppetite: 70000000,
    maxRiskExposure: 1125000000,
    maxNetExposure: 641000000,
    assets: [
      {
        applicationName: "Payment Rails",
        controlStrength: 2.7,
        targetStrength: 4.6,
      },
      {
        applicationName: "Banking Application",
        controlStrength: 1.9,
        targetStrength: 4.6,
      },
    ],
    risks: [
      {
        riskScenario: "Wire transfer data is exposed.",
        riskExposure: 829000000,
        netExposure: 423000000,
      },
      {
        riskScenario: "Wire transfer is corrupted and no longer accurate.",
        riskExposure: 1125000000,
        netExposure: 641000000,
      },
      {
        riskScenario: "Wire transfers cannot be completed for 4 hours.",
        riskExposure: 147000000,
        netExposure: 780000000,
      },
      {
        riskScenario: "Wire transfers cannot be completed for 1 day.",
        riskExposure: 353000000,
        netExposure: 187000000,
      },
      {
        riskScenario: "Wire transfers cannot be completed for 1 week.",
        riskExposure: 838000000,
        netExposure: 444000000,
      },
    ],
  },

  {
    businessUnitName: "Retail Banking",
    processName: "ATM Management",
    severity: "moderate",
    riskAppetite: 70000000,
    maxRiskExposure: 1967000000,
    maxNetExposure: 1318000000,
    assets: [
      {
        applicationName: "Banking Application",
        controlStrength: 1.9,
        targetStrength: 4.8,
      },
    ],
    risks: [
      {
        riskScenario: "ATM data is exposed",
        riskExposure: 1967000000,
        netExposure: 1318000000,
      },
      {
        riskScenario: "ATM data is corrupted and no longer accurate.",
        riskExposure: 863000000,
        netExposure: 423000000,
      },
      {
        riskScenario: "ATMs are not available for 1 day.",
        riskExposure: 375000000,
        netExposure: 184000000,
      },
      {
        riskScenario: "ATMs are not available for 1 week.",
        riskExposure: 833000000,
        netExposure: 408000000,
      },
    ],
  },

  {
    businessUnitName: "Retail Banking",
    processName: "Fraud Monitoring",
    severity: "very low",
    riskAppetite: 70000000,
    maxRiskExposure: 517000000,
    maxNetExposure: 264000000,
    assets: [
      {
        applicationName: "Fraud Application",
        controlStrength: 2.7,
        targetStrength: 4.3,
      },
    ],
    risks: [
      {
        riskScenario: "Fraud monitoring data is exposed.",
        riskExposure: 517000000,
        netExposure: 264000000,
      },
      {
        riskScenario: "Fraud monitoring is not available for 1 week.",
        riskExposure: 358000000,
        netExposure: 190000000,
      },
    ],
  },

  {
    businessUnitName: "Loan Services",
    processName: "KYC",
    severity: "high",
    riskAppetite: 70000000,
    maxRiskExposure: 1696000000,
    maxNetExposure: 1035000000,
    assets: [
      {
        applicationName: "Loan Application",
        controlStrength: 2.2,
        targetStrength: 4.8,
      },
    ],
    risks: [
      {
        riskScenario: "KYC data is exposed.",
        riskExposure: 1696000000,
        netExposure: 1035000000,
      },
      {
        riskScenario: "KYC data is corrupted and no longer accurate.",
        riskExposure: 517000000,
        netExposure: 284000000,
      },
      {
        riskScenario: "KYC is not able to process new applications for 1 week.",
        riskExposure: 592000000,
        netExposure: 337000000,
      },
    ],
  },

  {
    businessUnitName: "Loan Services",
    processName: "Loan Origination",
    severity: "critical",
    riskAppetite: 70000000,
    maxRiskExposure: 1904000000,
    maxNetExposure: 1162000000,
    assets: [
      {
        applicationName: "Loan Application",
        controlStrength: 2.2,
        targetStrength: 4.8,
      },
      {
        applicationName: "Underwriting Application",
        controlStrength: 0.9,
        targetStrength: 4.8,
      },
    ],
    risks: [
      {
        riskScenario: "Customer loan data is exposed.",
        riskExposure: 1904000000,
        netExposure: 1162000000,
      },
      {
        riskScenario: "Loans cannot be originated for 4 hours.",
        riskExposure: 130000000,
        netExposure: 74000000,
      },
      {
        riskScenario: "Loans cannot be originated for 1 day.",
        riskExposure: 325000000,
        netExposure: 185000000,
      },
      {
        riskScenario: "Loans cannot be originated for 1 week.",
        riskExposure: 642000000,
        netExposure: 366000000,
      },
    ],
  },

  {
    businessUnitName: "Loan Services",
    processName: "Underwriting",
    severity: "low",
    riskAppetite: 70000000,
    maxRiskExposure: 1663000000,
    maxNetExposure: 1446000000,
    assets: [
      {
        applicationName: "Underwriting Application",
        controlStrength: 0.9,
        targetStrength: 4.8,
      },
    ],
    risks: [
      {
        riskScenario: "Customer underwriting data is exposed.",
        riskExposure: 1663000000,
        netExposure: 1446000000,
      },
      {
        riskScenario:
          "Underwriting models are corrupted and no longer accurate.",
        riskExposure: 200000000,
        netExposure: 162000000,
      },
      {
        riskScenario: "Underwriting cannot take place for 1 week.",
        riskExposure: 388000000,
        netExposure: 307000000,
      },
    ],
  },

  {
    businessUnitName: "Loan Services",
    processName: "Loan Servicing",
    severity: "moderate",
    riskAppetite: 70000000,
    maxRiskExposure: 1904000000,
    maxNetExposure: 1162000000,
    assets: [
      {
        applicationName: "Loan Application",
        controlStrength: 2.2,
        targetStrength: 4.8,
      },
    ],
    risks: [
      {
        riskScenario: "Customer loan data is exposed.",
        riskExposure: 1904000000,
        netExposure: 1162000000,
      },
      {
        riskScenario: "Customer loan data is corrupted and no longer accurate.",
        riskExposure: 417000000,
        netExposure: 229000000,
      },
      {
        riskScenario: "Loans cannot be serviced for 1 day.",
        riskExposure: 492000000,
        netExposure: 280000000,
      },
      {
        riskScenario: "Loans cannot be serviced for 1 week.",
        riskExposure: 1125000000,
        netExposure: 641000000,
      },
    ],
  },
];

const riskScenariosHeaderData = [
  {
    columnSize: 4,
    columnTitle: "Risk Scenarios",
  },
  {
    columnSize: 1,
    columnTitle: "CIA",
  },
  {
    columnSize: 2,
    columnTitle: "Risk Exposure",
  },
  {
    columnSize: 1.5,
    columnTitle: "Risk Exposure Level",
  },
  {
    columnSize: 2,
    columnTitle: "Net Exposure",
  },
  {
    columnSize: 1.5,
    columnTitle: "Net Exposure Level",
  },
];

const assetsHeaderData = [
  {
    columnSize: 4,
    columnTitle: "Asset",
  },
  {
    columnSize: 2,
    columnTitle: "Control Strength",
  },
  {
    columnSize: 2,
    columnTitle: "Target Strength",
  },
  {
    columnSize: 2,
    columnTitle: "Risk Exposure",
  },
  {
    columnSize: 2,
    columnTitle: "Net Exposure",
  },
];

export default function DashboardContainer() {
  const businessUnits = [
    "All",
    ...new Set(data.map((item) => item.businessUnitName)),
  ];

  const [currentTab, setCurrentTab] = useState(0);
  const [selectedBusinessUnit, setSelectedBusinessUnit] =
    useState<string>("All");
  const [processes, setProcesses] = useState<any[]>(data);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

  useEffect(() => {
    if (selectedBusinessUnit === "All") {
      setProcesses(data);
    } else {
      setProcesses(
        data.filter((item) => item.businessUnitName === selectedBusinessUnit)
      );
    }
  }, [selectedBusinessUnit]);

  const processBarChartData = processes.map((item) => ({
    processName: item.processName,
    maxRiskExposure: item.maxRiskExposure,
    maxNetExposure: item.maxNetExposure,
  }));

  const processCriticalityCardItems = [
    {
      cardBackgroundColor: "#FFEBEE", // light red
      cardBorderColor: "#D32F2F", // strong red
      cardIcon: <ReportIcon sx={{ color: "#D32F2F" }} />,
      cardText: "Critical",
      cardTextColor: "#B71C1C",
      processesCount: processes.filter((item) => item.severity === "critical")
        .length,
    },
    {
      cardBackgroundColor: "#FFF8E1", // light amber
      cardBorderColor: "#F57C00", // strong amber
      cardIcon: <WarningAmberIcon sx={{ color: "#F57C00" }} />,
      cardText: "High",
      cardTextColor: "#E65100",
      processesCount: processes.filter((item) => item.severity === "high")
        .length,
    },
    {
      cardBackgroundColor: "#E3F2FD", // light blue
      cardBorderColor: "#1976D2", // strong blue
      cardIcon: <InfoIcon sx={{ color: "#1976D2" }} />,
      cardText: "Moderate",
      cardTextColor: "#0D47A1",
      processesCount: processes.filter((item) => item.severity === "moderate")
        .length,
    },
    {
      cardBackgroundColor: "#E8F5E9", // light green
      cardBorderColor: "#388E3C", // strong green
      cardIcon: <CheckCircleOutlineIcon sx={{ color: "#388E3C" }} />,
      cardText: "Low",
      cardTextColor: "#1B5E20",
      processesCount: processes.filter((item) => item.severity === "low")
        .length,
    },
    {
      cardBackgroundColor: "#F1F8E9", // light olive green
      cardBorderColor: "#7CB342", // medium green
      cardIcon: <CheckCircleIcon sx={{ color: "#7CB342" }} />,
      cardText: "Very Low",
      cardTextColor: "#33691E",
      processesCount: processes.filter((item) => item.severity === "very low")
        .length,
    },
    {
      cardBackgroundColor: "#ECEFF1", // neutral grey
      cardBorderColor: "#546E7A", // blue-grey
      cardIcon: <AnalyticsIcon sx={{ color: "#546E7A" }} />,
      cardText: "Total",
      cardTextColor: "#37474F",
      processesCount: processes.length,
    },
  ];

  const riskExposureCardData = [
    {
      title: "Total Risk Scenarios",
      value: selectedProcess
        ? processes.find((item) => item.processName === selectedProcess)?.risks
            .length
        : processes
            .map((item) => item?.risks.length)
            .reduce((a, b) => a + b, 0),
    },
    {
      title: "Max. Risk Exposure",
      value: selectedProcess
        ? `$ ${
            processes.find((item) => item.processName === selectedProcess)
              ?.maxRiskExposure / 1000000000
          } Bn`
        : `$ ${
            Math.max(
              ...processes.map((item) => item.maxRiskExposure as number)
            ) / 1000000000
          } Bn`,
    },
    {
      title: "Max. Net Exposure",
      value: selectedProcess
        ? `$ ${
            processes.find((item) => item.processName === selectedProcess)
              ?.maxNetExposure / 1000000000
          } Bn`
        : `$ ${
            Math.max(
              ...processes.map((item) => item.maxNetExposure as number)
            ) / 1000000000
          } Bn`,
    },
    {
      title: "Risk Appetite",
      value: `$ ${processes[0].riskAppetite / 1000000000} Bn`,
    },
  ];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <>
      <Box
        p={5}
        sx={{
          height: "calc(100vh - 128px)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: "#121212" }}
          mb={5}
        >
          Business Process Risk Dashboard
        </Typography>
        <Stack
          direction={"row"}
          justifyContent={"end"}
          alignItems={"center"}
          mb={3}
          gap={2}
        >
          <Typography variant="body1" color="#121212">
            Filter by Business Unit to view specific processes
          </Typography>
          <FormControl variant="filled" sx={{ height: "48px", width: "200px" }}>
            <InputLabel id="business-unit-label">Business Unit</InputLabel>
            <Select
              labelId="business-unit-label"
              value={selectedBusinessUnit}
              onChange={(e) => {
                setSelectedBusinessUnit(e.target.value);
              }}
            >
              {businessUnits.map((item, index) => (
                <MenuItem value={item} key={index}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto", // scroll only vertical
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: "#fafafa",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              borderRadius: 2,
              border: "1px solid #E5E7EB",
            }}
          >
            <Typography
              variant="body2"
              fontWeight={600}
              textAlign="left"
              sx={{ mb: 1 }}
            >
              Process Criticality Overview
            </Typography>
            <Grid container spacing={2}>
              {processCriticalityCardItems.map((item, index) => (
                <Grid size={{ xs: 2 }} key={index}>
                  <ProcessCriticalityCard
                    cardBackgroundColor={item.cardBackgroundColor}
                    cardBorderColor={item.cardBorderColor}
                    cardIcon={item.cardIcon}
                    cardText={item.cardText}
                    cardTextColor={item.cardTextColor}
                    processesCount={item.processesCount}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: "#fafafa",
              height: "750px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              borderRadius: 2,
              border: "1px solid #E5E7EB",
            }}
          >
            <Typography
              variant="body2"
              fontWeight={600}
              textAlign="left"
              sx={{ mb: 2 }}
            >
              Risk Exposure by Business Process
            </Typography>
            <Paper
              sx={{
                p: 2,
                backgroundColor: "#fff",
                borderRadius: 3,
                width: "100%",
                mb: 2,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Grid container spacing={2} width={"100%"}>
                {riskExposureCardData.map((item, index) => (
                  <Grid size={3} key={index}>
                    <Box
                      sx={{
                        border: `1px solid #d0ccccff`,
                        backgroundColor: "#fafafa",
                        borderRadius: 2,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "start",
                      }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color="text.primary"
                      >
                        {item.title}
                      </Typography>
                      <Typography variant="body1" color="primary.main">
                        {item.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
            <RiskExposureByProcessChart
              data={processBarChartData}
              selectedProcess={selectedProcess}
              setSelectedProcess={setSelectedProcess}
              riskAppetite={processes[0].riskAppetite / 1000000000}
            />
          </Paper>
          {selectedProcess && (
            <Box
              sx={{
                border: "1px solid #E5E7EB",
                borderRadius: 2,
                p: 2,
                backgroundColor: "#fff",
              }}
            >
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                mb={2}
              >
                <Stack direction={"row"} gap={2}>
                  <Typography
                    variant="h6"
                    color="text.primary"
                    fontWeight={600}
                  >
                    {selectedProcess}
                  </Typography>
                  <Chip
                    variant="filled"
                    label="Critical"
                    sx={{
                      borderRadius: 4,
                      backgroundColor: "#FFEBEE",
                      color: "#B71C1C",
                    }}
                  />
                </Stack>
                <IconButton sx={{ color: "primary.main" }}>
                  <Close />
                </IconButton>
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
                      Risk Scenarios
                    </Typography>
                  }
                  sx={{
                    border:
                      currentTab == 0
                        ? "1px solid #E7E7E8"
                        : "1px solid transparent",
                    borderRadius: "8px 8px 0px 0px",
                    borderBottom:
                      currentTab == 0
                        ? "1px solid transparent"
                        : "1px solid #E7E7E8",
                    maxHeight: 48,
                  }}
                />
                <Tab
                  label={
                    <Typography variant="body2" fontWeight={550}>
                      Asset
                    </Typography>
                  }
                  sx={{
                    border:
                      currentTab == 1
                        ? "1px solid #E7E7E8"
                        : "1px solid transparent",
                    borderRadius: "8px 8px 0px 0px",
                    borderBottom:
                      currentTab == 1
                        ? "1px solid transparent"
                        : "1px solid #E7E7E8",
                    maxHeight: 48,
                  }}
                />
              </Tabs>

              {currentTab === 0 ? (
                <>
                  <TableViewHeader headerData={riskScenariosHeaderData} />
                  <Stack direction={"column"} spacing={2}>
                    {processes
                      .find((i) => i.processName === selectedProcess)
                      ?.risks.map((item: any, index: number) => (
                        <TableViewRiskScenarioCard
                          key={index}
                          riskScenario={item.riskScenario}
                          ciaMapping={"C"}
                          riskExposure={`$ ${
                            item.riskExposure / 1000000000
                          } Bn`}
                          riskExposureLevel={item.riskExposureLevel}
                          netExposure={`$ ${item.netExposure / 1000000000} Bn`}
                          netExposureLevel={item.netExposureLevel}
                        />
                      ))}
                  </Stack>
                </>
              ) : (
                <>
                  <TableViewHeader headerData={assetsHeaderData} />
                  <Stack direction={"column"} spacing={2}>
                    {processes
                      .find((i) => i.processName === selectedProcess)
                      ?.assets.map((item: any, index: number) => (
                        <TableViewAssetCard
                          key={index}
                          assetName={item.applicationName}
                          controlStrength={item.controlStrength}
                          targetStrength={item.targetStrength}
                          riskExposure={
                            item.riskExposure
                              ? `$ ${item.riskExposure / 1000000000} Bn`
                              : "-"
                          }
                          netExposure={
                            item.netExposure
                              ? `$ ${item.netExposure / 1000000000} Bn`
                              : "-"
                          }
                        />
                      ))}
                  </Stack>
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
