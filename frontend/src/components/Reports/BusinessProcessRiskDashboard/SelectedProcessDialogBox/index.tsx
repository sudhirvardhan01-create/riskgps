import { Close } from "@mui/icons-material";
import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import TableViewHeader from "../TableViewHeader";
import TableViewAssetCard from "../TableViewAssetCard";
import TableViewRiskScenarioCard from "../TableViewRiskScenarioCard";
import RiskScenarioHorizontalBarChart from "../RiskScenarioHorizontalBarChart";
import AssetHorizontalBarChart from "../AssetHorizontalBarChart";

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

interface SelectedProcessDialogBoxProps {
  selectedProcess: string | null;
  setSelectedProcess: React.Dispatch<React.SetStateAction<string | null>>;
  processData: any;
}

const SelectedProcessDialogBox: React.FC<SelectedProcessDialogBoxProps> = ({
  selectedProcess,
  setSelectedProcess,
  processData,
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedRiskScenario, setSelectedRiskScenario] = useState<
    string | null
  >(null);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const severity = processData.severity?.toLowerCase() ?? "";

  let chipBackgroundColor = "";
  let chipTextColor = "";

  switch (severity) {
    case "critical":
      chipBackgroundColor = "#214f73";
      chipTextColor = "#fff";
      break;

    case "high":
      chipBackgroundColor = "#31a8b2";
      chipTextColor = "#fff";
      break;

    case "moderate":
      chipBackgroundColor = "#20cfcf";
      chipTextColor = "#fff";
      break;

    case "low":
      chipBackgroundColor = "#5af4de";
      chipTextColor = "#214f73";
      break;

    case "very low":
      chipBackgroundColor = "#80fff4";
      chipTextColor = "#214f73";
      break;

    default:
      chipBackgroundColor = "#f7fffc"; // fallback / total / unknown
      chipTextColor = "#214f73";
      break;
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };
  return (
    <Dialog
      open={!!selectedProcess}
      onClose={() => {
        setSelectedProcess(null);
      }}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 2, paddingTop: 1 },
        },
      }}
    >
      <DialogTitle>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={2}
        >
          <Stack direction={"row"} gap={2}>
            <Stack direction={"row"} gap={0.5}>
              <Typography variant="h6" color="text.secondary" fontWeight={600}>
                {processData.businessUnitName} /
              </Typography>
              <Typography variant="h6" color="primary.main" fontWeight={550}>
                {selectedProcess}
              </Typography>
            </Stack>
            <Chip
              variant="filled"
              label={processData.severity}
              sx={{
                borderRadius: 4,
                backgroundColor: chipBackgroundColor,
                color: chipTextColor,
                textTransform: "capitalize",
              }}
            />
          </Stack>
          <IconButton
            sx={{ color: "primary.main" }}
            onClick={() => setSelectedProcess(null)}
          >
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
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
                Asset
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
        {currentTab === 0 ? (
          <>
            <RiskScenarioHorizontalBarChart
              data={processData?.risks.map((item: any) => ({
                riskScenario: item.riskScenario,
                riskExposure: item.riskExposure,
                netExposure: item.netExposure,
              }))}
              selectedRiskScenario={selectedRiskScenario}
              setSelectedRiskScenario={setSelectedRiskScenario}
            />
            <TableViewHeader headerData={riskScenariosHeaderData} />
            <Stack direction={"column"} spacing={2}>
              {selectedRiskScenario
                ? processData?.risks
                    .filter((i: any) => i.riskScenario === selectedRiskScenario)
                    .map((item: any, index: number) => (
                      <TableViewRiskScenarioCard
                        key={index}
                        riskScenario={item.riskScenario}
                        ciaMapping={item.riskScenarioCIAMapping}
                        riskExposure={`$ ${(
                          item.riskExposure / 1000000000
                        ).toFixed(2)} Bn`}
                        riskExposureLevel={item.riskExposureLevel}
                        netExposure={`$ ${(
                          item.netExposure / 1000000000
                        ).toFixed(2)} Bn`}
                        netExposureLevel={item.netExposureLevel}
                      />
                    ))
                : processData?.risks.map((item: any, index: number) => (
                    <TableViewRiskScenarioCard
                      key={index}
                      riskScenario={item.riskScenario}
                      ciaMapping={item.riskScenarioCIAMapping}
                      riskExposure={`$ ${(
                        item.riskExposure / 1000000000
                      ).toFixed(2)} Bn`}
                      riskExposureLevel={item.riskExposureLevel}
                      netExposure={`$ ${(item.netExposure / 1000000000).toFixed(
                        2
                      )} Bn`}
                      netExposureLevel={item.netExposureLevel}
                    />
                  ))}
            </Stack>
          </>
        ) : (
          <>
            <AssetHorizontalBarChart
              data={processData?.assets.map((item: any) => ({
                applicationName: item.applicationName,
                controlStrength: item.controlStrength,
                targetStrength: item.targetStrength,
              }))}
              selectedAsset={selectedAsset}
              setSelectedAsset={setSelectedAsset}
            />
            <TableViewHeader headerData={assetsHeaderData} />
            <Stack direction={"column"} spacing={2}>
              {selectedAsset
                ? processData?.assets
                    .filter((i: any) => i.applicationName === selectedAsset)
                    .map((item: any, index: number) => (
                      <TableViewAssetCard
                        key={index}
                        assetName={item.applicationName}
                        controlStrength={item.controlStrength}
                        targetStrength={item.targetStrength}
                        riskExposure={
                          item.riskExposure
                            ? `$ ${(item.riskExposure / 1000000000).toFixed(
                                2
                              )} Bn`
                            : "-"
                        }
                        netExposure={
                          item.netExposure
                            ? `$ ${(item.netExposure / 1000000000).toFixed(
                                2
                              )} Bn`
                            : "-"
                        }
                      />
                    ))
                : processData?.assets.map((item: any, index: number) => (
                    <TableViewAssetCard
                      key={index}
                      assetName={item.applicationName}
                      controlStrength={item.controlStrength}
                      targetStrength={item.targetStrength}
                      riskExposure={
                        item.riskExposure
                          ? `$ ${(item.riskExposure / 1000000000).toFixed(
                              2
                            )} Bn`
                          : "-"
                      }
                      netExposure={
                        item.netExposure
                          ? `$ ${(item.netExposure / 1000000000).toFixed(2)} Bn`
                          : "-"
                      }
                    />
                  ))}
            </Stack>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SelectedProcessDialogBox;
