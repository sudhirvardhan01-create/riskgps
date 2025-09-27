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
import ToggleSwitch from "@/components/Library/ToggleSwitch/ToggleSwitch";

interface TagItem {
  label: string;
  value: any;
}

interface LibraryCardProps {
  libraryData: any;
  setSelectedLibraryData: React.Dispatch<React.SetStateAction<any>>;
  setIsViewLibraryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditLibraryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteConfirmPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateStatus: (id: number, status: string) => void;
  title: string;
  desc: string;
  chip?: string;
  status: string;
  lastUpdated?: string | Date;
  tagItems: TagItem[];
  module: string;
  footerChipKey: string;
  footerChipValue: string;
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
  tagItems,
  module,
  footerChipKey,
  footerChipValue,
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
                    {module === "Asset" ? "Asset Category:" : "Industry:"}
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
          setSelectedLibraryData(libraryData);
          setIsViewLibraryOpen(true);
        }}
        sx={{ cursor: "pointer" }}
      >
        <Typography variant="body1" fontWeight={550} sx={{ px: 3 }}>
          {desc}
        </Typography>

        <Divider sx={{ mx: 3, my: 1 }} />

        {/* Meta Info */}
        <Stack display={"flex"} flexDirection={"row"} ml={3} gap={1.25}>
        {module === "Risk Scenario" && <Chip
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" color="#91939A">
                {`${footerChipKey}: `}
              </Typography>
              &nbsp;
              <Typography variant="body2" color="text.primary">
                {footerChipValue}
              </Typography>
            </Box>
          }
          size="small"
          sx={{
            borderRadius: 0.5,
            height: 24,
            backgroundColor: "#FFF9C7",
          }}
        />}
        <Box sx={{pb: 1, display: "flex", gap: 1.25 }}>
          {tagItems.map((item, index) => (
            <Stack
              key={index}
              display={"flex"}
              flexDirection={"row"}
              gap={1.25}
            >
              <Typography color="#D9D9D9">•</Typography>
              <Typography key={index} variant="body2" color="text.primary">
                {`${item.label}: `}
              </Typography>
              <Typography variant="body2" color="text.primary" fontWeight={600}>
                {item.value}
              </Typography>
            </Stack>
          ))}
        </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default LibraryCard;
