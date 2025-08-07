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
import React, { useEffect, useState } from "react";
import ViewRiskScenarioModal from "@/components/library/risk-scenario/ViewRiskScenarioModalPopup";
import LibraryCard from "@/components/library/LibraryCard";
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
  updateRiskScenarioStatus,
} from "@/pages/api/risk-scenario";
import { fetchProcesses } from "@/pages/api/process";
import { fetchMetaDatas } from "@/pages/api/meta-data";
import ConfirmDialog from "@/components/ConfirmDialog";
import FilterComponent from "@/components/library/FilterComponent";
import ToastComponent from "@/components/ToastComponent";
import withAuth from "@/hoc/withAuth";
import LibraryHeader from "@/components/library/LibraryHeader";

const Index = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalRows, setTotalRows] = useState(-1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [riskScenarioData, setRiskScenarioData] =
    useState<RiskScenarioData[]>();
  const [processesData, setProcessesData] = useState([]);
  const [metaDatas, setMetaDatas] = useState([]);
  const [selectedRiskScenario, setSelectedRiskScenario] =
    useState<RiskScenarioData | null>(null);
  const [isDeleteConfirmPopupOpen, setIsDeleteConfirmPopupOpen] =
    useState(false);
  const [isAddConfirmPopupOpen, setIsAddConfirmPopupOpen] = useState(false);
  const [isEditConfirmPopupOpen, setIsEditConfirmPopupOpen] = useState(false);
  const [isViewRiskScenarioOpen, setIsViewRiskScenarioOpen] = useState(false);
  const [isAddRiskScenarioOpen, setIsAddRiskScenarioOpen] = useState(false);
  const [isEditRiskScenarioOpen, setIsEditRiskScenarioOpen] = useState(false);
  const [isAddDeleteRSSuccessToastOpen, setIsAddDeleteRSSuccessToastOpen] =
    useState(false);
  const [addDeleteRSSuccessToastMessage, setAddDeleteRSSuccessToastMessage] =
    useState("");
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

  const sortItems = [
    { label: "Risk ID (Ascending)", value: "risk_asc" },
    { label: "Risk ID (Descending)", value: "risk_desc" },
    { label: "Created (Latest to Oldest)", value: "created_lto" },
    { label: "Created (Oldest to Latest)", value: "created_otl" },
    { label: "Updated (Latest to Oldest)", value: "updated_lto" },
    { label: "Updated (Oldest to Latest)", value: "updated_otl" },
  ];

  const breadcrumbItems = [
    {
      label: "Library",
      onClick: () => router.push("/library"),
      icon: <ArrowBack fontSize="small" />,
    },
    { label: "Risk Scenarios" },
  ];

  useEffect(() => {
    const getRiskScenariosData = async () => {
      try {
        setLoading(true);
        const data = await fetchRiskScenarios(page, rowsPerPage);
        setRiskScenarioData(data.data);
        setTotalRows(data.total);
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

  const handleCreateRiskScenario = async (status: string) => {
    try {
      const reqBody = riskData;
      reqBody.status = status;
      const res = await createRiskScenario(reqBody);
      console.log(res);
      setRiskData({
        riskScenario: "",
        riskStatement: "",
        riskDescription: "",
        riskField1: "",
        riskField2: "",
        attributes: [
          { meta_data_key_id: null, values: [] },
        ] as RiskScenarioAttributes[],
      });
      setRefreshTrigger((prev) => prev + 1);
      setIsAddRiskScenarioOpen(false);
      //alert("created");
      setIsAddDeleteRSSuccessToastOpen(true);
      setAddDeleteRSSuccessToastMessage(
        `Success! The risk scenario RS-ID has been ${
          status === "published" ? "published" : "saved as a draft"
        }`
      );
    } catch (err) {
      console.log("Something went wrong", err);
    }
  };

  const handleUpdateRiskScenario = async (status: string) => {
    try {
      if (selectedRiskScenario?.id) {
        console.log(selectedRiskScenario);
        const reqBody = selectedRiskScenario;
        reqBody.status = status;
        const res = await updateRiskScenario(reqBody.id as number, reqBody);
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

  const handleUpdateRiskScenarioStatus = async (id: number, status: string) => {
    try {
      const res = await updateRiskScenarioStatus(id, status);
      console.log(res);
      setRefreshTrigger((prev) => prev + 1);
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
        setIsAddDeleteRSSuccessToastOpen(true);
        setAddDeleteRSSuccessToastMessage(
          `Success! The risk scenario RS-${selectedRiskScenario?.id} has been deleted`
        );
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
          description={
            "Are you sure you want to delete Risk Scenario #" +
            selectedRiskScenario?.id +
            "? All associated data will be removed from the system."
          }
          onConfirm={handleDeleteRiskScenario}
          cancelText="Cancel"
          confirmText="Yes, Delete"
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
          onSubmit={handleCreateRiskScenario}
          onClose={() => {
            setIsAddConfirmPopupOpen(true);
          }}
        />
      )}

      <ConfirmDialog
        open={isAddConfirmPopupOpen}
        onClose={() => {
          setIsAddConfirmPopupOpen(false);
        }}
        title="Cancel Risk Scenario Creation?"
        description="Are you sure you want to cancel the risk scenario creation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsAddConfirmPopupOpen(false);
          setRiskData({
            riskScenario: "",
            riskStatement: "",
            riskDescription: "",
            riskField1: "",
            riskField2: "",
            attributes: [
              { meta_data_key_id: null, values: [] },
            ] as RiskScenarioAttributes[],
          });
          setIsAddRiskScenarioOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <ToastComponent
        open={isAddDeleteRSSuccessToastOpen}
        onClose={() => setIsAddDeleteRSSuccessToastOpen(false)}
        message={addDeleteRSSuccessToastMessage}
        toastBorder="1px solid #147A50"
        toastColor="#147A50"
        toastBackgroundColor="#DDF5EB"
        toastSeverity="success"
      />

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
          onSubmit={handleUpdateRiskScenario}
          onClose={() => {
            setIsEditConfirmPopupOpen(true);
          }}
        />
      )}

      <ConfirmDialog
        open={isEditConfirmPopupOpen}
        onClose={() => {
          setIsEditConfirmPopupOpen(false);
        }}
        title="Cancel Risk Scenario Updation?"
        description="Are you sure you want to cancel the risk scenario updation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsEditConfirmPopupOpen(false);
          setSelectedRiskScenario(null);
          setIsEditRiskScenarioOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <Box p={2} sx={{ pb: 8 }}>
        <LibraryHeader
          breadcrumbItems={breadcrumbItems}
          addButtonText={"Add Risk Scenario"}
          addAction={() => {
            setIsAddRiskScenarioOpen(true);
          }}
          sortItems={sortItems}
        />

        <Stack spacing={2}>
          {riskScenarioData &&
            riskScenarioData?.length > 0 &&
            riskScenarioData?.map((item: RiskScenarioData, index) => (
              <div key={index}>
                <LibraryCard
                  key={index}
                  libraryData={item}
                  handleUpdateRiskScenarioStatus={
                    handleUpdateRiskScenarioStatus
                  }
                  setIsViewRiskScenarioOpen={setIsViewRiskScenarioOpen}
                  setSelectedRiskScenario={setSelectedRiskScenario}
                  setIsEditRiskScenarioOpen={setIsEditRiskScenarioOpen}
                  setIsDeleteConfirmPopupOpen={setIsDeleteConfirmPopupOpen}
                  title={item.risk_code ?? ""}
                  desc={item.riskDescription}
                  chip={
                    item.industry?.length > 0
                      ? item.industry?.join(",")
                      : "Not Defined"
                  }
                  status={item.status ?? ""}
                  lastUpdated={item.lastUpdated ?? ""}
                  tagItems={[
                    {
                      label: "Tags",
                      value: item.tags,
                    },
                    {
                      label: "Processes",
                      value: item.related_processes,
                    },
                    {
                      label: "Assets",
                      value: item.assets,
                    },
                    {
                      label: "Threats",
                      value: item.threats,
                    },
                  ]}
                />
              </div>
            ))}
        </Stack>

        {/* Pagination */}
        <Box
          sx={{
            // marginBottom:"20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TablePagination
            component="div"
            count={totalRows}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[2, 6, 12, 18, 24, 30]}
          />
        </Box>
      </Box>
    </>
  );
};

export default Index;
