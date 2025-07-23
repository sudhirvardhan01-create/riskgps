import {
  Box,
  Typography,
  Stack,
  Select,
  MenuItem,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
  useMediaQuery,
  InputLabel,
  FormControl,
  TablePagination,
} from "@mui/material";
import { useRouter } from "next/router";
import { FilterAltOutlined, ArrowBack, Search } from "@mui/icons-material";
import React, { useState } from "react";

import ViewRiskScenarioModal from "@/components/library/risk-scenario/ViewRiskScenarioModalPopup";
import AddRiskScenarioModal from "@/components/library/risk-scenario/AddRiskScenarioModalPopup";
import RiskScenarioCard from "@/components/library/risk-scenario/RiskScenarioCard";

const riskData = [
  {
    id: "RS-8306439",
    industry: "Healthcare",
    title:
      "The Fund/Wire Transfer System is not working for extended period of time",
    tags: 4,
    processes: 3,
    assets: 15,
    threats: 10,
    lastUpdated: "08 Jan, 2024",
    status: "Enabled",
  },
  {
    id: "RS-8306439",
    industry: "Healthcare",
    title:
      "The Fund/Wire Transfer System is not working for extended period of time",
    tags: 4,
    processes: 3,
    assets: 15,
    threats: 10,
    lastUpdated: "08 Jan, 2024",
    status: "Draft",
  },
  {
    id: "RS-8306439",
    industry: "Healthcare",
    title:
      "Patients cannot avail diagnostic facility because the devices are not operational for an extended period of time",
    tags: 4,
    processes: 3,
    assets: 15,
    threats: 10,
    lastUpdated: "08 Jan, 2024",
    status: "Disabled",
  },
  {
    id: "RS-8306439",
    industry: "Healthcare",
    title:
      "Patients cannot avail diagnostic facility because the devices are not operational for an extended period of time",
    tags: 4,
    processes: 3,
    assets: 15,
    threats: 10,
    lastUpdated: "08 Jan, 2024",
    status: "Disabled",
  },
  // Add more cards as needed
];

const Index = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [viewRiskScenarioModal, setViewRiskScenarioModal] = useState(false);
  const [addRiskScenarioModal, setAddRiskScenarioModal] = useState(false)

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <ViewRiskScenarioModal
        open={viewRiskScenarioModal}
        onClose={() => {
          setViewRiskScenarioModal(false);
        }}
      />
      <AddRiskScenarioModal
        open={addRiskScenarioModal}
        onClose={() => {
          setAddRiskScenarioModal(false);
        }} />

      <Box p={2}>
        <Box mb={3}>
          {/* Row 1: Breadcrumb + Add Button */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton onClick={() => router.back()} size="small">
                <ArrowBack fontSize="small" />
              </IconButton>
              <Typography variant="body1" color="textPrimary">
                Library /
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "primary.main", fontWeight: 600 }}
              >
                Risk Scenarios
              </Typography>
            </Stack>

            <Button
              variant="contained"
              onClick={() => setAddRiskScenarioModal(true)}
              sx={{
                backgroundColor: "primary.main",
                textTransform: "none",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "#001080",
                },
              }}
            >
              Add Risk Scenario
            </Button>
          </Stack>

          {/* Row 2: Search + Sort + Filter */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            useFlexGap
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            {/* Search Bar */}
            <TextField
              size="small"
              placeholder="Search by keywords"
              variant="outlined"
              sx={{
                borderRadius: 1,
                height: "40px",
                width: "33%",
                minWidth: 200,
                backgroundColor: "#FFFFFF",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Right Controls */}
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              justifyContent={isMobile ? "flex-start" : "flex-end"}
            >
              <FormControl sx={{ backgroundColor: "#FFFFFF", borderRadius: 1 }}>
                <InputLabel id="sort-risk-scenarios">Sort</InputLabel>
                <Select
                  size="small"
                  defaultValue="Risk ID (Ascending)"
                  label="Sort"
                  labelId="sort-risk-scenarios"
                >
                  <MenuItem value="Risk ID (Ascending)">
                    Risk ID (Ascending)
                  </MenuItem>
                  <MenuItem value="Risk ID (Descending)">
                    Risk ID (Descending)
                  </MenuItem>
                  <MenuItem value="Created (Latest to Oldest)">
                    Created (Latest to Oldest)
                  </MenuItem>
                  <MenuItem value="Created (Oldest to Latest)">
                    Created (Oldest to Latest)
                  </MenuItem>
                  <MenuItem value="Updated (Latest to Oldest)">
                    Updated (Latest to Oldest)
                  </MenuItem>
                  <MenuItem value="Updated (Oldest to Latest)">
                    Updated (Oldest to Latest)
                  </MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                endIcon={<FilterAltOutlined />}
                sx={{
                  textTransform: "none",
                  borderColor: "#ccc",
                  color: "black",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 1,
                }}
              >
                Filter
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Stack spacing={2}>
          {riskData.map((item, index) => (
            <RiskScenarioCard key={index} {...item} />
          ))}
        </Stack>

        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TablePagination
            component="div"
            count={100}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[6, 12, 18, 24, 30]}
          />
        </Box>
      </Box>
    </>
  );
};

export default Index;
