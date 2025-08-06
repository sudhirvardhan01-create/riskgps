// components/RiskScenarioCard.tsx
import React from "react";
import {
  Box,
  Chip,
  Typography,
  Stack,
  Divider,
  FormControlLabel,
} from "@mui/material";
import {
  DeleteOutlineOutlined,
  DoneOutlined,
  EditOutlined,
} from "@mui/icons-material";
import MenuItemComponent from "@/components/MenuItemComponent";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { ProcessData } from "@/types/process";

interface ProcessCardProps {
  processData: ProcessData;
  setSelectedProcess: React.Dispatch<React.SetStateAction<ProcessData | null>>;
  setIsViewProcessOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditProcessOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteConfirmPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateProcessStatus: (id: number, status: string) => void;
}

const ProcessCard: React.FC<ProcessCardProps> = ({
  processData,
  setSelectedProcess,
  setIsViewProcessOpen,
  setIsEditProcessOpen,
  setIsDeleteConfirmPopupOpen,
  handleUpdateProcessStatus,
}: ProcessCardProps) => {
  const getStatusComponent = () => {
    if (
      processData.status === "published" ||
      processData.status === "not_published"
    ) {
      return (
        <FormControlLabel
          control={
            <ToggleSwitch
              sx={{ m: 1 }}
              color="success"
              onChange={(e) => {
                const updatedStatus = e.target.checked
                  ? "published"
                  : "not_published";
                handleUpdateProcessStatus(processData.id as number, updatedStatus);
              }}
              checked={processData.status === "published"}
            />
          }
          label={processData.status === "published" ? "Enabled" : "Disabled"}
        />
      );
    }

    return (
      <Chip
        icon={<DoneOutlined />}
        label="Draft"
        variant="outlined"
        size="small"
        color="primary"
        sx={{ fontWeight: 500, borderRadius: 1, width: "100%" }}
      />
    );
  };

  const dialogData = [
    {
      onAction: () => {
        setSelectedProcess(processData);
        setIsEditProcessOpen(true);
      },
      color: "primary.main",
      action: "Edit",
      icon: <EditOutlined fontSize="small" />,
    },
    {
      onAction: () => {
        setSelectedProcess(processData);
        setIsDeleteConfirmPopupOpen(true);
      },
      color: "#CD0303",
      action: "Delete",
      icon: <DeleteOutlineOutlined fontSize="small" />,
    },
  ];

  return (
    <Box
      sx={{
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        boxShadow: "0px 2px 4px 0px #D9D9D98F",
        border: "1px solid #E4E4E4",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 1,
          backgroundColor: "#F3F8FF",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography fontWeight={600}>{processData.processCode}</Typography>
            <Chip
              label={`Industry: ${
                processData.industry && processData.industry?.length > 0
                  ? processData.industry.join(", ")
                  : "Not Defined"
              }`}
              variant="outlined"
              size="small"
              sx={{ borderRadius: 0.5 }}
            />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0}>
            <Typography variant="body2" color="textSecondary">
              Last Updated:{" "}
              {
                new Date(processData.lastUpdated as Date)
                  .toISOString()
                  .split("T")[0]
              }
            </Typography>
            <Box sx={{ width: "200px", mx: "24px !important" }}>
              {getStatusComponent()}
            </Box>
            {/* <IconButton sx={{ px: 0, mx:'0px !important'}}>
            <MoreVert sx={{color:"primary.main"}}/>
          </IconButton> */}
            <MenuItemComponent items={dialogData} />
          </Stack>
        </Stack>
      </Box>

      {/* Title */}
      <div
        onClick={() => {
          console.log(processData);
          setSelectedProcess(processData);
          setIsViewProcessOpen(true);
        }}
      >
        <Typography variant="body1" fontWeight={500} sx={{ px: 3 }}>
          {processData.processName}
        </Typography>

        <Divider sx={{ mx: 3, my: 1 }} />

        {/* Meta Info */}
        <Typography variant="body2" color="textSecondary" sx={{ px: 3, pb: 1 }}>
          1 Tags &nbsp; • &nbsp; {processData.processDependency?.length || 0}{" "}
          Dependent Processes &nbsp; • &nbsp; 3 Assets &nbsp; • &nbsp; 4 Threats
        </Typography>
      </div>
    </Box>
  );
};

export default ProcessCard;
