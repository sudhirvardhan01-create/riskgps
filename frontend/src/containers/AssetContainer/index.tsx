import { useEffect, useState, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import LibraryHeader from "@/components/Library/LibraryHeader";
import AssetList from "@/components/Library/Asset/AssetList";
import ToastComponent from "@/components/ToastComponent";
import ConfirmDialog from "@/components/ConfirmDialog";
import AssetFormModal from "@/components/Library/Asset/AssetFormModal";
import ViewAssetModal from "@/components/Library/Asset/ViewAssetModal";
import { AssetForm, AssetAttributes } from "@/types/asset";
import { AssetService } from "@/services/assetService";
import { fetchMetaDatas } from "@/pages/api/meta-data";
import { Filter } from "@/types/filter";
import { FileService } from "@/services/fileService";
import { ProcessService } from "@/services/processService";

const initialAssetFormData: AssetForm = {
  assetCategory: "",
  assetDescription: "",
  applicationName: "",
  applicationOwner: "",
  applicationITOwner: "",
  isThirdPartyManagement: null,
  thirdPartyName: "",
  thirdPartyLocation: "",
  hosting: "",
  hostingFacility: "",
  cloudServiceProvider: [],
  geographicLocation: "",
  hasRedundancy: null,
  databases: "",
  hasNetworkSegmentation: null,
  networkName: "",
  attributes: [] as AssetAttributes[],
};

const sortItems = [
  { label: "Asset Code (Ascending)", value: "assetCode:asc" },
  { label: "Asset Code (Descending)", value: "assetCode:desc" },
  { label: "Asset Name (Ascending)", value: "applicationName:asc" },
  { label: "Asset Name (Descending)", value: "applicationName:desc" },
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
  { label: "Assets" },
];

export default function AssetContainer() {
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [sort, setSort] = useState<string>("assetCode:asc");
  const [searchPattern, setSearchPattern] = useState<string>();
  const [assetsData, setAssetsData] = useState<AssetForm[]>([]);
  const [processesData, setProcessesData] = useState<any[]>([]);
  const [metaDatas, setMetaDatas] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  const [selectedAsset, setSelectedAsset] = useState<AssetForm | null>(null);

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

  const [assetFormData, setAssetFormData] =
    useState<AssetForm>(initialAssetFormData);

  //Related to Import/Export
  const [file, setFile] = useState<File | null>(null);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState<boolean>(false);

  const assetFilterCategories = [
    {
      key: "asset_category",
      name: "Asset Category",
      values: [
        "Windows",
        "macOS",
        "Linux",
        "Office 365",
        "Azure AD",
        "Google Workspace",
        "SaaS",
        "IaaS",
        "Network Devices",
        "Containers",
        "Android",
        "iOS",
      ],
    },
    {
      key: "cloud_service_provider",
      name: "Cloud Service Provider",
      values: ["AWS", "Azure", "Google Cloud Platform", "Other"],
    },
    {
      key: "hosting",
      name: "Hosting",
      values: ["SaaS", "PaaS", "IaaS", "On-Premise"],
    },
    {
      key: "hosting_facility",
      name: "Hosting Facility",
      values: ["Public Cloud", "Private Cloud", "N/A"],
    },
  ];

  // fetch list
  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AssetService.fetch(
        page,
        rowsPerPage,
        searchPattern as string,
        sort,
        statusFilters,
        filters
      );
      setAssetsData(data?.data ?? []);
      setTotalRows(data?.total ?? 0);
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to fetch assets",
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
        const [proc, meta] = await Promise.all([
          ProcessService.fetchProcessesForListing(),
          fetchMetaDatas(),
        ]);
        setProcessesData(proc.data ?? []);
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
  const handleCreate = async (status: string) => {
    try {
      const req = { ...assetFormData, status };
      await AssetService.create(req);
      setAssetFormData(initialAssetFormData);
      setIsAddOpen(false);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: `Success! Asset ${
          status === "published" ? "published" : "saved as draft"
        }`,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to create asset",
        severity: "error",
      });
    }
  };

  // Update
  const handleUpdate = async (status: string) => {
    try {
      if (!selectedAsset?.id) throw new Error("Invalid selection");
      const body = { ...selectedAsset, status };
      await AssetService.update(selectedAsset.id as number, body);
      setIsEditOpen(false);
      setSelectedAsset(null);
      setIsViewOpen(false);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: "Asset updated",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to update asset",
        severity: "error",
      });
    }
  };

  // Update status only
  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await AssetService.updateStatus(id, status);
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
      if (!selectedAsset?.id) throw new Error("Invalid selection");
      await AssetService.delete(selectedAsset.id as number);
      setIsDeleteConfirmOpen(false);
      setSelectedAsset(null);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: `Deleted ${selectedAsset?.assetCode}`,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to delete asset",
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
  const handleExportAssets = async () => {
    try {
      await FileService.exportLibraryDataCSV("asset");
      setToast({
        open: true,
        message: `Assets exported successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Error: unable to export the assets",
        severity: "error",
      });
    }
  };

  //Function to import the assets
  const handleImportAssets = async () => {
    try {
      if (!file) {
        throw new Error("File not found");
      }
      await FileService.importLibraryDataCSV("asset", file as File);
      setIsFileUploadOpen(false);
      setToast({
        open: true,
        message: `Assets Imported successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Error: unable to download the import assets from file",
        severity: "error",
      });
    }
  };

  //Function to download the assets template file
  const handledownloadAssetsTemplateFile = async () => {
    try {
      await FileService.dowloadCSVTemplate("asset");
      setToast({
        open: true,
        message: `Assets template file downloaded successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Error: unable to download the assets template file",
        severity: "error",
      });
    }
  };
  // memoize props used by list/header
  const headerProps = useMemo(
    () => ({
      breadcrumbItems,
      metaDatas: assetFilterCategories,
      addButtonText: "Add Asset",
      addAction: () => setIsAddOpen(true),
      sortItems,
      fileUploadTitle: "Import Assets",
      file,
      setFile,
      isFileUploadOpen,
      setIsFileUploadOpen,
      handleImport: handleImportAssets,
      handledownloadTemplateFile: handledownloadAssetsTemplateFile,
      onImport: () => setIsFileUploadOpen(true),
      isImportRequired: true,
      onExport: () => handleExportAssets(),
      searchPattern,
      isExportRequired: true,
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
      const res = await AssetService.fetch(
        0,
        1,
        assetFormData.applicationName.trim(),
        "asset_code:asc"
      );
      if (
        res.data?.length > 0 &&
        res.data[0].applicationName === assetFormData.applicationName.trim()
      ) {
        setToast({
          open: true,
          message: `Asset Name already exists`,
          severity: "error",
        });
      } else {
        handleCreate(status);
      }
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Failed to create asset",
        severity: "error",
      });
    }
  };

  return (
    <>
      {/* View modal */}
      {selectedAsset && isViewOpen && (
        <ViewAssetModal
          assetData={selectedAsset}
          setIsEditAssetOpen={setIsEditOpen}
          setSelectedAsset={setSelectedAsset}
          processes={processesData}
          metaDatas={metaDatas}
          open={isViewOpen}
          onClose={() => {
            setIsViewOpen(false);
          }}
        />
      )}

      {/* Add form */}
      {isAddOpen && (
        <AssetFormModal
          operation={"create"}
          open={isAddOpen}
          assetFormData={assetFormData}
          setAssetFormData={setAssetFormData}
          processes={processesData}
          metaDatas={metaDatas}
          onSubmit={handleFormValidation}
          // onSubmit={handleCreate}
          onClose={() => {
            setIsAddConfirmOpen(true);
          }}
        />
      )}

      {/* Edit form */}
      {isEditOpen && selectedAsset && (
        <AssetFormModal
          operation="edit"
          open={isEditOpen}
          assetFormData={selectedAsset}
          setAssetFormData={(val: any) => {
            if (typeof val === "function") {
              setSelectedAsset((prev) => val(prev as AssetForm));
            } else {
              setSelectedAsset(val);
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
        title="Cancel Asset Creation?"
        description="Are you sure you want to cancel the asset creation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsAddConfirmOpen(false);
          setAssetFormData(initialAssetFormData);
          setIsAddOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <ConfirmDialog
        open={isEditConfirmOpen}
        onClose={() => setIsEditConfirmOpen(false)}
        title="Cancel Asset Updation?"
        description="Are you sure you want to cancel the asset updation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsEditConfirmOpen(false);
          setSelectedAsset(null);
          setIsEditOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Confirm Asset Deletion?"
        description={`Are you sure you want to delete Asset ${selectedAsset?.assetCode}? All associated data will be removed from the system.`}
        onConfirm={handleDelete}
        cancelText="Cancel"
        confirmText="Yes, Delete"
      />

      {/* Page content */}
      <Box p={5}>
        <LibraryHeader {...headerProps} />
        <AssetList
          loading={loading}
          data={assetsData}
          totalRows={totalRows}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          setSelectedAsset={setSelectedAsset}
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

      {/* <FileUpload open={isFileUploadOpen} onClose={() => setIsFileUploadOpen(false)} onUpload={handleImportAssets} onDownload={handledownloadAssetsTemplateFile} onFileSelect={(file) => setFile(file)} file ={file} title="Upload Assets"/> */}
    </>
  );
}
