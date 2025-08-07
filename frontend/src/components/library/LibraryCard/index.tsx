// components/LibraryCard.tsx
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
import ToggleSwitch from "../toggle-switch/ToggleSwitch";

interface LibraryCardProps {
  libraryData: any;
  setSelectedLibraryData: React.Dispatch<React.SetStateAction<any>>;
  setIsViewLibraryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditLibraryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteConfirmPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateStatus: (id: number, status: string) => void;
  title: string;
  desc: string;
  chip: string;
  status: string;
  lastUpdated: string | Date;
}

const LibraryCard: React.FC<LibraryCardProps> = ({
  libraryData,
  setSelectedLibraryData,
  setIsViewLibraryOpen,
  setIsEditLibraryOpen,
  setIsDeleteConfirmPopupOpen,
  handleUpdateStatus,
  title,
  desc,
  chip = "Not Defined",
  status,
  lastUpdated,
}: LibraryCardProps) => {
  const getStatusComponent = () => {
    if (["published", "not_published"].includes(status)) {
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
                handleUpdateStatus(libraryData.id as number, updatedStatus);
              }}
              checked={status === "published"}
            />
          }
          label={status === "published" ? "Enabled" : "Disabled"}
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
        setSelectedLibraryData(libraryData);
        setIsEditLibraryOpen(true);
      },
      color: "primary.main",
      action: "Edit",
      icon: <EditOutlined fontSize="small" />,
    },
    {
      onAction: () => {
        setSelectedLibraryData(libraryData);
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
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body1" color={"text.primary"}>
              {title}
            </Typography>
            <Chip
              label={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" color="#91939A">
                    {"Industry:"}
                  </Typography>
                  &nbsp;
                  <Typography variant="body2" color="text.primary">
                    {chip}
                  </Typography>
                </Box>
              }
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 0.5,
                border: "1px solid #DDDDDD",
                height: 24,
              }}
            />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0}>
            <Typography variant="body2" color="textSecondary">
              Last Updated:{" "}
              {new Date(lastUpdated as Date).toISOString().split("T")[0]}
            </Typography>
            <Box sx={{ width: 96, mx: "24px !important" }}>
              {getStatusComponent()}
            </Box>
            <MenuItemComponent items={dialogData} />
          </Stack>
        </Stack>
      </Box>

      {/* Title */}
      <div
        onClick={() => {
          console.log(libraryData);
          setSelectedLibraryData(libraryData);
          setIsViewLibraryOpen(true);
        }}
      >
        <Typography variant="body1" fontWeight={550} sx={{ px: 3 }}>
          {desc}
        </Typography>

        <Divider sx={{ mx: 3, my: 1 }} />

        {/* Meta Info */}
        <Typography variant="body2" color="textSecondary" sx={{ px: 3, pb: 1 }}>
          {libraryData.tags} Tags &nbsp; • &nbsp; {1} Processes &nbsp; • &nbsp;{" "}
          {libraryData.assets} Assets &nbsp; • &nbsp; {libraryData.threats}{" "}
          Threats
        </Typography>
      </div>
    </Box>
  );
};

export default LibraryCard;
