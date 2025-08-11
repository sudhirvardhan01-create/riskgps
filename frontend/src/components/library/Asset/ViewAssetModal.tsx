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
import { AssetForm } from "@/types/asset";

interface ViewAssetModalProps {
  open: boolean;
  processes: any[];
  metaDatas: any[];
  assetData: AssetForm;
  setIsEditAssetOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedAsset: React.Dispatch<React.SetStateAction<AssetForm | null>>;
  onClose: () => void;
}
const ViewAssetModal: React.FC<ViewAssetModalProps> = ({
  open,
  processes,
  metaDatas,
  assetData,
  setIsEditAssetOpen,
  setSelectedAsset,
  onClose,
}: ViewAssetModalProps) => {

  const getStatusComponent = () => {
    if (assetData.status === 'published' || assetData.status === 'not_published') {
      return <FormControlLabel control={<ToggleSwitch color="success" checked={assetData.status === 'published'}/>} label={assetData.status === "published" ? "Enabled" : "Disabled"} sx={{ width: 30, height: 18, marginLeft: '0 !important', gap: 1}} />;
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
            <Typography variant="h6">Risk Scenario {assetData.asset_code}</Typography>
            {getStatusComponent()}
          </Stack>

          <Box display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}>
            <IconButton onClick={() => {
              setSelectedAsset(assetData);
              setIsEditAssetOpen(true)
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
                Asset Name
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {assetData.assetName}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Asset Category
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {assetData.assetCategory}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Risk Description
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {assetData.assetName}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Risk Field 1
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {assetData.assetName ? assetData.assetName : "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Risk Field 2
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {assetData.assetName ? assetData.assetName : "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Process
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {assetData?.related_processes && assetData?.related_processes?.length > 0 ? assetData?.related_processes?.map((processId) => {
                  return processes?.find(process => process.id === processId)?.name
                }).join(", ") : "-"}
              </Typography>
            </Box>
          </Grid>
          {assetData?.attributes?.map((item, index) => (
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

export default ViewAssetModal;
