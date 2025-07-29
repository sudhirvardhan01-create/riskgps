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
import { FilterAltOutlined, ArrowBack, Search, Filter } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import ViewRiskScenarioModal from "@/components/library/risk-scenario/ViewRiskScenarioModalPopup";
import RiskScenarioCard from "@/components/library/risk-scenario/RiskScenarioCard";
import RiskScenarioFormModal from "@/components/library/risk-scenario/RiskScenarioFormModal";
import {
  RiskScenarioAttributes,
  RiskScenarioData,
} from "@/types/risk-scenario";
import {
  createRiskScenario,
  deleteRiskScenario,
  fetchRiskScenarios,
  updateRiskScenario,
} from "@/pages/api/risk-scenario";
import { fetchProcesses } from "@/pages/api/process";
import { fetchMetaDatas } from "@/pages/api/meta-data";
import ConfirmDialog from "@/components/ConfirmDialog";
import FilterComponent from "@/components/library/FilterComponent";

const Index = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [riskScenarioData, setRiskScenarioData] =
    useState<RiskScenarioData[]>();
  const [processesData, setProcessesData] = useState([]);
  const [metaDatas, setMetaDatas] = useState([]);
  const [selectedRiskScenario, setSelectedRiskScenario] = useState<RiskScenarioData | null>(null);
  const [isDeleteConfirmPopupOpen, setIsDeleteConfirmPopupOpen] = useState(false);
  const [isViewRiskScenarioOpen, setIsViewRiskScenarioOpen] = useState(false);
  const [isAddRiskScenarioOpen, setIsAddRiskScenarioOpen] = useState(false);
  const [isEditRiskScenarioOpen, setIsEditRiskScenarioOpen] = useState(false);
  const [riskData, setRiskData] = useState<RiskScenarioData>({
    riskScenario: "",
    riskStatement: "",
    riskDescription: "",
    riskField1: "",
    riskField2: "",
    attributes: [
      { meta_data_key_id: null, values: [] },
    ] as RiskScenarioAttributes[],
  });
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  useEffect(() => {
    const getRiskScenariosData = async () => {
      try {
        setLoading(true);
        const data = await fetchRiskScenarios(page, rowsPerPage);
        setRiskScenarioData(data.data);
      } catch (error) {
        console.error("Error fetching risk scenarios:", error);
      } finally {
        setLoading(false);
      }
    };

    getRiskScenariosData();
  }, [page, rowsPerPage, refreshTrigger]);

  useEffect(() => {
    const getProcessesData = async () => {
      try {
        setLoading(true);
        const data = await fetchProcesses();
        setProcessesData(data);
      } catch (error) {
        console.error("Error fetching risk scenarios:", error);
      } finally {
        setLoading(false);
      }
    };
    getProcessesData();
  }, []);

  useEffect(() => {
    const getMetaDatas = async () => {
      try {
        setLoading(true);
        const data = await fetchMetaDatas();
        setMetaDatas(data);
      } catch (error) {
        console.error("Error fetching risk scenarios:", error);
      } finally {
        setLoading(false);
      }
    };
    getMetaDatas();
  }, []);

  const handleCreateRiskScenario = async () => {
    try {
      console.log(riskData);
      const res = await createRiskScenario(riskData);
      console.log(res);
      setRefreshTrigger((prev) => prev + 1);
      setIsAddRiskScenarioOpen(false);
      alert("created");
    } catch (err) {
      console.log("Something went wrong", err);
    }
  };

  const handleUpdateRiskScenario = async () => {
    try {
      if (selectedRiskScenario?.id) {
        console.log(selectedRiskScenario);
        const res = await updateRiskScenario(
          selectedRiskScenario.id as number,
          selectedRiskScenario
        );
        console.log(res);
        setRefreshTrigger((prev) => prev + 1);
        setIsEditRiskScenarioOpen(false);
        setSelectedRiskScenario(null);
        alert("updated");
      } else {
        alert("Invalid operation");
      }
    } catch (err) {
      console.log("Something went wrong", err);
    }
  };

  const handleDeleteRiskScenario = async () => {
    try {
      if (selectedRiskScenario?.id) {
        const res = await deleteRiskScenario(
          selectedRiskScenario?.id as number
        );
        console.log(res);
        setRefreshTrigger((prev) => prev + 1);
        setIsDeleteConfirmPopupOpen(false);
        alert("deleted");
      } else {
        throw new Error("Invalid ID");
      }
    } catch (err) {
      console.log("Something went wrong", err);
      alert("Failed to Delete");
    }
  };

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
      {selectedRiskScenario && isViewRiskScenarioOpen && (
        <ViewRiskScenarioModal
          riskScenarioData={selectedRiskScenario}
          setIsEditRiskScenarioOpen={setIsEditRiskScenarioOpen}
          setSelectedRiskScenario={setSelectedRiskScenario}
          processes={processesData}
          metaDatas={metaDatas}
          open={isViewRiskScenarioOpen}
          onClose={() => {
            setIsViewRiskScenarioOpen(false);
          }}
        />
      )}
      {selectedRiskScenario?.id && (
        <ConfirmDialog
          open={isDeleteConfirmPopupOpen}
          onClose={() => {
            setIsDeleteConfirmPopupOpen(false);
          }}
          title="Confirm Risk Scenario Deletion?"
          description= {"Are you sure you want to delete Risk Scenario #" + selectedRiskScenario?.id + "? All associated data will be removed from the system."}
          onConfirm={handleDeleteRiskScenario}
        />
      )}
      {isAddRiskScenarioOpen && (
        <RiskScenarioFormModal
          operation={"create"}
          open={isAddRiskScenarioOpen}
          riskData={riskData}
          setRiskData={setRiskData}
          processes={processesData}
          metaDatas={metaDatas}
          onSubmit={() => {
            handleCreateRiskScenario();
          }}
          onClose={() => {
            setIsAddRiskScenarioOpen(false);
          }}
        />
      )}

      {isEditRiskScenarioOpen && selectedRiskScenario && (
        <RiskScenarioFormModal
          operation={"edit"}
          open={isEditRiskScenarioOpen}
          riskData={selectedRiskScenario}
          processes={processesData}
          metaDatas={metaDatas}
          setRiskData={(val) => {
            if (typeof val === "function") {
              setSelectedRiskScenario((prev) => val(prev as RiskScenarioData));
            } else {
              setSelectedRiskScenario(val);
            }
          }}
          onSubmit={() => {
            handleUpdateRiskScenario();
          }}
          onClose={() => {
            setIsEditRiskScenarioOpen(false);
          }}
        />
      )}

      <FilterComponent items={['Published', 'Draft', 'Disabled']} open={isOpenFilter} onClose={() => setIsOpenFilter(false)} onClear={() => setIsOpenFilter(false)} onApply={() => setIsOpenFilter(false)}/>

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
              onClick={() => {
                setIsAddRiskScenarioOpen(true);
              }}
              variant="contained"
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
                onClick={() => setIsOpenFilter(true)}
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
          {riskScenarioData &&
            riskScenarioData?.length > 0 &&
            riskScenarioData?.map((item: RiskScenarioData, index) => (
              <div key={index}>
                <RiskScenarioCard
                  key={index}
                  riskScenarioData={item}
                  setIsViewRiskScenarioOpen={setIsViewRiskScenarioOpen}
                  setSelectedRiskScenario={setSelectedRiskScenario}
                  setIsEditRiskScenarioOpen={setIsEditRiskScenarioOpen}
                  setIsDeleteConfirmPopupOpen = {setIsDeleteConfirmPopupOpen}
                />
              </div>
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
