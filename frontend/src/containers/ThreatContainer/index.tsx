import { useEffect, useState, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import LibraryHeader from "@/components/Library/LibraryHeader";
import ToastComponent from "@/components/ToastComponent";
import ConfirmDialog from "@/components/ConfirmDialog";
import ThreatFormModal from "@/components/Library/Threat/ThreatFormModal";
import ViewThreatModal from "@/components/Library/Threat/ViewThreatModal";
import { fetchMetaDatas } from "@/pages/api/meta-data";
import { Filter } from "@/types/filter";
import ThreatList from "@/components/Library/Threat/ThreatList";
import { ThreatForm } from "@/types/threat";
import { ThreatService } from "@/services/threatService";
import { FileService } from "@/services/fileService";

const initialThreatFormData: ThreatForm = {
  platforms: [],
  mitreTechniqueId: "",
  mitreTechniqueName: "",
  ciaMapping: [],
  subTechniqueId: "",
  subTechniqueName: "",
};

const sortItems = [
  { label: "ID (Ascending)", value: "id:asc" },
  { label: "ID (Descending)", value: "id:desc" },
  {
    label: "MITRE Technique Name (Ascending)",
    value: "mitreTechniqueName:asc",
  },
  {
    label: "MITRE Technique Name (Descending)",
    value: "mitreTechniqueName:desc",
  },
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
  { label: "Threats" },
];

export default function ThreatContainer() {
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [sort, setSort] = useState<string>("id:asc");
  const [searchPattern, setSearchPattern] = useState<string>();
  const [threatsData, setThreatsData] = useState<ThreatForm[]>([]);
  const [metaDatas, setMetaDatas] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  const [selectedThreat, setSelectedThreat] = useState<ThreatForm | null>(null);

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

  const [formData, setFormData] = useState<ThreatForm>(initialThreatFormData);

  //Related to Import/Export
  const [file, setFile] = useState<File | null>(null);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState<boolean>(false);

  // fetch list
  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ThreatService.fetch(
        page,
        rowsPerPage,
        searchPattern as string,
        sort
      );
      setThreatsData(data?.data ?? []);
      setTotalRows(data?.total ?? 0);
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to fetch threats",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchPattern, sort]);

  useEffect(() => {
    loadList();
  }, [loadList, refreshTrigger]);

  console.log(threatsData);

  // fetch metadata
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const meta = await fetchMetaDatas();
        setMetaDatas(meta.data ?? []);
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
  //   const handleCreate = async (status: string) => {
  //     try {
  //       const req = { ...assetFormData, status };
  //       await AssetService.create(req);
  //       setAssetFormData(initialAssetFormData);
  //       setIsAddOpen(false);
  //       setRefreshTrigger((p) => p + 1);
  //       setToast({
  //         open: true,
  //         message: `Success! Asset ${
  //           status === "published" ? "published" : "saved as draft"
  //         }`,
  //         severity: "success",
  //       });
  //     } catch (err) {
  //       console.error(err);
  //       setToast({
  //         open: true,
  //         message: "Failed to create asset",
  //         severity: "error",
  //       });
  //     }
  //   };

  // Update
  //   const handleUpdate = async (status: string) => {
  //     try {
  //       if (!selectedAsset?.id) throw new Error("Invalid selection");
  //       const body = { ...selectedAsset, status };
  //       await AssetService.update(selectedAsset.id as number, body);
  //       setIsEditOpen(false);
  //       setSelectedAsset(null);
  //       setRefreshTrigger((p) => p + 1);
  //       setToast({
  //         open: true,
  //         message: "Asset updated",
  //         severity: "success",
  //       });
  //     } catch (err) {
  //       console.error(err);
  //       setToast({
  //         open: true,
  //         message: "Failed to update asset",
  //         severity: "error",
  //       });
  //     }
  //   };

  // Update status only
  //   const handleUpdateStatus = async (id: number, status: string) => {
  //     try {
  //       await AssetService.updateStatus(id, status);
  //       setRefreshTrigger((p) => p + 1);
  //       setToast({ open: true, message: "Status updated", severity: "success" });
  //     } catch (err) {
  //       console.error(err);
  //       setToast({
  //         open: true,
  //         message: "Failed to update status",
  //         severity: "error",
  //       });
  //     }
  //   };

  // Delete
  const handleDelete = async () => {
    try {
      if (!selectedThreat?.mitreTechniqueId)
        throw new Error("Invalid selection");
      if (selectedThreat?.subTechniqueId !== "") {
        await ThreatService.delete(
          selectedThreat.mitreTechniqueId as string,
          selectedThreat.subTechniqueId as string
        );
      } else {
        await ThreatService.delete(selectedThreat.mitreTechniqueId as string, "");
      }
      setIsDeleteConfirmOpen(false);
      setSelectedThreat(null);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: `Deleted`,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to delete threat",
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

  //Function to export the threats
  const handleExportThreats = async () => {
    try {
      await FileService.exportLibraryDataCSV("mitre-threats-controls");
      setToast({
        open: true,
        message: `Threats exported successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Error: unable to export the threats",
        severity: "error",
      });
    }
  };

  //Function to import the threats
  const handleImportThreats = async () => {
    try {
      if (!file) {
        throw new Error("File not found");
      }
      await FileService.importLibraryDataCSV(
        "mitre-threats-controls",
        file as File
      );
      setIsFileUploadOpen(false);
      setToast({
        open: true,
        message: `Threats Imported successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Error: unable to download the threats from file",
        severity: "error",
      });
    }
  };

  //Function to download the threats template file
  const handledownloadThreatsTemplateFile = async () => {
    try {
      await FileService.dowloadCSVTemplate("mitre-threats-controls");
      setToast({
        open: true,
        message: `Threats template file downloaded successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Error: unable to download the threats template file",
        severity: "error",
      });
    }
  };

  // memoize props used by list/header
  const headerProps = useMemo(
    () => ({
      breadcrumbItems,
      metaDatas,
      addButtonText: "Add Threat",
      addAction: () => setIsAddOpen(true),
      sortItems,
      onImport: () => setIsFileUploadOpen(true),
      onExport: () => handleExportThreats(),
      fileUploadTitle: "Import Threats",
      file,
      setFile,
      isFileUploadOpen,
      setIsFileUploadOpen,
      handleImport: handleImportThreats,
      handledownloadTemplateFile: handledownloadThreatsTemplateFile,
      isImportRequired: true,
      isExportRequired: true,
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
  //   const handleFormValidation = async (status: string) => {
  //     try {
  //       const res = await AssetService.fetch(
  //         0,
  //         1,
  //         assetFormData.applicationName.trim(),
  //         "asset_code:asc"
  //       );
  //       if (
  //         res.data?.length > 0 &&
  //         res.data[0].applicationName === assetFormData.applicationName.trim()
  //       ) {
  //         setToast({
  //           open: true,
  //           message: `Asset Name already exists`,
  //           severity: "error",
  //         });
  //       } else {
  //         handleCreate(status);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       setToast({
  //         open: true,
  //         message: "Failed to create asset",
  //         severity: "error",
  //       });
  //     }
  //   };

  return (
    <>
      {/* View modal */}
      {selectedThreat && isViewOpen && (
        <ViewThreatModal
          threatData={selectedThreat}
          setIsEditThreatOpen={setIsEditOpen}
          setSelectedThreat={setSelectedThreat}
          open={isViewOpen}
          onClose={() => {
            setIsViewOpen(false);
          }}
        />
      )}

      {/* Add form */}
      {isAddOpen && (
        <ThreatFormModal
          operation={"create"}
          open={isAddOpen}
          formData={formData}
          setFormData={setFormData}
          metaDatas={metaDatas}
          onSubmit={() => console.log("Submitted")}
          onClose={() => {
            setIsAddConfirmOpen(true);
          }}
        />
      )}

      {/* Edit form */}
      {isEditOpen && selectedThreat && (
        <ThreatFormModal
          operation="edit"
          open={isEditOpen}
          formData={selectedThreat}
          setFormData={(val: any) => {
            if (typeof val === "function") {
              setSelectedThreat((prev) => val(prev as ThreatForm));
            } else {
              setSelectedThreat(val);
            }
          }}
          metaDatas={metaDatas}
          onSubmit={() => console.log("Updated")}
          onClose={() => setIsEditConfirmOpen(true)}
        />
      )}

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={isAddConfirmOpen}
        onClose={() => setIsAddConfirmOpen(false)}
        title="Cancel Threat Creation?"
        description="Are you sure you want to cancel the threat creation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsAddConfirmOpen(false);
          setFormData(initialThreatFormData);
          setIsAddOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <ConfirmDialog
        open={isEditConfirmOpen}
        onClose={() => setIsEditConfirmOpen(false)}
        title="Cancel Threat Updation?"
        description="Are you sure you want to cancel the threat updation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsEditConfirmOpen(false);
          setSelectedThreat(null);
          setIsEditOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Confirm Threat Deletion?"
        description={`Are you sure you want to delete Threat ${selectedThreat?.mitreTechniqueId}? All associated data will be removed from the system.`}
        onConfirm={handleDelete}
        cancelText="Cancel"
        confirmText="Yes, Delete"
      />

      {/* Page content */}
      <Box p={5}>
        <LibraryHeader {...headerProps} />
        <ThreatList
          loading={loading}
          data={threatsData}
          totalRows={totalRows}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          setSelectedThreat={setSelectedThreat}
          setIsViewOpen={setIsViewOpen}
          setIsEditOpen={setIsEditOpen}
          setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
          handleUpdateStatus={() => console.log("Updated")}
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
