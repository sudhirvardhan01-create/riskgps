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
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  tabsClasses,
  Typography,
} from "@mui/material";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { ControlForm, MITREControlForm } from "@/types/control";
import { formatDate } from "@/utils/utility";
import { labels } from "@/utils/labels";
import ButtonTabs from "@/components/ButtonTabs";
import { useState } from "react";

interface ViewControlModalProps {
  open: boolean;
  controlData: MITREControlForm;
  setIsEditControlOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedControl: React.Dispatch<
    React.SetStateAction<MITREControlForm | null>
  >;
  onClose: () => void;
}
const ViewControlModal: React.FC<ViewControlModalProps> = ({
  open,
  controlData,
  setIsEditControlOpen,
  setSelectedControl,
  onClose,
}: ViewControlModalProps) => {
  const [selectedTab, setSelectedTab] = useState<string>(
    controlData.controlDetails[0]?.mitreControlName
  );
  const selectedSubControls = controlData.controlDetails.find(
    (item) => item.mitreControlName === selectedTab
  )?.subControls;

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

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
            {/* <IconButton
              sx={{ padding: 0 }}
              onClick={() => {
                setSelectedControl(controlData);
                setIsEditControlOpen(true);
              }}
            >
              <EditOutlined sx={{ color: "primary.main" }} />
            </IconButton> */}
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

          {/* MITRE Control Type */}
          <Grid size={{ xs: 6 }}>
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

          {/* Control Priority */}
          <Grid size={{ xs: 6 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                {labels.controlPriority}
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {controlData.controlPriority
                  ? controlData.controlPriority
                  : "-"}
              </Typography>
            </Box>
          </Grid>

          {/* {controlData.controlDetails.length > 1 && (
            <Grid size={{ xs: 12 }} mb={-2}>
              <ButtonTabs
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                items={controlData.controlDetails.map(
                  (item) => item.mitreControlName
                )}
              />
            </Grid>
          )} */}

          {controlData.controlDetails.length > 1 && (
            <Grid size={{ xs: 12 }} mt={-1}>
              <Tabs
                value={selectedTab}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  [`& .${tabsClasses.scrollButtons}`]: {
                    "&.Mui-disabled": { opacity: 0.3 },
                  },
                }}
              >
                {controlData.controlDetails.map((item) => (
                  <Tab
                    label={item.mitreControlName}
                    key={item.mitreControlName}
                    value={item.mitreControlName}
                  />
                ))}
              </Tabs>
            </Grid>
          )}

          {/* MITRE Control Name */}
          {controlData.controlDetails.length === 1 && (
            <Grid size={{ xs: 12 }}>
              <Box display={"flex"} flexDirection={"column"} gap={0.5}>
                <Typography variant="body2" color="#91939A" fontWeight={550}>
                  MITRE Control Name
                </Typography>
                <Typography
                  variant="body1"
                  color="text.primary"
                  fontWeight={500}
                >
                  {controlData.controlDetails[0]?.mitreControlName
                    ? controlData.controlDetails[0]?.mitreControlName
                    : "-"}
                </Typography>
              </Box>
            </Grid>
          )}

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
                    {selectedSubControls &&
                      selectedSubControls.map((control, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={index}
                          >
                            <TableCell>{control.mitreTechniqueId}</TableCell>
                            <TableCell>
                              {control?.subTechniqueId
                                ? control.subTechniqueId
                                : "-"}
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

      <DialogContent sx={{ paddingTop: 3, paddingBottom: 3 }}>
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
                {controlData.created_at
                  ? formatDate(controlData.created_at)
                  : "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Last Updated On
              </Typography>
              <Typography variant="body1" fontWeight={500} color="text.primary">
                {controlData.updated_at
                  ? formatDate(controlData.updated_at)
                  : "-"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ViewControlModal;
