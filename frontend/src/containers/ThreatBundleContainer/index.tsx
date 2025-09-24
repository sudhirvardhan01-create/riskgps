import { useEffect, useState, useCallback } from "react";
import ToastComponent from "@/components/ToastComponent";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ThreatBundleForm } from "@/types/threat";
import ThreatBundleList from "@/components/Library/Threat/ThreatBundleList";
import { ThreatBundleService } from "@/services/threatBundleService";

interface ThreatBundleContainerProps {
  selectedTab: string;
  renderOnCreation: any;
}

const ThreatBundleContainer: React.FC<ThreatBundleContainerProps> = ({
  selectedTab,
  renderOnCreation,
}) => {
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [threatBundleData, setThreatBundleData] = useState<ThreatBundleForm>();

  const [selectedThreatBundleId, setselectedThreatBundleId] = useState<
    string | null
  >(null);

  // modals / confirm / toast
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
      const data = await ThreatBundleService.fetch(
        selectedTab,
        page,
        rowsPerPage
      );
      setThreatBundleData(data.data ?? {});
      setTotalRows(data?.total ?? 0);
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to fetch threat bundle records",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, selectedTab]);

  console.log(threatBundleData);

  useEffect(() => {
    loadList();
  }, [loadList, refreshTrigger, selectedTab, renderOnCreation]);

  //Set Page Number to 0 on change of Selected Control Framework
  useEffect(() => {
    setPage(0);
  }, [selectedTab]);

  // Delete
  const handleDelete = async () => {
    try {
      if (!selectedThreatBundleId) throw new Error("Invalid selection");
      await ThreatBundleService.delete(selectedThreatBundleId as string);
      setIsDeleteConfirmOpen(false);
      setselectedThreatBundleId(null);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: `Deleted threat bundle record`,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to delete threat bundle record",
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
      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Confirm Threat Bundle Record Deletion?"
        description={`Are you sure you want to delete this record? All associated data will be removed from the system.`}
        onConfirm={() => handleDelete()}
        cancelText="Cancel"
        confirmText="Yes, Delete"
      />

      {/* Page content */}
      {threatBundleData && (
        <ThreatBundleList
          loading={loading}
          data={threatBundleData.mitreThreatTechnique}
          totalRows={totalRows}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          setSelectedThreatBundleId={setselectedThreatBundleId}
          onDelete={() => setIsDeleteConfirmOpen(true)}
        />
      )}

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

export default ThreatBundleContainer;
