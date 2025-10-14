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
import ToggleSwitch from "@/components/Library/ToggleSwitch/ToggleSwitch";
import { AssetForm } from "@/types/asset";
import { formatDate } from "@/utils/utility";

interface ViewQuestionnaireModalProps {
  open: boolean;
  recordData: AssetForm;
  setIsEditQuestionnaireOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRecord: React.Dispatch<React.SetStateAction<AssetForm | null>>;
  onClose: () => void;
}
const ViewQuestionnaireModal: React.FC<ViewQuestionnaireModalProps> = ({
  open,
  recordData,
  setIsEditQuestionnaireOpen,
  setSelectedRecord,
  onClose,
}: ViewQuestionnaireModalProps) => {
  const getStatusComponent = () => {
    if (
      recordData.status === "published" ||
      recordData.status === "not_published"
    ) {
      return (
        <FormControlLabel
          control={
            <ToggleSwitch
              color="success"
              checked={recordData.status === "published"}
            />
          }
          label={recordData.status === "published" ? "Enabled" : "Disabled"}
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
              Question {recordData.assetCode}
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
                setSelectedRecord(recordData);
                setIsEditQuestionnaireOpen(true);
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
          {/* Asset Category */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Asset Category
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {recordData.assetCategory ? recordData.assetCategory : "-"}
              </Typography>
            </Box>
          </Grid>

          {/* Question */}
          <Grid size={{ xs: 12 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Question
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {recordData.assetDescription
                  ? recordData.assetDescription
                  : "-"}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" fontWeight={600}>
              Mapping with MITRE Controls
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>MITRE Control ID</TableCell>
                    </TableRow>
                  </TableHead>
                  {/* <TableBody>
                    {controlFrameworkRecord.mitreControls?.map(
                      (control, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={index}
                          >
                            <TableCell>{control}</TableCell>
                          </TableRow>
                        );
                      }
                    )}
                  </TableBody> */}
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
                {recordData.createdAt ? formatDate(recordData.createdAt) : "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Last Updated On
              </Typography>
              <Typography variant="body1" fontWeight={500} color="text.primary">
                {recordData.updatedAt ? formatDate(recordData.updatedAt) : "-"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ViewQuestionnaireModal;
