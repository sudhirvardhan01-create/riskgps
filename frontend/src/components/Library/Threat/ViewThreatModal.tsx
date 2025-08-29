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
import { ThreatForm } from "@/types/threat";

interface ViewThreatModalProps {
  open: boolean;
  threatData: ThreatForm;
  setIsEditThreatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedThreat: React.Dispatch<React.SetStateAction<ThreatForm | null>>;
  onClose: () => void;
}
const ViewThreatModal: React.FC<ViewThreatModalProps> = ({
  open,
  threatData,
  setIsEditThreatOpen,
  setSelectedThreat,
  onClose,
}: ViewThreatModalProps) => {
  const getStatusComponent = () => {
    if (
      threatData.status === "published" ||
      threatData.status === "not_published"
    ) {
      return (
        <FormControlLabel
          control={
            <ToggleSwitch
              color="success"
              checked={threatData.status === "published"}
            />
          }
          label={threatData.status === "published" ? "Enabled" : "Disabled"}
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
              Threat Technique {threatData.mitreTechniqueId}
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
                setSelectedThreat(threatData);
                setIsEditThreatOpen(true);
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
          {/* MITRE Platform */}
          <Grid size={{ xs: 12 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                MITRE Platform
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {threatData.platforms.join(", ")}
              </Typography>
            </Box>
          </Grid>

          {/* MITRE Technique Name */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                MITRE Technique Name
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {threatData.mitreTechniqueName ? threatData.mitreTechniqueName : "-"}
              </Typography>
            </Box>
          </Grid>

          {/* CIA Mapping */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                CIA Mapping
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {threatData.ciaMapping ? threatData.ciaMapping.join(", ") : "-"}
              </Typography>
            </Box>
          </Grid>

          {/* Sub Technique ID */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Sub Technique ID
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {threatData.subTechniqueId ? threatData.subTechniqueId : "-"}
              </Typography>
            </Box>
          </Grid>

          {/* Sub Technique Name */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Sub Technique Name
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {threatData.subTechniqueName ? threatData.subTechniqueName : "-"}
              </Typography>
            </Box>
          </Grid>

          {/* MITRE Control ID */}
          {/* <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                MITRE Control ID
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {threatData.mitreControlId ? threatData.mitreControlId : "-"}
              </Typography>
            </Box>
          </Grid> */}

          {/* MITRE Control Name */}
            {/* <Grid size={{ xs: 6 }}>
              <Box display={"flex"} flexDirection={"column"} gap={0.5}>
                <Typography variant="body2" color="#91939A" fontWeight={550}>
                  MITRE Control Name
                </Typography>
                <Typography
                  variant="body1"
                  color="text.primary"
                  fontWeight={500}
                >
                  {threatData.mitreControlName ? threatData.mitreControlName : "-"}
                </Typography>
              </Box>
            </Grid> */}

          {/* MITRE Control Type */}
          {/* <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                MITRE Control Type
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {threatData.mitreControlType ? threatData.mitreControlType : "-"}
              </Typography>
            </Box>
          </Grid> */}

          {/* MITRE Control Description */}
          {/* <Grid size={{ xs: 12 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                MITRE Control Description
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {threatData.mitreControlDescription ? threatData.mitreControlDescription : "-"}
              </Typography>
            </Box>
          </Grid> */}

          {/* BluOcean Control Description */}
          {/* <Grid size={{ xs: 12 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                BluOcean Control Description
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {threatData.bluOceanControlDescription ? threatData.bluOceanControlDescription : "-"}
              </Typography>
            </Box>
          </Grid> */}

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

export default ViewThreatModal;
