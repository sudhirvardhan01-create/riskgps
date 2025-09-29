import { useEffect, useState, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import LibraryHeader from "@/components/Library/LibraryHeader";
import ToastComponent from "@/components/ToastComponent";
import ConfirmDialog from "@/components/ConfirmDialog";
import ControlFormModal from "@/components/Library/Control/ControlFormModal";
import ViewControlModal from "@/components/Library/Control/ViewControlModal";
import { fetchMetaDatas } from "@/pages/api/meta-data";
import { Filter } from "@/types/filter";
import ControlList from "@/components/Library/Control/ControlList";
import {
  ControlForm,
  ControlFrameworkForm,
  MITREControlForm,
} from "@/types/control";
import { ControlService } from "@/services/controlService";
import ButtonTabs from "@/components/ButtonTabs";
import ControlFrameworkFormModal from "@/components/Library/Control/ControlFrameworkFormModal";
import ControlFrameworkContainer from "../ControlFrameworkContainer";
import { ControlFrameworkService } from "@/services/controlFrameworkService";
import DeleteMultipleControls from "@/components/Library/Control/DeleteMultipleControls";

const initialControlFrameworkFormData: ControlFrameworkForm = {
  frameWorkName: "",
  frameWorkControlCategoryId: "",
  frameWorkControlCategory: "",
  frameWorkControlSubCategoryId: "",
  frameWorkControlSubCategory: "",
  mitreControls: [],
};

const breadcrumbItems = [
  // keep the same breadcrumb behavior from original page
  {
    label: "Library",
    onClick: () => (window.location.href = "/library"),
    icon: <ArrowBack fontSize="small" />,
  },
  { label: "Controls" },
];

export default function ControlContainer() {
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [sort, setSort] = useState<string>("id:asc");
  const [searchPattern, setSearchPattern] = useState<string>();
  const [controlsData, setControlsData] = useState<MITREControlForm[]>([]);
  const [controlsForListing, setControlsForListing] = useState<any[]>([]);
  const [metaDatas, setMetaDatas] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  const [selectedControl, setSelectedControl] =
    useState<MITREControlForm | null>(null);
  const [selectedControlsToDelete, setSelectedControlsToDelete] = useState<
    string[]
  >([]);

  // modals / confirm / toast
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddConfirmOpen, setIsAddConfirmOpen] = useState(false);
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSelectControlsToDeleteOpen, setIsSelectControlsToDeleteOpen] =
    useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  const [formData, setFormData] = useState<ControlFrameworkForm>(
    initialControlFrameworkFormData
  );

  //Related to Import/Export
  const [file, setFile] = useState<File | null>(null);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState<boolean>(false);

  {
    /* Related to Control Framework */
  }
  const [selectedControlFramework, setSelectedControlFramework] =
    useState("MITRE");
  const frameworks = ["NIST", "ATLAS", "CRI"];

  const sortItems = [
    { label: "ID (Ascending)", value: "id:asc" },
    { label: "ID (Descending)", value: "id:desc" },
    {
      label: "MITRE Control ID (Ascending)",
      value: "mitreControlId:asc",
    },
    {
      label: "MITRE Control ID (Descending)",
      value: "mitreControlId:desc",
    },
    {
      label: "MITRE Control Name (Ascending)",
      value: "mitreControlName:asc",
    },
    {
      label: "MITRE Control Name (Descending)",
      value: "mitreControlName:desc",
    },
    { label: "Created (Latest to Oldest)", value: "created_at:desc" },
    { label: "Created (Oldest to Latest)", value: "created_at:asc" },
    { label: "Updated (Latest to Oldest)", value: "updated_at:desc" },
    { label: "Updated (Oldest to Latest)", value: "updated_at:asc" },
  ];

  const frameworksSortItems = [
    { label: "ID (Ascending)", value: "id:asc" },
    { label: "ID (Descending)", value: "id:desc" },
    {
      label: "Framework Control Category ID (Ascending)",
      value: "frameWorkControlCategoryId:asc",
    },
    {
      label: "Framework Control Category ID (Descending)",
      value: "frameWorkControlCategoryId:desc",
    },
    {
      label: "Framework Control Category (Ascending)",
      value: "frameWorkControlCategory:asc",
    },
    {
      label: "Framework Control Category (Descending)",
      value: "frameWorkControlCategory:desc",
    },
    { label: "Created (Latest to Oldest)", value: "created_at:desc" },
    { label: "Created (Oldest to Latest)", value: "created_at:asc" },
    { label: "Updated (Latest to Oldest)", value: "updated_at:desc" },
    { label: "Updated (Oldest to Latest)", value: "updated_at:asc" },
  ];

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
  }, [page, rowsPerPage, searchPattern, sort]);

  useEffect(() => {
    loadList();
  }, [loadList, refreshTrigger]);

  // fetch controls for Listing
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await ControlService.fetchControlsForListing(
          "mitreControlId"
        );
        setControlsForListing(data.mitreControlId ?? []);
      } catch (err) {
        console.error(err);
        setToast({
          open: true,
          message: "Failed to fetch controls for Listing purposes",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  // Create Control Mapping
  const handleCreate = async (status: string) => {
    try {
      const req = { ...formData, status };
      await ControlFrameworkService.create(req);
      setFormData(initialControlFrameworkFormData);
      setIsAddOpen(false);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: `Success! Control mapping ${
          status === "published" ? "published" : "saved as draft"
        }`,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to create control mapping",
        severity: "error",
      });
    }
  };

  // Update
  // const handleUpdate = async (status: string) => {
  //   try {
  //     if (
  //       !selectedControl?.mitreControlId ||
  //       !selectedControl?.mitreControlName ||
  //       !selectedControl?.mitreControlType
  //     )
  //       throw new Error("Invalid selection");
  //     const body = { ...selectedControl, status };
  //     await ControlService.update(
  //       body,
  //       selectedControl.mitreControlId,
  //       selectedControl.mitreControlName,
  //       selectedControl.mitreControlType
  //     );
  //     setIsEditOpen(false);
  //     setSelectedControl(null);
  //     setRefreshTrigger((p) => p + 1);
  //     setToast({
  //       open: true,
  //       message: "Control updated",
  //       severity: "success",
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     setToast({
  //       open: true,
  //       message: "Failed to update control",
  //       severity: "error",
  //     });
  //   }
  // };

  // Update status only
  const handleUpdateStatus = async (status: string, mitreControlId: string) => {
    try {
      if (!status || !mitreControlId) throw new Error("Invalid selection");
      await ControlService.updateStatus(mitreControlId, status);
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
      if (!selectedControl?.mitreControlId)
        throw new Error("Invalid selection");
      if (selectedControl?.controlDetails.length === 1) {
        await ControlService.delete(
          selectedControl.mitreControlId as string,
          Array.of(
            selectedControl?.controlDetails[0]?.mitreControlName
          ) as string[]
        );
        setIsDeleteConfirmOpen(false);
        setSelectedControl(null);
      } else {
        await ControlService.delete(
          selectedControl.mitreControlId as string,
          selectedControlsToDelete.map((selected) => selected) as string[]
        );
        setIsSelectControlsToDeleteOpen(false);
        setSelectedControl(null);
        setSelectedControlsToDelete([]);
      }
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message:
          selectedControl?.controlDetails.length === 1
            ? `Deleted control`
            : "Deleted Controls",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to delete control(s)",
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

  //Function to export the framework controls
  const handleExportFrameworkControls = async () => {
    try {
      await ControlFrameworkService.export();
      setToast({
        open: true,
        message: `Controls exported successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Error: unable to export the controls",
        severity: "error",
      });
    }
  };

  //Function to import the framework controls
  const handleImportFrameworkControls = async () => {
    try {
      if (!file) {
        throw new Error("File not found");
      }
      await ControlFrameworkService.import(file as File);
      setIsFileUploadOpen(false);
      setToast({
        open: true,
        message: `Controls Imported successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Error: unable to download the controls from file",
        severity: "error",
      });
    }
  };

  //Function to download the framework controls template file
  const handledownloadFrameworkControlsTemplateFile = async () => {
    try {
      await ControlFrameworkService.download();
      setToast({
        open: true,
        message: `Framework controls template file downloaded successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message:
          "Error: unable to download the framework controls template file",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    setSearchPattern("");
    setSort("id:asc");
  }, [selectedControlFramework]);

  // memoize props used by list/header
  const headerProps = useMemo(
    () => ({
      breadcrumbItems,
      metaDatas,
      addButtonText: "Add Control Mapping",
      addAction: () => setIsAddOpen(true),
      sortItems:
        selectedControlFramework === "MITRE" ? sortItems : frameworksSortItems,
      onImport: () => setIsFileUploadOpen(true),
      onExport: () => handleExportFrameworkControls(),
      fileUploadTitle: "Import Threats",
      file,
      setFile,
      isFileUploadOpen,
      setIsFileUploadOpen,
      handleImport: handleImportFrameworkControls,
      handledownloadTemplateFile: handledownloadFrameworkControlsTemplateFile,
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
    [
      statusFilters,
      filters,
      metaDatas,
      file,
      isFileUploadOpen,
      selectedControlFramework,
      searchPattern,
      setSearchPattern,
      sort,
      setSort,
    ]
  );

  return (
    <>
      {/* View modal */}
      {selectedControl && isViewOpen && (
        <ViewControlModal
          controlData={selectedControl}
          setIsEditControlOpen={setIsEditOpen}
          setSelectedControl={setSelectedControl}
          open={isViewOpen}
          onClose={() => {
            setIsViewOpen(false);
          }}
        />
      )}

      {/* Add form */}
      {isAddOpen && (
        <ControlFrameworkFormModal
          operation={"create"}
          open={isAddOpen}
          controls={controlsForListing}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreate}
          onClose={() => {
            setIsAddConfirmOpen(true);
          }}
        />
      )}

      {/* Edit form */}
      {isEditOpen && selectedControl && (
        <ControlFormModal
          operation="edit"
          open={isEditOpen}
          formData={selectedControl}
          setFormData={(val: any) => {
            if (typeof val === "function") {
              setSelectedControl((prev) => val(prev as MITREControlForm));
            } else {
              setSelectedControl(val);
            }
          }}
          // onSubmit={handleUpdate}
          onSubmit={() => console.log("Updated")}
          onClose={() => setIsEditConfirmOpen(true)}
        />
      )}

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={isAddConfirmOpen}
        onClose={() => setIsAddConfirmOpen(false)}
        title="Cancel Control Mapping Creation?"
        description="Are you sure you want to cancel the control mapping creation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsAddConfirmOpen(false);
          setFormData(initialControlFrameworkFormData);
          setIsAddOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <ConfirmDialog
        open={isEditConfirmOpen}
        onClose={() => setIsEditConfirmOpen(false)}
        title="Cancel Control Updation?"
        description="Are you sure you want to cancel the control updation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsEditConfirmOpen(false);
          setSelectedControl(null);
          setIsEditOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Confirm Control Deletion?"
        description={`Are you sure you want to delete Control ${selectedControl?.mitreControlId}? All associated data will be removed from the system.`}
        onConfirm={() => handleDelete()}
        // onConfirm={() =>
        //   console.log(
        //     selectedControl?.mitreControlId,
        //     Array.of(selectedControl?.controlDetails[0].mitreControlName)
        //   )
        // }
        cancelText="Cancel"
        confirmText="Yes, Delete"
      />

      {selectedControl && selectedControl.controlDetails.length > 1 && (
        <DeleteMultipleControls
          open={isSelectControlsToDeleteOpen}
          onClose={() => {
            setIsSelectControlsToDeleteOpen(false);
            setSelectedControlsToDelete([]);
          }}
          mitreControlNames={selectedControl?.controlDetails?.map(
            (item) => item.mitreControlName
          )}
          selectedControlsToDelete={selectedControlsToDelete}
          setSelectedControlsToDelete={setSelectedControlsToDelete}
          onDelete={() => handleDelete()}
        />
      )}

      {/* Page content */}
      <Box p={5}>
        <LibraryHeader {...headerProps} />

        {/* Tabs to select the Control Framework */}
        <ButtonTabs
          selectedTab={selectedControlFramework}
          setSelectedTab={setSelectedControlFramework}
          items={frameworks}
          mitreTabTitle="MITRE"
          isMITRETabRequired={true}
        />

        {selectedControlFramework === "MITRE" && (
          <ControlList
            loading={loading}
            data={controlsData}
            totalRows={totalRows}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            setSelectedControl={setSelectedControl}
            setIsViewOpen={setIsViewOpen}
            setIsEditOpen={setIsEditOpen}
            setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
            handleUpdateStatus={handleUpdateStatus}
            setIsSelectControlsToDeleteOpen={setIsSelectControlsToDeleteOpen}
          />
        )}

        {selectedControlFramework !== "MITRE" && (
          <ControlFrameworkContainer
            selectedControlFramework={selectedControlFramework}
            controls={controlsForListing}
            renderOnCreation={handleCreate}
            searchPattern={
              selectedControlFramework === "MITRE" ? "" : searchPattern
            }
            sort={sort}
          />
        )}
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
