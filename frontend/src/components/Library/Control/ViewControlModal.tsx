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
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { ControlForm } from "@/types/control";

interface ViewControlModalProps {
  open: boolean;
  controlData: ControlForm;
  setIsEditControlOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedControl: React.Dispatch<React.SetStateAction<ControlForm | null>>;
  onClose: () => void;
}
const ViewControlModal: React.FC<ViewControlModalProps> = ({
  open,
  controlData,
  setIsEditControlOpen,
  setSelectedControl,
  onClose,
}: ViewControlModalProps) => {
  const getStatusComponent = () => {
    if (
      controlData.status === "published" ||
      controlData.status === "not_published"
    ) {
      return (
        <FormControlLabel
          control={
            <ToggleSwitch
              color="success"
              checked={controlData.status === "published"}
            />
          }
          label={controlData.status === "published" ? "Enabled" : "Disabled"}
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
              Control {controlData.mitreControlId}
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
                setSelectedControl(controlData);
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
          {/* MITRE Control ID */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                MITRE Control ID
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {controlData.mitreControlId}
              </Typography>
            </Box>
          </Grid>

          {/* MITRE Control Name */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                MITRE Control Name
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {controlData.mitreControlName
                  ? controlData.mitreControlName
                  : "-"}
              </Typography>
            </Box>
          </Grid>

          {/* MITRE Control Type */}
          <Grid size={{ xs: 12 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                MITRE Control Type
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {controlData.mitreControlType
                  ? controlData.mitreControlType
                  : "-"}
              </Typography>
            </Box>
          </Grid>

          {/* NIST 2.0 Control Category ID */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                NIST 2.0 Control Category ID
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {controlData.nistControls?.[0]?.frameWorkControlCategoryId
                  ? controlData.nistControls?.[0]?.frameWorkControlCategoryId
                  : "-"}
              </Typography>
            </Box>
          </Grid>

          {/* NIST 2.0 Control Category */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                NIST 2.0 Control Category
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {controlData.nistControls?.[0]?.frameWorkControlCategory
                  ? controlData.nistControls?.[0]?.frameWorkControlCategory
                  : "-"}
              </Typography>
            </Box>
          </Grid>

          {/* NIST 2.0 Control Sub-category ID */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                NIST 2.0 Control Sub-category ID
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {controlData.nistControls?.[0]?.frameWorkControlSubCategoryId
                  ? controlData.nistControls?.[0]?.frameWorkControlSubCategoryId
                  : "-"}
              </Typography>
            </Box>
          </Grid>

          {/* NIST 2.0 Control Sub-category */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                NIST 2.0 Control Sub-category
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {controlData.nistControls?.[0]?.frameWorkControlSubCategory
                  ? controlData.nistControls?.[0]?.frameWorkControlSubCategory
                  : "-"}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>MITRE Technique ID</TableCell>
                      <TableCell>Sub Technique ID</TableCell>
                      <TableCell>MITRE Control Description</TableCell>
                      <TableCell>BluOcean Control Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {controlData.subControls?.map((control, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >
                          <TableCell>
                            {controlData.mitreControlId}.{index + 1}
                          </TableCell>
                          <TableCell>
                            {controlData.mitreControlId}.{index + 1}
                          </TableCell>
                          <TableCell>
                            {control.mitreControlDescription}
                          </TableCell>
                          <TableCell>
                            {control.bluOceanControlDescription}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
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

export default ViewControlModal;
