import { useEffect, useState, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import LibraryHeader from "@/components/Library/LibraryHeader";
import RiskScenarioList from "@/components/Library/RiskScenarioList";
import ToastComponent from "@/components/ToastComponent";
import ConfirmDialog from "@/components/ConfirmDialog";
import RiskScenarioFormModal from "@/components/Library/RiskScenario/RiskScenarioFormModal";
import ViewRiskScenarioModal from "@/components/Library/RiskScenario/ViewRiskScenarioModalPopup";
import {
  RiskScenarioData,
  RiskScenarioAttributes,
} from "@/types/risk-scenario";
import { RiskScenarioService } from "@/services/riskScenarioService";
import { fetchMetaDatas } from "@/pages/api/meta-data";
import { Filter } from "@/types/filter";
import { FileService } from "@/services/fileService";
import { ProcessService } from "@/services/processService";

const initialRiskData: RiskScenarioData = {
  riskScenario: "",
  riskStatement: "",
  riskDescription: "",
  ciaMapping: [],
  riskField1: "",
  riskField2: "",
  attributes: [] as RiskScenarioAttributes[],
};

const sortItems = [
  { label: "Risk ID (Ascending)", value: "riskCode:asc" },
  { label: "Risk ID (Descending)", value: "riskCode:desc" },
  { label: "Risk Name (Ascending)", value: "risk_scenario:asc" },
  { label: "Risk Name (Descending)", value: "risk_scenario:desc" },
  { label: "Created (Latest to Oldest)", value: "created_at:desc" },
  { label: "Created (Oldest to Latest)", value: "created_at:asc" },
  { label: "Updated (Latest to Oldest)", value: "updated_at:desc" },
  { label: "Updated (Oldest to Latest)", value: "updated_at:asc" },
];

const breadcrumbItems = [
  // keep the same breadcrumb behavior from original page
  {
    label: "Library",
    onClick: () => (window.location.href = "/library"),
    icon: <ArrowBack fontSize="small" />,
  },
  { label: "Risk Scenarios" },
];

export default function RiskScenarioContainer() {
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [sort, setSort] = useState<string>("riskCode:asc");
  const [searchPattern, setSearchPattern] = useState<string>();
  const [riskScenarioData, setRiskScenarioData] = useState<RiskScenarioData[]>(
    []
  );
  const [processesData, setProcessesData] = useState<any[]>([]);
  const [metaDatas, setMetaDatas] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  const [selectedRiskScenario, setSelectedRiskScenario] =
    useState<RiskScenarioData | null>(null);

  // modals / confirm / toast
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddConfirmOpen, setIsAddConfirmOpen] = useState(false);
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  const [formData, setFormData] = useState<RiskScenarioData>(initialRiskData);

  const [riskScenarioFilters, setRiskScenarioFilters] = useState<
    { key: string; name: string; values: string[] }[]
  >([]);
  //Related to Import/Export
  const [file, setFile] = useState<File | null>(null);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState<boolean>(false);

  // fetch list
  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await RiskScenarioService.fetch(
        page,
        rowsPerPage,
        searchPattern,
        sort,
        statusFilters,
        filters
      );
      setRiskScenarioData(data?.data ?? []);
      setTotalRows(data?.total ?? 0);
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to fetch risk scenarios",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchPattern, sort, statusFilters, filters]);

  useEffect(() => {
    loadList();
  }, [loadList, refreshTrigger]);

  // fetch processes & meta
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [processes, meta] = await Promise.all([
          ProcessService.fetchProcessesForListing(),
          fetchMetaDatas(),
        ]);
        setProcessesData(processes.data ?? []);
        setMetaDatas(meta.data ?? []);
        const industryMeta = meta.data?.find(
          (m: any) => m?.name?.toLowerCase() === "industry"
        );

        const baseFilters = [...riskScenarioFilters];

        if (
          industryMeta &&
          !baseFilters.some((f) => f.key === industryMeta.name)
        ) {
          baseFilters.push({
            key: industryMeta.name,
            name: industryMeta.name,
            values: industryMeta.supported_values ?? [],
          });
        }

        // update state
        setRiskScenarioFilters(baseFilters);
      } catch (err) {
        console.error(err);
        setToast({
          open: true,
          message: "Failed to fetch supporting data",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Create
  const handleCreate = async (status: string) => {
    try {
      const req = { ...formData, status };
      await RiskScenarioService.create(req);
      setFormData(initialRiskData);
      setIsAddOpen(false);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: `Success! Risk scenario ${
          status === "published" ? "published" : "saved as draft"
        }`,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to create risk scenario",
        severity: "error",
      });
    }
  };

  // Update
  const handleUpdate = async (status: string) => {
    try {
      if (!selectedRiskScenario?.id) throw new Error("Invalid selection");
      const body = { ...selectedRiskScenario, status };
      await RiskScenarioService.update(selectedRiskScenario.id as number, body);
      setIsEditOpen(false);
      setSelectedRiskScenario(null);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: "Risk scenario updated",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to update risk scenario",
        severity: "error",
      });
    }
  };

  // Update status only
  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await RiskScenarioService.updateStatus(id, status);
      setRefreshTrigger((p) => p + 1);
      setToast({ open: true, message: "Status updated", severity: "success" });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to update status",
        severity: "error",
      });
    }
  };

  // Delete
  const handleDelete = async () => {
    try {
      if (!selectedRiskScenario?.id) throw new Error("Invalid selection");
      await RiskScenarioService.delete(selectedRiskScenario.id as number);
      setIsDeleteConfirmOpen(false);
      setSelectedRiskScenario(null);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: `Deleted RS-${selectedRiskScenario?.id}`,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to delete risk scenario",
        severity: "error",
      });
    }
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //Function to export the risk scenario
  const handleExportRiskScenarios = async () => {
    try {
      await FileService.exportLibraryDataCSV("risk-scenario");
      setToast({
        open: true,
        message: `Risk scenario exported successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Error: unable to export the risk scenario",
        severity: "error",
      });
    }
  };

  //Function to import the process
  const handleImportRiskScenarios = async () => {
    try {
      if (!file) {
        throw new Error("File not found");
      }
      await FileService.importLibraryDataCSV("risk-scenario", file as File);
      setIsFileUploadOpen(false);
      setToast({
        open: true,
        message: `Risk scenario Imported successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Error: unable to download the import risk scenario from file",
        severity: "error",
      });
    }
  };

  //Function to download the process template file
  const handledownloadRiskScenarioTemplateFile = async () => {
    try {
      await FileService.dowloadCSVTemplate("risk-scenario");
      setToast({
        open: true,
        message: `Risk scenario template file downloaded successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Error: unable to download the risk scenario template file",
        severity: "error",
      });
    }
  };

  // memoize props used by list/header
  const headerProps = useMemo(
    () => ({
      breadcrumbItems,
      metaDatas: riskScenarioFilters,
      addButtonText: "Add Risk Scenario",
      addAction: () => setIsAddOpen(true),
      sortItems,
      fileUploadTitle: "Import Risk Scenarios",
      file,
      setFile,
      isFileUploadOpen,
      setIsFileUploadOpen,
      handleImport: handleImportRiskScenarios,
      handledownloadTemplateFile: handledownloadRiskScenarioTemplateFile,
      onImport: () => setIsFileUploadOpen(true),
      isImportRequired: true,
      onExport: () => handleExportRiskScenarios(),
      searchPattern,
      setSearchPattern,
      sort,
      setSort,
      statusFilters,
      setStatusFilters,
      filters,
      setFilters,
    }),
    [statusFilters, filters, metaDatas, file, isFileUploadOpen]
  );

  //Function for Form Validation
  const handleFormValidation = async (status: string) => {
    try {
      const res = await RiskScenarioService.fetch(
        0,
        1,
        formData.riskScenario.trim(),
        "id:asc"
      );
      if (
        res.data?.length > 0 &&
        res.data[0].riskScenario === formData.riskScenario.trim()
      ) {
        setToast({
          open: true,
          message: `Risk Scenario already exists`,
          severity: "error",
        });
      } else {
        handleCreate(status);
      }
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Failed to create risk scenario",
        severity: "error",
      });
    }
  };

  return (
    <>
      {/* View modal */}
      {selectedRiskScenario && isViewOpen && (
        <ViewRiskScenarioModal
          open={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          riskScenarioData={selectedRiskScenario}
          setIsEditRiskScenarioOpen={setIsEditOpen}
          setSelectedRiskScenario={setSelectedRiskScenario}
          processes={processesData}
          metaDatas={metaDatas}
        />
      )}

      {/* Add form */}
      {isAddOpen && (
        <RiskScenarioFormModal
          operation="create"
          open={isAddOpen}
          riskData={formData}
          setRiskData={setFormData}
          processes={processesData}
          metaDatas={metaDatas}
          onSubmit={handleFormValidation}
          // onSubmit={handleCreate}
          onClose={() => setIsAddConfirmOpen(true)}
        />
      )}

      {/* Edit form */}
      {isEditOpen && selectedRiskScenario && (
        <RiskScenarioFormModal
          operation="edit"
          open={isEditOpen}
          riskData={selectedRiskScenario}
          setRiskData={(val: any) => {
            if (typeof val === "function") {
              setSelectedRiskScenario((prev) => val(prev as RiskScenarioData));
            } else {
              setSelectedRiskScenario(val);
            }
          }}
          processes={processesData}
          metaDatas={metaDatas}
          onSubmit={handleUpdate}
          onClose={() => setIsEditConfirmOpen(true)}
        />
      )}

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={isAddConfirmOpen}
        onClose={() => setIsAddConfirmOpen(false)}
        title="Cancel Risk Scenario Creation?"
        description="Are you sure you want to cancel the risk scenario creation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsAddConfirmOpen(false);
          setFormData(initialRiskData);
          setIsAddOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <ConfirmDialog
        open={isEditConfirmOpen}
        onClose={() => setIsEditConfirmOpen(false)}
        title="Cancel Risk Scenario Updation?"
        description="Are you sure you want to cancel the risk scenario updation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsEditConfirmOpen(false);
          setSelectedRiskScenario(null);
          setIsEditOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Confirm Risk Scenario Deletion?"
        description={`Are you sure you want to delete Risk Scenario #${selectedRiskScenario?.riskCode}? All associated data will be removed from the system.`}
        onConfirm={handleDelete}
        cancelText="Cancel"
        confirmText="Yes, Delete"
      />

      {/* Page content */}
      <Box p={5}>
        <LibraryHeader {...headerProps} />
        <RiskScenarioList
          loading={loading}
          data={riskScenarioData}
          totalRows={totalRows}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          setSelectedRiskScenario={setSelectedRiskScenario}
          setIsViewOpen={setIsViewOpen}
          setIsEditOpen={setIsEditOpen}
          setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
          handleUpdateStatus={handleUpdateStatus}
        />
      </Box>

      <ToastComponent
        open={toast.open}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        message={toast.message}
        toastBorder={
          toast.severity === "success" ? "1px solid #147A50" : undefined
        }
        toastColor={toast.severity === "success" ? "#147A50" : undefined}
        toastBackgroundColor={
          toast.severity === "success" ? "#DDF5EB" : undefined
        }
        toastSeverity={toast.severity}
      />
    </>
  );
}
