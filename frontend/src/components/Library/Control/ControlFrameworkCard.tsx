import { Box, Chip, Typography, Stack, FormControlLabel } from "@mui/material";
import {
  DeleteOutlineOutlined,
  DoneOutlined,
  EditOutlined,
} from "@mui/icons-material";
import MenuItemComponent from "@/components/MenuItemComponent";
import ToggleSwitch from "@/components/Library/ToggleSwitch/ToggleSwitch";
import { ControlFrameworkForm } from "@/types/control";

interface FooterChip {
  label: string;
  value: string;
}

interface ControlFrameworkCardProps {
  controlFrameworkRecord: ControlFrameworkForm;
  setSelectedControlFrameworkRecord: React.Dispatch<React.SetStateAction<any>>;
  setIsViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteConfirmPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rowID: string;
  headerChip?: string;
  title: string;
  handleUpdateStatus: (id: number, status: string) => void;
  lastUpdated?: string | Date;
  status: string;
  footerChips?: FooterChip[];
}

const ControlFrameworkCard: React.FC<ControlFrameworkCardProps> = ({
  controlFrameworkRecord,
  setSelectedControlFrameworkRecord,
  setIsViewOpen,
  setIsEditOpen,
  setIsDeleteConfirmPopupOpen,
  handleUpdateStatus,
  rowID,
  headerChip,
  title,
  status,
  lastUpdated,
  footerChips,
}) => {
  const getStatusComponent = () => {
    if (["published", "not_published"].includes(status)) {
      return (
        <FormControlLabel
          control={
            <ToggleSwitch
              sx={{ m: 1 }}
              onChange={(e) => {
                const updatedStatus = e.target.checked
                  ? "published"
                  : "not_published";
                if (typeof controlFrameworkRecord.id === "number")
                  handleUpdateStatus(controlFrameworkRecord.id, updatedStatus);
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
        setSelectedControlFrameworkRecord(controlFrameworkRecord);
        setIsEditOpen(true);
      },
      color: "primary.main",
      action: "Edit",
      icon: <EditOutlined fontSize="small" />,
    },
    {
      onAction: () => {
        setSelectedControlFrameworkRecord(controlFrameworkRecord);
        setIsDeleteConfirmPopupOpen(true);
      },
      color: "#CD0303",
      action: "Delete",
      icon: <DeleteOutlineOutlined fontSize="small" />,
    },
  ];

  const formattedDate = lastUpdated
    ? new Date(lastUpdated as string | Date).toISOString().split("T")[0]
    : "";

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
              {rowID}
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
                    Industry:
                  </Typography>
                  &nbsp;
                  <Typography variant="body2" color="text.primary">
                    {headerChip}
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
              Last Updated: {formattedDate}
            </Typography>
            <Box sx={{ width: 96, mx: "24px !important" }}>
              {getStatusComponent()}
            </Box>
            <MenuItemComponent items={dialogData} />
          </Stack>
        </Stack>
      </Box>

      {/* Body */}
      <Box
        onClick={() => {
          setSelectedControlFrameworkRecord(controlFrameworkRecord);
          setIsViewOpen(true);
        }}
        sx={{ cursor: "pointer" }}
      >
        <Typography variant="body1" fontWeight={550} sx={{ px: 3 }}>
          {title}
        </Typography>

        {/* Meta Info */}
        <Stack display={"flex"} flexDirection={"row"} ml={3} gap={1.25}>
        {footerChips?.map((item, index) => (
          <Box
            key={index}
            sx={{
              pb: 1,
              display: "flex",
              alignItems: "center",
              mt: 1,
              mb: 1.5,
              gap: 1.25,
            }}
          >
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
                    {item.label}
                  </Typography>
                  &nbsp;
                  <Typography variant="body2" color="text.primary">
                    {item.value}
                  </Typography>
                </Box>
              }
              size="small"
              sx={{
                borderRadius: 0.5,
                height: 24,
                backgroundColor: "#FFF9C7",
              }}
            />
            {index !== footerChips?.length - 1 && (
              <Typography color="#D9D9D9">•</Typography>
            )}
          </Box>
        ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default ControlFrameworkCard;
