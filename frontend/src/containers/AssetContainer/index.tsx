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
import { fetchProcesses } from "@/pages/api/process";

const initialAssetFormData: AssetForm = {
  assetName: "",
  assetCategory: [],
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
  attributes: [{ meta_data_key_id: null, values: [] }] as AssetAttributes[],
};

const sortItems = [
  { label: "Asset Code (Ascending)", value: "asset_code:asc" },
  { label: "Asset Code (Descending)", value: "asset_code:desc" },
  { label: "Asset Name (Ascending)", value: "asset_name:asc" },
  { label: "Asset Name (Descending)", value: "asset_name:desc" },
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
  const [sort, setSort] = useState<string>('asset_code:asc');
  const [searchPattern, setSearchPattern] = useState<string>();
  const [assetsData, setAssetsData] = useState<AssetForm[]>([]);
  const [processesData, setProcessesData] = useState<any[]>([]);
  const [metaDatas, setMetaDatas] = useState<any[]>([]);

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

  const [assetFormData, setAssetFormData] = useState<AssetForm>(initialAssetFormData);

  // fetch list
  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AssetService.fetch(page, rowsPerPage, searchPattern as string, sort);
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
  }, [page, rowsPerPage, searchPattern, sort]);

  useEffect(() => {
    loadList();
  }, [loadList, refreshTrigger]);

  // fetch processes & meta
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [proc, meta] = await Promise.all([
          fetchProcesses(0, 0),
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

  // memoize props used by list/header
  const headerProps = useMemo(
    () => ({
      breadcrumbItems,
      addButtonText: "Add Asset",
      addAction: () => setIsAddOpen(true),
      sortItems,
      searchPattern,
      setSearchPattern,
      sort,
      setSort,
    }),
    []
  );

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
          onSubmit={handleCreate}
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
    </>
  );
}
