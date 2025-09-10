import { Close, DoneOutlined, EditOutlined } from "@mui/icons-material";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { ControlFrameworkForm } from "@/types/control";

interface ViewControlFrameworkModalProps {
  open: boolean;
  controlFrameworkRecord: ControlFrameworkForm;
  setIsEditControlOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedControlFrameworkRecord: React.Dispatch<
    React.SetStateAction<ControlFrameworkForm | null>
  >;
  onClose: () => void;
}
const ViewControlFrameworkModal: React.FC<ViewControlFrameworkModalProps> = ({
  open,
  controlFrameworkRecord,
  setIsEditControlOpen,
  setSelectedControlFrameworkRecord,
  onClose,
}: ViewControlFrameworkModalProps) => {
  const getStatusComponent = () => {
    if (
      controlFrameworkRecord.status === "published" ||
      controlFrameworkRecord.status === "not_published"
    ) {
      return (
        <FormControlLabel
          control={
            <ToggleSwitch
              color="success"
              checked={controlFrameworkRecord.status === "published"}
            />
          }
          label={
            controlFrameworkRecord.status === "published" ? "Enabled" : "Disabled"
          }
          sx={{ width: 30, height: 18, marginLeft: "0 !important", gap: 1 }}
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
        sx={{
          fontWeight: 550,
          borderRadius: 1,
          color: "primary.main",
          width: "96px",
          "& .MuiChip-icon": {
            marginRight: "1px",
          },
        }}
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          display={"flex"}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack
            display={"flex"}
            direction="row"
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
          >
            <Typography variant="h5" color="#121212" fontWeight={550}>
              Control {controlFrameworkRecord.frameWorkControlCategoryId}
            </Typography>
            {getStatusComponent()}
          </Stack>

          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            gap={3}
          >
            <IconButton
              sx={{ padding: 0 }}
              onClick={() => {
                setSelectedControlFrameworkRecord(controlFrameworkRecord);
                setIsEditControlOpen(true);
              }}
            >
              <EditOutlined sx={{ color: "primary.main" }} />
            </IconButton>
            <IconButton onClick={onClose} sx={{ padding: 0 }}>
              <Close sx={{ color: "primary.main" }} />
            </IconButton>
          </Box>
        </Stack>
        <Divider sx={{ mt: 3, mb: 1 }}></Divider>
      </DialogTitle>

      <DialogContent sx={{ paddingBottom: 0 }}>
        <Grid container spacing={3}>
          {/* Control Framework */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Control Framework
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {controlFrameworkRecord.frameWorkName}
              </Typography>
            </Box>
          </Grid>

          {/* Framework Control Category ID */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Framework Control Category ID
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {controlFrameworkRecord.frameWorkControlCategoryId}
              </Typography>
            </Box>
          </Grid>

          {/* Framework Control Category */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Framework Control Category
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {controlFrameworkRecord.frameWorkControlCategory
                  ? controlFrameworkRecord.frameWorkControlCategory
                  : "-"}
              </Typography>
            </Box>
          </Grid>

          {/* Framework Control Sub-Category ID */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Framework Control Sub-Category ID
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {controlFrameworkRecord.frameWorkControlSubCategoryId
                  ? controlFrameworkRecord.frameWorkControlSubCategoryId
                  : "-"}
              </Typography>
            </Box>
          </Grid>

          {/* Framework Control Sub-Category */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Framework Control Sub-Category
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {controlFrameworkRecord.frameWorkControlSubCategory
                  ? controlFrameworkRecord.frameWorkControlSubCategory
                  : "-"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogContent sx={{ paddingTop: 3, paddingBottom: 4.5 }}>
        <Grid
          container
          spacing={3}
          sx={{
            backgroundColor: "#E7E7E84D",
            p: "9px 16px",
            borderRadius: 1,
          }}
        >
          <Grid size={{ xs: 4 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Created By
              </Typography>
              <Typography variant="body1" fontWeight={500} color="text.primary">
                Person Name
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Created On
              </Typography>
              <Typography variant="body1" fontWeight={500} color="text.primary">
                2 Jan, 2024
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Last Updated On
              </Typography>
              <Typography variant="body1" fontWeight={500} color="text.primary">
                8 Jan, 2024
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ViewControlFrameworkModal;
