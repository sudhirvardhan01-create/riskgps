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
  Tabs,
  Tab,
} from "@mui/material";
import { useRouter } from "next/router";
import {
  FilterAltOutlined,
  ArrowBack,
  Search,
  AccountTree,
  ViewList,
} from "@mui/icons-material";
import MenuItemComponent from '@/components/MenuItemComponent'
import { DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material';
// import ConfirmDialog from "@/components/ConfirmDialog"
import React, { useEffect, useState } from 'react';

import { createProcess, deleteProcess, fetchProcesses, updateProcess, updateProcessStatus } from "@/pages/api/process";
import { fetchMetaDatas } from "@/pages/api/meta-data";
import ConfirmDialog from "@/components/ConfirmDialog";
import FilterComponent from "@/components/Library/FilterComponent";
import ToastComponent from "@/components/ToastComponent";
import withAuth from "@/hoc/withAuth";
import { ProcessAttributes, ProcessData } from "@/types/process";
import ProcessCard from "@/components/Library/Process/ProcessCard";
import ViewProcessModal from "@/components/Library/Process/ViewProcessModal";
import ProcessFormModal from "@/components/Library/Process/ProcessFormModal";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`process-tabpanel-${index}`}
      aria-labelledby={`process-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `process-tab-${index}`,
    "aria-controls": `process-tabpanel-${index}`,
  };
}

const ProcessLibraryPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalRows, setTotalRows] = useState(-1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const [processesData, setProcessesData] = useState<ProcessData[]>();
  const [metaDatas, setMetaDatas] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState<ProcessData | null>(
    null
  );
  const [isDeleteConfirmPopupOpen, setIsDeleteConfirmPopupOpen] =
    useState(false);
  const [isAddConfirmPopupOpen, setIsAddConfirmPopupOpen] = useState(false);
  const [isEditConfirmPopupOpen, setIsEditConfirmPopupOpen] = useState(false);
  const [isViewProcessOpen, setIsViewProcessOpen] = useState(false);
  const [isAddProcessoOpen, setIsAddProcessOpen] = useState(false);
  const [isEditProcessOpen, setIsEditProcessOpen] = useState(false);
  const [isSuccessToastOpen, setIsSuccessToastOpen] =
    useState(false);
  const [successToastMessage, setSuccessToastMessage] =
    useState("");
  const [processData, setProcessData] = useState<ProcessData>({
    processName: "",
    processDescription: "",
    seniorExecutiveOwnerName: "",
    seniorExecutiveOwnerEmail: "",
    operationsOwnerName: "",
    operationsOwnerEmail: "",
    technologyOwnerName: "",
    technologyOwnerEmail: "",
    organizationalRevenueImpactPercentage: 0,
    financialMateriality: false,
    thirdPartyInvolvement: "",
    users: "",
    requlatoryAndCompliance: "",
    criticalityOfDataProcessed: "",
    dataProcessed: "",
    processDependency: [],
    status: "",
  });
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  // New state for tabs
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Process ID (Ascending)");

  useEffect(() => {
    const getProcessesData = async () => {
      try {
        setLoading(true);
        const data = await fetchProcesses(0, 0);
        setProcessesData(data.data);
        // setTotalRows(data.totalCount || data.data.length);
      } catch (error) {
        console.error("Error fetching processes:", error);
      } finally {
        setLoading(false);
      }
    };
    getProcessesData();
  }, [refreshTrigger]);

  useEffect(() => {
    const getMetaDatas = async () => {
      try {
        setLoading(true);
        const data = await fetchMetaDatas();
        setMetaDatas(data);
      } catch (error) {
        console.error("Error fetching meta data:", error);
      } finally {
        setLoading(false);
      }
    };
    getMetaDatas();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateProcess = async (status: string) => {
    try {
      console.log("adding");
      console.log(processData);
    } catch (err) {
      console.log("Something went wrong", err);
    }

        try {
          const reqBody = processData;
          reqBody.status = status;
          const res = await createProcess(processData);
          console.log(res);
          setProcessData({
            processName: "",
            processDescription: "",
            seniorExecutiveOwnerName: "",
            seniorExecutiveOwnerEmail: "",
            operationsOwnerName: "",
            operationsOwnerEmail: "",
            technologyOwnerName: "",
            technologyOwnerEmail: "",
            organizationalRevenueImpactPercentage: 0,
            financialMateriality: false,
            thirdPartyInvolvement: "",
            users: "",
            requlatoryAndCompliance: "",
            criticalityOfDataProcessed: "",
            dataProcessed: "",
            processDependency: [],
            status: "",
          })
          setRefreshTrigger((prev) => prev + 1);
          setIsAddProcessOpen(false);
          setIsSuccessToastOpen(true);
          setSuccessToastMessage(`Success! The Process has been ${status === "published" ? "published" : "saved as a draft"}`)
        } catch (err) {
          console.log("Something went wrong", err);
        }
  };

  const handleUpdateProcess = async (status: string) => {
    try {
      if (selectedProcess?.id) {
        console.log(selectedProcess);
        const reqBody = selectedProcess;
        reqBody.status = status;
        const res = await updateProcess(
          reqBody.id as number,
          reqBody
        );
        console.log(res);
        setRefreshTrigger((prev) => prev + 1);
        setIsEditProcessOpen(false);
        setSuccessToastMessage(`Success! The Process has been ${status === "published" ? "published" : "saved as a draft"}`)
        setIsSuccessToastOpen(true);
        setSelectedProcess(null)
      } else {
        alert("Invalid operation");
      }
    } catch (err) {
      console.log("Something went wrong", err);
    }
  };

  const handleUpdateProcessStatus = async (id: number, status: string) => {
    try {
        const res = await updateProcessStatus(id, status);
        setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.log("Something went wrong", err);
    }
  };

  const handleDeleteProcess = async () => {
    try {
      if (selectedProcess?.id) {
        const res = await deleteProcess(
          selectedProcess?.id as number
        );
        console.log(res);
        setRefreshTrigger((prev) => prev + 1);
        setIsDeleteConfirmPopupOpen(false);
        setIsSuccessToastOpen(true);
        setSuccessToastMessage(`Success! The business process BP-${selectedProcess?.id} has been deleted`)
        setSelectedProcess(null);
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  // Filter and sort processes based on search and sort criteria
  const filteredAndSortedProcesses = React.useMemo(() => {
    if (!processesData) return [];

    const filtered = processesData.filter(
      (process) =>
        process.processName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.processDescription
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    // Apply sorting logic here based on sortBy value
    switch (sortBy) {
      case "Process ID (Ascending)":
        filtered.sort((a, b) => (a.id || 0) - (b.id || 0));
        break;
      case "Process ID (Descending)":
        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      case "Created (Latest to Oldest)":
        filtered.sort(
          (a, b) =>
            new Date(b.lastUpdated || 0).getTime() -
            new Date(a.lastUpdated || 0).getTime()
        );
        break;
      case "Created (Oldest to Latest)":
        filtered.sort(
          (a, b) =>
            new Date(a.lastUpdated || 0).getTime() -
            new Date(b.lastUpdated || 0).getTime()
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [processesData, searchTerm, sortBy]);

  // Paginated processes for current page
  const paginatedProcesses = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredAndSortedProcesses.slice(
      startIndex,
      startIndex + rowsPerPage
    );
  }, [filteredAndSortedProcesses, page, rowsPerPage]);

  return (
    <>
      {selectedProcess && isViewProcessOpen && (
        <ViewProcessModal
          open={isViewProcessOpen}
          processes={processesData as any[]}
          metaDatas={metaDatas}
          processData={selectedProcess}
          setIsEditProcessOpen={setIsEditProcessOpen}
          setSelectedProcess={setSelectedProcess}
          onClose={() => {
            setSelectedProcess(null);
            setIsViewProcessOpen(false);
          }}
        />
      )}

      {isAddProcessoOpen && (
        <ProcessFormModal
          operation={"create"}
          open={isAddProcessoOpen}
          processData={processData}
          setProcessData={setProcessData}
          processes={processesData as ProcessData[]}
          metaDatas={metaDatas}
          onSubmit={handleCreateProcess}
          onClose={() => {
            setIsAddConfirmPopupOpen(true);
          }}
        />
      )}

      {selectedProcess && isEditProcessOpen && (
        <ProcessFormModal
          operation={"edit"}
          open={isEditProcessOpen}
          processData={selectedProcess}
          setProcessData={(val) => {
            if (typeof val === "function") {
              setSelectedProcess((prev) => val(prev as ProcessData));
            } else {
              setSelectedProcess(val);
            }
          }}
          processes={processesData as ProcessData[]}
          metaDatas={metaDatas}
          onSubmit={handleUpdateProcess}
          onClose={() => {
            setIsEditConfirmPopupOpen(true);
          }}
        />
      )}

      {selectedProcess?.id && (
        <ConfirmDialog
          open={isDeleteConfirmPopupOpen}
          onClose={() => {
            setIsDeleteConfirmPopupOpen(false);
          }}
          title="Confirm Process Deletion?"
          description={
            "Are you sure you want to delete Process #" +
            selectedProcess?.id +
            "? All associated data will be removed from the system."
          }
          onConfirm={handleDeleteProcess}
          cancelText="Cancel"
          confirmText="Yes, Delete"
        />
      )}

      <ConfirmDialog
        open={isAddConfirmPopupOpen}
        onClose={() => {
          setIsAddConfirmPopupOpen(false);
        }}
        title="Cancel Process Creation?"
        description="Are you sure you want to cancel the process creation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsAddConfirmPopupOpen(false);
          setProcessData({
            processName: "",
            processDescription: "",
            seniorExecutiveOwnerName: "",
            seniorExecutiveOwnerEmail: "",
            operationsOwnerName: "",
            operationsOwnerEmail: "",
            technologyOwnerName: "",
            technologyOwnerEmail: "",
            organizationalRevenueImpactPercentage: 0,
            financialMateriality: false,
            thirdPartyInvolvement: "",
            users: "",
            requlatoryAndCompliance: "",
            criticalityOfDataProcessed: "",
            dataProcessed: "",
            processDependency: [],
            status: "",
          });
          setIsAddProcessOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <ToastComponent
        open={isSuccessToastOpen}
        onClose={() => setIsSuccessToastOpen(false)}
        message={successToastMessage}
        toastBorder="1px solid #147A50"
        toastColor="#147A50"
        toastBackgroundColor="#DDF5EB"
        toastSeverity="success"
      />

      <ConfirmDialog
        open={isEditConfirmPopupOpen}
        onClose={() => {
          setIsEditConfirmPopupOpen(false);
        }}
        title="Cancel Process Update?"
        description="Are you sure you want to cancel the process update? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsEditConfirmPopupOpen(false);
          setSelectedProcess(null);
          setIsEditProcessOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <FilterComponent
        items={["Published", "Draft", "Disabled"]}
        open={isOpenFilter}
        onClose={() => setIsOpenFilter(false)}
        onClear={() => setIsOpenFilter(false)}
        onApply={() => setIsOpenFilter(false)}
      />

      <Box p={2} sx={{ pb: 8 }}>
        <Box mb={3}>
          {/* Row 1: Breadcrumb + Add Button */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            spacing={2}
            sx={{ mb: 3 }}
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
                Process
              </Typography>
            </Stack>

            <Button
              onClick={() => {
                setIsAddProcessOpen(true);
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
              Add Process
            </Button>
          </Stack>

          {/* Tabs */}
          {/* <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="process tabs"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "16px",
                  minHeight: 48,
                  minWidth: 120,
                },
              }}
            >
              <Tab
                label="Process List"
                icon={<ViewList />}
                iconPosition="start"
                {...a11yProps(0)}
              />
              <Tab
                label="Dependencies"
                icon={<AccountTree />}
                iconPosition="start"
                {...a11yProps(1)}
              />
            </Tabs>
          </Box> */}

          {/* Tab Panel 0: Process List */}
          <TabPanel value={tabValue} index={0}>
            {/* Search + Sort + Filter Controls */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              useFlexGap
              flexWrap="wrap"
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              sx={{ mb: 3 }}
            >
              {/* Search Bar */}
              <TextField
                size="small"
                placeholder="Search by keywords"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
                  borderRadius: 1,
                  height: "40px",
                  width: { xs: "100%", sm: "33%" },
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
                <FormControl
                  sx={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 1,
                    minWidth: 200,
                  }}
                >
                  <InputLabel id="sort-processes">Sort</InputLabel>
                  <Select
                    size="small"
                    value={sortBy}
                    onChange={handleSortChange}
                    label="Sort"
                    labelId="sort-processes"
                  >
                    <MenuItem value="Process ID (Ascending)">
                      Process ID (Ascending)
                    </MenuItem>
                    <MenuItem value="Process ID (Descending)">
                      Process ID (Descending)
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

            {/* Process Cards */}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <Typography>Loading processes...</Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {paginatedProcesses && paginatedProcesses.length > 0 ? (
                  paginatedProcesses.map((item: ProcessData, index) => (
                    <div key={item.id || index}>
                      <ProcessCard
                        processData={item}
                        setSelectedProcess={setSelectedProcess}
                        setIsViewProcessOpen={setIsViewProcessOpen}
                        setIsEditProcessOpen={setIsEditProcessOpen}
                        setIsDeleteConfirmPopupOpen={
                          setIsDeleteConfirmPopupOpen
                        }
                        handleUpdateProcessStatus={handleUpdateProcessStatus}
                      />
                    </div>
                  ))
                ) : (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="h6" color="textSecondary">
                      No processes found
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {searchTerm
                        ? "Try adjusting your search criteria"
                        : "Get started by adding your first process"}
                    </Typography>
                  </Box>
                )}
              </Stack>
            )}

            {/* Pagination */}
            {filteredAndSortedProcesses.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 3,
                }}
              >
                <TablePagination
                  component="div"
                  count={filteredAndSortedProcesses.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[6, 12, 18, 24, 30]}
                  labelRowsPerPage="Processes per page:"
                />
              </Box>
            )}
          </TabPanel>

          {/* Tab Panel 1: Dependencies */}
          {/* <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Process Dependencies
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Visualize the relationships and dependencies between your
                processes and connected services.
              </Typography>
            </Box>
            <ProcessDependencyGraph processesData={processesData} />
          </TabPanel> */}
        </Box>
      </Box>
    </>
  );
};

export default ProcessLibraryPage;
