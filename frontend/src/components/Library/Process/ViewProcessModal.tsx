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

interface ViewProcessModalProps {
  open: boolean;
  processes: ProcessData[];
  metaDatas: any[];
  processData: ProcessData;
  setIsEditProcessOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedProcess: React.Dispatch<React.SetStateAction<ProcessData | null>>;
  onClose: () => void;
}
const ViewProcessModal: React.FC<ViewProcessModalProps> = ({
  open,
  processes,
  metaDatas,
  processData,
  setIsEditProcessOpen,
  setSelectedProcess,
  onClose,
}: ViewProcessModalProps) => {

  const getStatusComponent = () => {
    if (processData.status === 'published' || processData.status === 'not_published') {
      return <FormControlLabel control={<ToggleSwitch color="success" checked={processData.status === 'published'}/>} label={processData.status === "published" ? "Enabled" : "Disabled"} sx={{ width: 30, height: 18, marginLeft: '0 !important', gap: 1}} />;
    }
    return (
      <Chip
        icon={<DoneOutlined />}
        label="Draft"
        variant="outlined"
        size="small"
        color="primary"
        sx={{ fontWeight: 500, borderRadius: 1 }}
      />
    );
  };

  const RelatedProcessesChips = () => {
  const relatedChips = processData?.processDependency?.map((relProc) => {
    const process = processes?.find((p) => p.id === relProc.targetProcessId);
    if (!process) return null;

    return (
      <Chip
        key={relProc.targetProcessId}
        label={`${process.processName}: ${relProc.relationshipType}`}
        variant="outlined"
        sx={{ mr: 1, mb: 1 }}
      />
    );
  }).filter(Boolean); 
  return (
    <Typography variant="body2" fontWeight={500}>
      {relatedChips && relatedChips.length > 0 ? (
        <Stack direction="row" flexWrap="wrap">
          {relatedChips}
        </Stack>
      ) : (
        '-'
      )}
    </Typography>
  )
}
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth slotProps={{
      paper: {
        sx: { borderRadius: 2 }
      }
    }}>
      <DialogTitle>
        <Stack
          display={"flex"}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack display={"flex"} direction="row" justifyContent={"center"} alignItems={"center"} gap={2}>
            <Typography variant="h6">Risk Scenario {processData.processCode}</Typography>
            {getStatusComponent()}
          </Stack>

          <Box display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}>
            <IconButton onClick={() => {
              setSelectedProcess(processData);
              setIsEditProcessOpen(true)
            }}>
              <EditOutlined sx={{ color: "primary.main" }} />
            </IconButton>
            <IconButton onClick={onClose}>
              <Close sx={{ color: "primary.main" }} />
            </IconButton>
          </Box>
        </Stack>
        <Divider sx={{ mt: 2, mb: 0.5 }}></Divider>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Process
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {processData.processName}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Process Description
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {processData.processDescription}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Senior Executive Owner Name
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {processData.seniorExecutiveOwnerName ? processData.seniorExecutiveOwnerName : "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Senior Executive Owner Email
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {processData.seniorExecutiveOwnerEmail ? processData.seniorExecutiveOwnerEmail : "-"}
              </Typography>
            </Box>
          </Grid>

        {/* Operation Owne Section */}
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Operation Owner Name
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {processData.operationsOwnerName ?? "-" }
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Operation Owner Email
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {processData.operationsOwnerEmail ?? "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Technology Owner Name
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {processData.technologyOwnerName ?? "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Technology Owner Email
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {processData.technologyOwnerEmail ?? "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Organizational Revenue Impact Percentage
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {processData.organizationalRevenueImpactPercentage ?? "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Financial Materiality
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {processData.financialMateriality ?? "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Thirdy Party Involvement
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {processData.thirdPartyInvolvement ?? "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Users
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {processData.users ?? "-"}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Regulatory & Compliance
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {processData.requlatoryAndCompliance ?? "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Criticality Of Data Processed
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {processData.criticalityOfDataProcessed ?? "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Data Process
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {processData.dataProcessed ?? "-"}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Dependent Process
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                <RelatedProcessesChips/>
              </Typography>
            </Box>
          </Grid>
          {processData?.attributes?.map((item, index) => (
            <Grid key={index} size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {metaDatas?.find(metaData => metaData.id === item.meta_data_key_id)?.label}
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {item.values.join(", ")}
              </Typography>
            </Box>
          </Grid>
          ))}
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{ backgroundColor: "rgba(231, 231, 232, 0.4)", p: '10px 16px', borderRadius: 1, mt: 2 }}
        >
          <Grid size={{ xs: 4 }}>
            <Box>
              <Typography variant="caption" color="#9BA1D7" fontWeight={550} fontSize={14}>
                Created By
              </Typography>
              <Typography variant="body2" fontWeight={400}>
                Person Name
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box mb={2}>
              <Typography variant="caption" color="#9BA1D7" fontWeight={550} fontSize={14}>
                Created On
              </Typography>
              <Typography variant="body2" fontWeight={400}>
                2 Jan 2024
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box mb={2}>
              <Typography variant="caption" color="#9BA1D7" fontWeight={550} fontSize={14}>
                Last Updated On
              </Typography>
              <Typography variant="body2" fontWeight={400}>
                8 Jan 2024
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProcessModal;
