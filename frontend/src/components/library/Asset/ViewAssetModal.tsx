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
  setIsEditAssetOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
    if (
      assetData.status === "published" ||
      assetData.status === "not_published"
    ) {
      return (
        <FormControlLabel
          control={
            <ToggleSwitch
              color="success"
              checked={assetData.status === "published"}
            />
          }
          label={assetData.status === "published" ? "Enabled" : "Disabled"}
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
        sx={{ fontWeight: 550, borderRadius: 1, color:"primary.main", width: "96px", "& .MuiChip-icon": {
          marginRight: "1px"
        }}}
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
              Asset {assetData.asset_code}
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
                setSelectedAsset(assetData);
                setIsEditAssetOpen(true);
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
          {/* Asset Name */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Asset Name
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {assetData.assetName}
              </Typography>
            </Box>
          </Grid>

          {/* Asset Category */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Asset Category
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {assetData.assetCategory}
              </Typography>
            </Box>
          </Grid>

          {/* Asset Description */}
          <Grid size={{ xs: 12 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Asset Description
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {assetData.assetDescription}
              </Typography>
            </Box>
          </Grid>

          {/* Asset Owner */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Asset Owner
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {assetData.assetOwner}
              </Typography>
            </Box>
          </Grid>

          {/* Asset IT Owner */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Asset IT Owner
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {assetData.assetITOwner}
              </Typography>
            </Box>
          </Grid>

          {/* Third Party Management */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Third Party Management
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {assetData.isThirdPartyManagement ? "Yes" : "No"}
              </Typography>
            </Box>
          </Grid>

          {/* Third Party Name */}
          {assetData.isThirdPartyManagement && (
            <Grid size={{ xs: 6 }}>
              <Box display={"flex"} flexDirection={"column"} gap={0.5}>
                <Typography variant="body2" color="#91939A" fontWeight={550}>
                  Third Party Name
                </Typography>
                <Typography
                  variant="body1"
                  color="text.primary"
                  fontWeight={500}
                >
                  {assetData.thirdPartyName}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Third Party Location */}
          {assetData.isThirdPartyManagement && (
            <Grid size={{ xs: 6 }}>
              <Box display={"flex"} flexDirection={"column"} gap={0.5}>
                <Typography variant="body2" color="#91939A" fontWeight={550}>
                  Third Party Location
                </Typography>
                <Typography
                  variant="body1"
                  color="text.primary"
                  fontWeight={500}
                >
                  {assetData.thirdPartyLocation}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Hosting */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Hosting
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {assetData.hosting}
              </Typography>
            </Box>
          </Grid>

          {/* Hosting Facility */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Hosting Facility
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {assetData.hostingFacility}
              </Typography>
            </Box>
          </Grid>

          {/* Cloud Service Provider */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Cloud Service Provider
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {assetData.cloudServiceProvider?.join(", ")}
              </Typography>
            </Box>
          </Grid>

          {/* Geographic Location */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Geographic Location
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {assetData.geographicLocation}
              </Typography>
            </Box>
          </Grid>

          {/* Redundancy */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Redundancy
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {assetData.isRedundancy ? "Yes" : "No"}
              </Typography>
            </Box>
          </Grid>

          {/* Databases */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Databases
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {assetData.databases}
              </Typography>
            </Box>
          </Grid>

          {/* Network Segmentation */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Network Segmentation
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {assetData.isNetworkSegmentation ? "Yes" : "No"}
              </Typography>
            </Box>
          </Grid>

          {/* Network Name */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Network Name
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {assetData.networkName}
              </Typography>
            </Box>
          </Grid>

          {/* Related Processes */}
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Process
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {assetData?.related_processes &&
                assetData?.related_processes?.length > 0
                  ? assetData?.related_processes
                      ?.map((processId) => {
                        return processes?.find(
                          (process) => process.id === processId
                        )?.name;
                      })
                      .join(", ")
                  : "-"}
              </Typography>
            </Box>
          </Grid>

          {/* Metadata */}
          {assetData?.attributes?.map((item, index) => (
            <Grid key={index} size={{ xs: 6 }}>
              <Box>
                <Typography variant="body2" color="#91939A" fontWeight={550}>
                  {
                    metaDatas?.find(
                      (metaData) => metaData.id === item.meta_data_key_id
                    )?.label
                  }
                </Typography>
                <Typography
                  variant="body1"
                  color="text.primary"
                  fontWeight={500}
                >
                  {item.values.join(", ")}
                </Typography>
              </Box>
            </Grid>
          ))}
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

export default ViewAssetModal;
