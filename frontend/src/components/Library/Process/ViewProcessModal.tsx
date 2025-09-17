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
import { ProcessData } from "@/types/process";
import { formatDate } from "@/utils/utility";

interface ViewProcessModalProps {
  open: boolean;
  processes: ProcessData[];
  processForListing: ProcessData[];
  metaDatas: any[];
  processData: ProcessData;
  setIsEditProcessOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedProcess: React.Dispatch<React.SetStateAction<ProcessData | null>>;
  onClose: () => void;
}
const ViewProcessModal: React.FC<ViewProcessModalProps> = ({
  open,
  processes,
  metaDatas,
  processData,
  processForListing,
  setIsEditProcessOpen,
  setSelectedProcess,
  onClose,
}: ViewProcessModalProps) => {
  const getStatusComponent = () => {
    if (
      processData.status === "published" ||
      processData.status === "not_published"
    ) {
      return (
        <FormControlLabel
          control={
            <ToggleSwitch
              color="success"
              checked={processData.status === "published"}
            />
          }
          label={processData.status === "published" ? "Enabled" : "Disabled"}
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

  const RelatedProcessesChips = () => {
    const relatedChips = processData?.processDependency
      ?.map((relProc) => {
        let process = null;
        let relationType = null;
        let key = null;
        if (relProc.targetProcessId === processData.id) {
          key = relProc.sourceProcessId;
          process = processForListing?.find(
            (p) => p.id === relProc.sourceProcessId
          );
          relationType =
            relProc.relationshipType === "follows" ? "precedes" : "follows";
        } else {
          key = relProc.targetProcessId;
          process = processForListing?.find(
            (p) => p.id === relProc.targetProcessId
          );
          relationType = relProc.relationshipType;
        }
        if (!process || !relationType) return null;

        return (
          <Chip
            key={key}
            label={`${process.processName}: ${relationType}`}
            variant="outlined"
            sx={{ mr: 1, mb: 1 }}
          />
        );
      })
      .filter(Boolean);

    return (
      <Typography variant="body2" fontWeight={500}>
        {relatedChips && relatedChips.length > 0 ? (
          <Stack direction="row" flexWrap="wrap">
            {relatedChips}
          </Stack>
        ) : (
          "-"
        )}
      </Typography>
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
              Process {processData.processCode}
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
                setSelectedProcess(processData);
                setIsEditProcessOpen(true);
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
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Process
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {processData.processName}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Process Description
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {processData.processDescription}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Senior Executive Owner Name
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {processData.seniorExecutiveOwnerName}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Senior Executive Owner Email
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {processData.seniorExecutiveOwnerEmail}
              </Typography>
            </Box>
          </Grid>

          {/* Operation Ownee Section */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Operation Owner Name
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {processData.operationsOwnerName}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Operation Owner Email
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {processData.operationsOwnerEmail}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Technology Owner Name
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {processData.technologyOwnerName}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Technology Owner Email
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {processData.technologyOwnerEmail}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Organizational Revenue Impact Percentage
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {processData.organizationalRevenueImpactPercentage}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Financial Materiality
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {processData.financialMateriality ? "Yes" : "No"}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Thirdy Party Involvement
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {processData.thirdPartyInvolvement ? "Yes" : "No"}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Users
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {processData.users}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Regulatory & Compliance
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {processData.requlatoryAndCompliance}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Criticality Of Data Processed
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {processData.criticalityOfDataProcessed}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Data Processed
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {(processData.dataProcessed ?? []).join(", ")}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Dependent Process
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                <RelatedProcessesChips />
              </Typography>
            </Box>
          </Grid>
          {processData?.attributes?.map((item, index) => (
            <Grid key={index} size={{ xs: 6 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {
                    metaDatas?.find(
                      (metaData) => metaData.id === item.meta_data_key_id
                    )?.label
                  }
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {item.values.join(", ")}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogContent sx={{ paddingTop: 3, paddingBottom: 6 }}>
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
                {processData.createdAt ? formatDate(processData.createdAt) : "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Last Updated On
              </Typography>
              <Typography variant="body1" fontWeight={500} color="text.primary">
                {processData.lastUpdated ? formatDate(processData.lastUpdated) : "-"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProcessModal;
