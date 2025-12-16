// pages/reports/AssessmentSyncPage.tsx
import { useState, useCallback, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  LinearProgress,
  useTheme,
} from "@mui/material";
import {
  ArrowBack,
  Sync as SyncIcon,
  CheckCircle,
  ErrorOutline,
  InfoOutlined,
  Download as DownloadIcon, // 👈 add this
} from "@mui/icons-material";
import { SyncupService } from "@/services/syncupService";
import Cookies from "js-cookie";
import { getBusinessUnitSeverityData } from "@/utils/mockupData";

const AssessmentSyncPage: React.FC = () => {
  const theme = useTheme();

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [syncData, setSyncData] = useState<{
    businessUnits: number;
    businessProcesses: number;
    riskScenarios: number;
    assets: number;
    lastDayDateTime: string;
  } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    const cookieUser = Cookies.get("user");
    let orgIdVar: string | null = null;
    if (cookieUser) {
      const parsed = JSON.parse(cookieUser);
      orgIdVar = parsed?.orgId || parsed?.org_id || null;
      setOrgId(orgIdVar);
    }

    const fetchLastSyncDetails = async () => {
      try {
        if (orgIdVar == null) return;
        const data = await SyncupService.getLastSyncupDetails(orgIdVar);
        setSyncData(data);
        getBusinessUnitSeverityData(orgIdVar);

        setLastSyncedAt(new Date(data.lastDayDateTime).toLocaleString());
        setStatus("success");
        setStatusMessage("Fetched last sync details successfully.");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setStatusMessage("Failed to fetch last sync details.");
      }
    };

    fetchLastSyncDetails();
  }, [refreshTrigger]);

  // download handler for last sync data
  const handleDownloadLastSync = async () => {
    const cookieUser = Cookies.get("user");
    let orgIdVar: string | null = null;
    if (cookieUser) {
      const parsed = JSON.parse(cookieUser);
      orgIdVar = parsed?.orgId || parsed?.org_id || null;
      setOrgId(orgIdVar);
    }
    try {
      if (orgIdVar == null) return;
      await SyncupService.downloadLastSyncupData(orgIdVar);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setStatusMessage("Failed to dowmload last sync details.");
    }
  };

  // Sync handler
  const handleSync = useCallback(async () => {
    try {
      const cookieUser = Cookies.get("user");
      let orgIdVar: string | null = null;
      if (cookieUser) {
        const parsed = JSON.parse(cookieUser);
        orgIdVar = parsed?.orgId || parsed?.org_id || null;
        setOrgId(orgIdVar);
      }

      setIsSyncing(true);
      setStatus("idle");
      setStatusMessage("");

      if (orgIdVar == null) return;

      const data = await SyncupService.startSyncupJob(orgIdVar);
      await new Promise((res) => setTimeout(res, 1500));

      setRefreshTrigger((prev) => prev + 1);
      const nowISO = new Date().toISOString();

      let updatedSyncData = {
        businessUnits: 4,
        businessProcesses: 5,
        riskScenarios: 6,
        assets: 4,
        lastDayDateTime: nowISO,
      };
      if (data) {
        updatedSyncData = data;
      }

      setSyncData(updatedSyncData);
      setLastSyncedAt(new Date(nowISO).toLocaleString());

      setStatus("success");
      setStatusMessage(
        "Assessment details synced successfully. Reports will now reflect the latest data."
      );
    } catch (err) {
      console.error(err);
      setStatus("error");
      setStatusMessage("Failed to sync assessment details. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return (
    <Box
      sx={{
        overflow: "auto",
        maxHeight: "calc(100vh - 90px)",
        bgcolor: "#F5F6FA",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header / Breadcrumb row */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: { xs: 3, md: 4 } }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              variant="text"
              startIcon={<ArrowBack fontSize="small" />}
              onClick={() => (window.location.href = "/reports")}
              sx={{
                textTransform: "none",
                color: theme.palette.text.secondary,
              }}
            >
              Back to Reports
            </Button>
          </Stack>

          <Chip
            label={
              lastSyncedAt ? `Last synced: ${lastSyncedAt}` : "Not synced yet"
            }
            color={lastSyncedAt ? "primary" : "default"}
            variant={lastSyncedAt ? "filled" : "outlined"}
            sx={{ fontWeight: 500 }}
          />
        </Stack>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: { xs: 2, md: 3 },
            fontSize: { xs: "1.7rem", md: "2.1rem" },
          }}
        >
          Assessment Data Sync
        </Typography>

        {/* Main Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            p: { xs: 3, md: 4 },
            bgcolor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            mb: { xs: 3, md: 4 },
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
          >
            {/* Left: description and info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Sync assessment details for reporting
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                This action pulls the latest assessment information and prepares
                it for dashboards and PDF/Excel reports. Use this when new
                assessments are completed or existing ones are updated.
              </Typography>

              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <InfoOutlined
                  sx={{ color: theme.palette.info.main, mt: "3px" }}
                  fontSize="small"
                />
                <Typography variant="body2" color="text.secondary">
                  Syncing may take a few moments depending on the number of
                  assessments. You can continue working in other modules while
                  the sync runs in the background.
                </Typography>
              </Stack>
            </Box>

            {/* Right: action panel */}
            <Box
              sx={{
                width: { xs: "100%", md: 320 },
                borderRadius: 2,
                border: "1px solid #E5E7EB",
                bgcolor: "#F9FAFB",
                p: 3,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  textTransform: "uppercase",
                  color: "text.secondary",
                  mb: 1,
                }}
              >
                Sync status
              </Typography>

              {/* Status chip */}
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                {status === "success" && (
                  <CheckCircle sx={{ color: "#16A34A" }} fontSize="small" />
                )}
                {status === "error" && (
                  <ErrorOutline sx={{ color: "#DC2626" }} fontSize="small" />
                )}
                {status === "idle" && (
                  <SyncIcon sx={{ color: "text.secondary" }} fontSize="small" />
                )}

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color:
                      status === "success"
                        ? "#16A34A"
                        : status === "error"
                        ? "#DC2626"
                        : "text.secondary",
                  }}
                >
                  {status === "success"
                    ? "Last sync completed"
                    : status === "error"
                    ? "Last sync failed"
                    : "Ready to sync"}
                </Typography>
              </Stack>

              {statusMessage && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {statusMessage}
                </Typography>
              )}

              {isSyncing && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    Sync in progress…
                  </Typography>
                </Box>
              )}

              <Stack spacing={1.5}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SyncIcon />}
                  disabled={isSyncing}
                  onClick={handleSync}
                  sx={{
                    py: 1.2,
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  {isSyncing ? "Syncing…" : "Sync Assessment Data"}
                </Button>

                {/* New download button */}
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  disabled={!syncData}
                  onClick={handleDownloadLastSync}
                  sx={{
                    py: 1,
                    fontWeight: 500,
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Download last sync data
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {status === "success" && syncData && (
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              p: { xs: 3, md: 4 },
              bgcolor: "#FFFFFF",
              border: "1px solid #E5E7EB",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Summary from latest sync
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  sm: "repeat(4, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              {[
                {
                  label: "Business Units found",
                  value: syncData.businessUnits,
                },
                {
                  label: "Business Processes found",
                  value: syncData.businessProcesses,
                },
                {
                  label: "Risk Scenarios found",
                  value: syncData.riskScenarios,
                },
                { label: "Assets found", value: syncData.assets },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 90,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default AssessmentSyncPage;
