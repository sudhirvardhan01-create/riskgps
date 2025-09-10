import { useEffect, useState, useCallback } from "react";
import ToastComponent from "@/components/ToastComponent";
import ConfirmDialog from "@/components/ConfirmDialog";
import { fetchMetaDatas } from "@/pages/api/meta-data";
import { ControlForm, ControlFrameworkForm } from "@/types/control";
import { FileService } from "@/services/fileService";
import { ControlService } from "@/services/controlService";
import ControlFrameworkFormModal from "@/components/Library/Control/ControlFrameworkFormModal";
import ControlFrameworkList from "@/components/Library/Control/ControlFrameworkList";
import ViewControlFrameworkModal from "@/components/Library/Control/ViewControlFrameworkModal";

interface ControlFrameworkContainerProps {
  selectedControlFramework: string;
  controls: ControlForm[];
}

const ControlFrameworkContainer: React.FC<ControlFrameworkContainerProps> = ({
  selectedControlFramework,
  controls,
}) => {
  const initialControlFrameworkFormData: ControlFrameworkForm = {
    frameWorkName: "",
    frameWorkControlCategoryId: "",
    frameWorkControlCategory: "",
    frameWorkControlSubCategoryId: "",
    frameWorkControlSubCategory: "",
    mitreControls: [],
  };

  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [sort, setSort] = useState<string>("id:asc");
  const [searchPattern, setSearchPattern] = useState<string>();
  const [controlsData, setControlsData] = useState<ControlFrameworkForm[]>([]);
  const [metaDatas, setMetaDatas] = useState<any[]>([]);

  const [selectedData, setSelectedData] = useState<ControlFrameworkForm | null>(
    null
  );

  // modals / confirm / toast
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  const [formData, setFormData] = useState<ControlFrameworkForm>(
    initialControlFrameworkFormData
  );

  // fetch list
  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ControlService.fetch(
        page,
        rowsPerPage,
        searchPattern as string,
        sort
      );
      setControlsData(data ?? []);
      setTotalRows(data?.total ?? 0);
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to fetch controls",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchPattern, sort]);

  useEffect(() => {
    loadList();
  }, [loadList, refreshTrigger]);

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
  //   const handleDelete = async () => {
  //     try {
  //       if (!selectedAsset?.id) throw new Error("Invalid selection");
  //       await AssetService.delete(selectedAsset.id as number);
  //       setIsDeleteConfirmOpen(false);
  //       setSelectedAsset(null);
  //       setRefreshTrigger((p) => p + 1);
  //       setToast({
  //         open: true,
  //         message: `Deleted ${selectedAsset?.assetCode}`,
  //         severity: "success",
  //       });
  //     } catch (err) {
  //       console.error(err);
  //       setToast({
  //         open: true,
  //         message: "Failed to delete asset",
  //         severity: "error",
  //       });
  //     }
  //   };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const dummyFrameworkRecords = [
    {
      frameWorkName: "NIST",
      frameWorkControlCategoryId: "CAT-001",
      frameWorkControlCategory: "Access Control",
      frameWorkControlSubCategoryId: "SUB-001",
      frameWorkControlSubCategory: "User Authentication",
      mitreControls: ["DS0022", "M1047"],
    },
    {
      frameWorkName: "CRI",
      frameWorkControlCategoryId: "CAT-002",
      frameWorkControlCategory: "Incident Response",
      frameWorkControlSubCategoryId: "SUB-002",
      frameWorkControlSubCategory: "Personnel activity and technology usage are monitored to find potentially adverse events",
      mitreControls: ["DS0022", "M1047"],
    },
    {
      frameWorkName: "ATLAS",
      frameWorkControlCategoryId: "CAT-003",
      frameWorkControlCategory: "Risk Management",
      frameWorkControlSubCategoryId: "SUB-003",
      frameWorkControlSubCategory: "Personnel activity and technology usage are monitored to find potentially adverse events",
      mitreControls: ["DS0022", "M1047"],
    },
     {
      frameWorkName: "NIST",
      frameWorkControlCategoryId: "CAT-004",
      frameWorkControlCategory: "System Integrity",
      frameWorkControlSubCategoryId: "SUB-004",
      frameWorkControlSubCategory: "Malware Protection",
      mitreControls: ["DS0022", "M1047"],
    },
    {
      frameWorkName: "CRI",
      frameWorkControlCategoryId: "CAT-005",
      frameWorkControlCategory: "Data Protection",
      frameWorkControlSubCategoryId: "SUB-005",
      frameWorkControlSubCategory: "Encryption & Key Management",
      mitreControls: ["DS0022", "M1047"],
    },
  ];

  return (
    <>
      {/* View modal */}
      {selectedData && isViewOpen && (
        <ViewControlFrameworkModal
          controlFrameworkRecord={selectedData}
          setIsEditControlOpen={setIsEditOpen}
          setSelectedControlFrameworkRecord={setSelectedData}
          open={isViewOpen}
          onClose={() => {
            setIsViewOpen(false);
          }}
        />
      )}

      {/* Edit form */}
      {isEditOpen && selectedData && (
        <ControlFrameworkFormModal
          operation="edit"
          open={isEditOpen}
          controls={controls}
          formData={selectedData}
          setFormData={(val: any) => {
            if (typeof val === "function") {
              setSelectedData((prev) => val(prev as ControlFrameworkForm));
            } else {
              setSelectedData(val);
            }
          }}
          onSubmit={() => console.log("Updated")}
          onClose={() => setIsEditConfirmOpen(true)}
        />
      )}

      <ConfirmDialog
        open={isEditConfirmOpen}
        onClose={() => setIsEditConfirmOpen(false)}
        title="Cancel Control mapping Updation?"
        description="Are you sure you want to cancel the control mapping updation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsEditConfirmOpen(false);
          setSelectedData(null);
          setIsEditOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Confirm Control Deletion?"
        description={`Are you sure you want to delete Control ${selectedData?.frameWorkControlCategoryId}? All associated data will be removed from the system.`}
        onConfirm={() => console.log("Deleted")}
        cancelText="Cancel"
        confirmText="Yes, Delete"
      />

      {/* Page content */}
      <ControlFrameworkList
        loading={loading}
        //data={controlsData}
        data={dummyFrameworkRecords.filter((item) => item.frameWorkName === selectedControlFramework)}
        totalRows={totalRows}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        setSelectedControlFrameworkRecord={setSelectedData}
        setIsViewOpen={setIsViewOpen}
        setIsEditOpen={setIsEditOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
        handleUpdateStatus={() => console.log("Updated")}
      />

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
};

export default ControlFrameworkContainer;
