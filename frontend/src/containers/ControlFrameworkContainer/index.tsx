import { useEffect, useState, useCallback } from "react";
import ToastComponent from "@/components/ToastComponent";
import ConfirmDialog from "@/components/ConfirmDialog";
import { fetchMetaDatas } from "@/pages/api/meta-data";
import { ControlForm, ControlFrameworkForm } from "@/types/control";
import ControlFrameworkFormModal from "@/components/Library/Control/ControlFrameworkFormModal";
import ControlFrameworkList from "@/components/Library/Control/ControlFrameworkList";
import ViewControlFrameworkModal from "@/components/Library/Control/ViewControlFrameworkModal";
import { ControlFrameworkService } from "@/services/controlFrameworkService";

interface ControlFrameworkContainerProps {
  selectedControlFramework: string;
  controls: ControlForm[];
  renderOnCreation: any;
  searchPattern?: string;
  sort: string;
}

const ControlFrameworkContainer: React.FC<ControlFrameworkContainerProps> = ({
  selectedControlFramework,
  controls,
  renderOnCreation,
  searchPattern,
  sort,
}) => {
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
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

  // fetch list
  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ControlFrameworkService.fetch(
        page,
        rowsPerPage,
        selectedControlFramework,
        searchPattern,
        sort
      );
      setControlsData(data.data ?? []);
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
  }, [page, rowsPerPage, searchPattern, sort, selectedControlFramework]);

  useEffect(() => {
    loadList();
  }, [loadList, refreshTrigger, selectedControlFramework, renderOnCreation]);

  //Set Page Number to 0 on change of Selected Control Framework
  useEffect(() => {
    setPage(0);
  }, [selectedControlFramework]);

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
  const handleUpdate = async (status: string) => {
    try {
      if (!selectedData?.id) throw new Error("Invalid selection");
      const body = { ...selectedData, status };
      await ControlFrameworkService.update(selectedData.id as number, body);
      setIsEditOpen(false);
      setSelectedData(null);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: "Framework control updated",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to update framework control",
        severity: "error",
      });
    }
  };

  // Update status only
  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await ControlFrameworkService.updateStatus(id, status);
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
      if (!selectedData?.id) throw new Error("Invalid selection");
      await ControlFrameworkService.delete(selectedData.id as number);
      setIsDeleteConfirmOpen(false);
      setSelectedData(null);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: `Deleted framework control`,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to delete framework control",
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
          onSubmit={handleUpdate}
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
        onConfirm={() => handleDelete()}
        cancelText="Cancel"
        confirmText="Yes, Delete"
      />

      {/* Page content */}
      <ControlFrameworkList
        loading={loading}
        data={controlsData}
        totalRows={totalRows}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        setSelectedControlFrameworkRecord={setSelectedData}
        setIsViewOpen={setIsViewOpen}
        setIsEditOpen={setIsEditOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
        handleUpdateStatus={handleUpdateStatus}
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
