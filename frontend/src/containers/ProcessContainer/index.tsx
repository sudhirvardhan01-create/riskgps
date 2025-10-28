import { useEffect, useState, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import LibraryHeader from "@/components/Library/LibraryHeader";
import ToastComponent from "@/components/ToastComponent";
import ConfirmDialog from "@/components/ConfirmDialog";
import { fetchMetaDatas } from "@/pages/api/meta-data";
import { ProcessData } from "@/types/process";
import ViewProcessModal from "@/components/Library/Process/ViewProcessModal";
import ProcessFormModal from "@/components/Library/Process/ProcessFormModal";
import { ProcessService } from "@/services/processService";
import ProcessList from "@/components/Library/ProcessList";
import { Filter } from "@/types/filter";
import { FileService } from "@/services/fileService";

const initialProcessData: ProcessData = {
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
  thirdPartyInvolvement: false,
  users: "",
  requlatoryAndCompliance: [],
  criticalityOfDataProcessed: "",
  dataProcessed: [],
  processDependency: [],
  status: "",
};

const sortItems = [
  { label: "Process ID (Ascending)", value: "processCode:asc" },
  { label: "Process ID (Descending)", value: "processCode:desc" },
  { label: "Created (Latest to Oldest)", value: "created_at:desc" },
  { label: "Created (Oldest to Latest)", value: "created_at:asc" },
  { label: "Updated (Latest to Oldest)", value: "updated_at:desc" },
  { label: "Updated (Oldest to Latest)", value: "updated_at:asc" },
  { label: "Process Name (Ascending)", value: "processName:asc" },
  { label: "Process Name (Descending)", value: "processName:desc" },

];

const breadcrumbItems = [
  // keep the same breadcrumb behavior from original page
  {
    label: "Library",
    onClick: () => (window.location.href = "/library"),
    icon: <ArrowBack fontSize="small" />,
  },
  { label: "Process" },
];

export default function ProcessContainer() {
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [sort, setSort] = useState<string>("processCode:asc");
  const [searchPattern, setSearchPattern] = useState<string>();
  const [processesData, setProcessesData] = useState<any[]>([]);
  const [metaDatas, setMetaDatas] = useState<any[]>([]);
  const [processForListing, setProcessForListing] = useState<any[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);

  const [selectedProcess, setSelectedProcess] = useState<ProcessData | null>(
    null
  );

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

  //Related to Import/Export
  const [file, setFile] = useState<File | null>(null);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<ProcessData>(initialProcessData);

  const [processFilters, setProcessFilters] = useState<
    { key: string; name: string; values: string[] }[]
  >([]);
  const loadList = useCallback(async () => {
    try {
      console.log(filters);
      setLoading(true);
      const data = await ProcessService.fetch(
        page,
        rowsPerPage,
        searchPattern as string,
        sort,
        statusFilters,
        filters
      );
      setProcessesData(data?.data ?? []);

      setTotalRows(data?.total ?? 0);
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to fetch process",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchPattern, sort, statusFilters, filters]);

  useEffect(() => {
    loadList();
  }, [loadList, refreshTrigger]);

  // fetch meta data
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [processesForListing, meta] = await Promise.all([
          ProcessService.fetchProcessesForListing(),
          fetchMetaDatas(),
        ]);
        setProcessForListing(processesForListing.data ?? []);
        setMetaDatas(meta.data ?? []);
        // find "Industry" metadata
        const industryMeta = meta.data?.find(
          (m: any) => m?.name?.toLowerCase() === "industry"
        );

        const baseFilters = [...processFilters];

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
        setProcessFilters(baseFilters);
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
      console.log(req);
      await ProcessService.create(req);
      setFormData(initialProcessData);
      setIsAddOpen(false);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: `Success! Process ${
          status === "published" ? "published" : "saved as draft"
        }`,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to create process",
        severity: "error",
      });
    }
  };

  // Update
  const handleUpdate = async (status: string) => {
    console.log(selectedProcess);
    try {
      if (!selectedProcess?.id) throw new Error("Invalid selection");
      const body = { ...selectedProcess, status };
      await ProcessService.update(selectedProcess.id as number, body);
      setIsEditOpen(false);
      setSelectedProcess(null);
      setRefreshTrigger((p) => p + 1);
      setToast({ open: true, message: "Process updated", severity: "success" });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to update process",
        severity: "error",
      });
    }
  };

  // Update status only
  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await ProcessService.updateStatus(id, status);
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
      if (!selectedProcess?.id) throw new Error("Invalid selection");
      await ProcessService.delete(selectedProcess.id as number);
      setIsDeleteConfirmOpen(false);
      setSelectedProcess(null);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: `Deleted BP-${selectedProcess?.id}`,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to delete process",
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

  //Function to export the assets
  const handleExportProcess = async () => {
    try {
      await FileService.exportLibraryDataCSV("process");
      setToast({
        open: true,
        message: `process exported successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Error: unable to export the process",
        severity: "error",
      });
    }
  };

  //Function to import the process
  const handleImportProcess = async () => {
    try {
      if (!file) {
        throw new Error("File not found");
      }
      await FileService.importLibraryDataCSV("process", file as File);
      setIsFileUploadOpen(false);
      setToast({
        open: true,
        message: `process Imported successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Error: unable to download the import process from file",
        severity: "error",
      });
    }
  };

  //Function to download the process template file
  const handledownloadProcessTemplateFile = async () => {
    try {
      await FileService.dowloadCSVTemplate("process");
      setToast({
        open: true,
        message: `process template file downloaded successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Error: unable to download the process template file",
        severity: "error",
      });
    }
  };
  // memoize props used by list/header
  const headerProps = useMemo(
    () => ({
      breadcrumbItems,
      metaDatas: processFilters,
      addButtonText: "Add Process",
      addAction: () => setIsAddOpen(true),
      sortItems,
      fileUploadTitle: "Import Processes",
      file,
      setFile,
      isFileUploadOpen,
      setIsFileUploadOpen,
      handleImport: handleImportProcess,
      handledownloadTemplateFile: handledownloadProcessTemplateFile,
      onImport: () => setIsFileUploadOpen(true),
      isImportRequired: true,
      onExport: () => handleExportProcess(),
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

  return (
    <>
      {/* View modal */}
      {selectedProcess && isViewOpen && (
        <ViewProcessModal
          open={isViewOpen}
          processes={processesData as any[]}
          processForListing={processForListing}
          metaDatas={metaDatas}
          processData={selectedProcess}
          setIsEditProcessOpen={setIsEditOpen}
          setSelectedProcess={setSelectedProcess}
          onClose={() => {
            setSelectedProcess(null);
            setIsViewOpen(false);
          }}
        />
      )}

      {/* Add form */}
      {isAddOpen && (
        <ProcessFormModal
          operation={"create"}
          open={isAddOpen}
          processData={formData}
          setProcessData={setFormData}
          processes={processesData as ProcessData[]}
          processForListing={processForListing as ProcessData[]}
          metaDatas={metaDatas}
          onSubmit={handleCreate}
          onClose={() => {
            setIsAddConfirmOpen(true);
          }}
        />
      )}

      {/* Edit form */}
      {isEditOpen && selectedProcess && (
        <ProcessFormModal
          operation={"edit"}
          open={isEditOpen}
          processData={selectedProcess}
          setProcessData={(val) => {
            if (typeof val === "function") {
              setSelectedProcess((prev) => val(prev as ProcessData));
            } else {
              setSelectedProcess(val);
            }
          }}
          processes={processesData as ProcessData[]}
          processForListing={processForListing as ProcessData[]}
          metaDatas={metaDatas}
          onSubmit={handleUpdate}
          onClose={() => {
            setIsEditConfirmOpen(true);
          }}
        />
      )}

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={isAddConfirmOpen}
        onClose={() => setIsAddConfirmOpen(false)}
        title="Cancel Process Creation?"
        description="Are you sure you want to cancel the process creation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsAddConfirmOpen(false);
          setFormData(initialProcessData);
          setIsAddOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <ConfirmDialog
        open={isEditConfirmOpen}
        onClose={() => setIsEditConfirmOpen(false)}
        title="Cancel Process Updation?"
        description="Are you sure you want to cancel the process updation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsEditConfirmOpen(false);
          setSelectedProcess(null);
          setIsEditOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Confirm Process Deletion?"
        description={`Are you sure you want to delete Process #${selectedProcess?.processCode}? All associated data will be removed from the system.`}
        onConfirm={handleDelete}
        cancelText="Cancel"
        confirmText="Yes, Delete"
      />

      {/* Page content */}
      <Box p={5}>
        {<LibraryHeader {...headerProps} />}
        <ProcessList
          loading={loading}
          data={processesData}
          totalRows={totalRows}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          setSelectedProcess={setSelectedProcess}
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
