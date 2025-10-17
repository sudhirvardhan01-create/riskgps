import { useEffect, useState, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import LibraryHeader from "@/components/Library/LibraryHeader";
import QuestionnaireList from "@/components/Questionnaire/QuestionnaireList";
import ToastComponent from "@/components/ToastComponent";
import ConfirmDialog from "@/components/ConfirmDialog";
import QuestionnaireFormModal from "@/components/Questionnaire/QuestionnaireFormModal";
import ViewQuestionnaireModal from "@/components/Questionnaire/ViewQuestionnaireModal";
import { QuestionnaireData } from "@/types/questionnaire";
import { QuestionnaireService } from "@/services/questionnaireService";
import { FileService } from "@/services/fileService";
import { useConfig } from "@/context/ConfigContext";
import ButtonTabs from "@/components/ButtonTabs";
import { ControlService } from "@/services/controlService";
import { Filter } from "@/types/filter";

const initialQuestionnaireData: QuestionnaireData = {
  assetCategories: [],
  question: "",
  mitreControlId: [],
};

const sortItems = [
  { label: "Question Code (Ascending)", value: "questionCode:asc" },
  { label: "Question Code (Descending)", value: "questionCode:desc" },
  { label: "Created (Latest to Oldest)", value: "createdDate:desc" },
  { label: "Created (Oldest to Latest)", value: "createdDate:asc" },
  { label: "Updated (Latest to Oldest)", value: "modifiedDate:desc" },
  { label: "Updated (Oldest to Latest)", value: "modifiedDate:asc" },
];

const breadcrumbItems = [
  // keep the same breadcrumb behavior from original page
  {
    label: "Library",
    onClick: () => (window.location.href = "/library"),
    icon: <ArrowBack fontSize="small" />,
  },
  { label: "Questionnaire" },
];

export default function QuestionnaireContainer() {
  const { fetchMetadataByKey } = useConfig();

  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [sort, setSort] = useState<string>("questionCode:asc");
  const [searchPattern, setSearchPattern] = useState<string>();
  const [questionnaireData, setQuestionnaireData] = useState<
    QuestionnaireData[]
  >([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  const [questionFilters, setQuestionFilters] = useState<
    { key: string; name: string; values: string[] }[]
  >([
    {
      key: "",
      name: "",
      values: [],
    },
  ]);

  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionnaireData | null>(null);

  const asset_categories = fetchMetadataByKey("Asset Category")
    ?.supported_values
    ? fetchMetadataByKey("Asset Category")?.supported_values
    : [
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
      ];

  const [selectedAssetCategory, setSelectedAssetCategory] =
    useState<string>("Windows");

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

  const [formData, setFormData] = useState<QuestionnaireData>(
    initialQuestionnaireData
  );
  const [controlsForListing, setControlsForListing] = useState<string[]>([]);

  //Related to Import/Export
  const [file, setFile] = useState<File | null>(null);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState<boolean>(false);

  // fetch list
  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await QuestionnaireService.fetch(
        selectedAssetCategory,
        page,
        rowsPerPage,
        searchPattern,
        sort,
        statusFilters
      );
      setQuestionnaireData(data?.data ?? []);
      setTotalRows(data?.total ?? 0);
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to fetch questions",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [
    selectedAssetCategory,
    page,
    rowsPerPage,
    searchPattern,
    sort,
    statusFilters,
  ]);

  useEffect(() => {
    loadList();
  }, [loadList, refreshTrigger]);

  useEffect(() => {
    setPage(0);
  }, [selectedAssetCategory]);

  // Create
  const handleCreate = async (status: string) => {
    try {
      const req = { ...formData, status };
      await QuestionnaireService.create(req);
      setFormData(initialQuestionnaireData);
      setIsAddOpen(false);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: `Success! Question ${
          status === "published" ? "published" : "saved as draft"
        }`,
        severity: "success",
      });
    } catch (err: any) {
      console.error(err);
      setToast({
        open: true,
        message: err.message || "Failed to create question",
        severity: "error",
      });
    }
  };

  // Update
  const handleUpdate = async (status: string) => {
    try {
      if (!selectedQuestion?.questionnaireId)
        throw new Error("Invalid selection");
      const body = { ...selectedQuestion, status };
      await QuestionnaireService.update(
        selectedQuestion.questionnaireId as string,
        body
      );
      setIsEditOpen(false);
      setSelectedQuestion(null);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: "Question updated successfully",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to update question",
        severity: "error",
      });
    }
  };

  // Update status only
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await QuestionnaireService.updateStatus(id, status);
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
      if (!selectedQuestion?.questionnaireId)
        throw new Error("Invalid selection");
      await QuestionnaireService.delete(
        selectedQuestion.questionnaireId as string,
        selectedAssetCategory
      );
      setIsDeleteConfirmOpen(false);
      setSelectedQuestion(null);
      setRefreshTrigger((p) => p + 1);
      setToast({
        open: true,
        message: `Deleted ${selectedQuestion?.questionCode}`,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to delete question",
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

  //Function to export the questionnaire
  const handleExportQuestionnaire = async () => {
    try {
      await FileService.exportLibraryDataCSV("questionnaire");
      setToast({
        open: true,
        message: `Questionnaire exported successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Error: unable to export the questionnaire",
        severity: "error",
      });
    }
  };

  //Function to import the questions
  const handleImportQuestions = async () => {
    try {
      if (!file) {
        throw new Error("File not found");
      }
      await FileService.importLibraryDataCSV("questionnaire", file as File);
      setIsFileUploadOpen(false);
      setToast({
        open: true,
        message: `Qustions imported successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Error: unable to import the questions from file",
        severity: "error",
      });
    }
  };

  //Function to download the questionnaire template file
  const handledownloadQuestionnaireTemplateFile = async () => {
    try {
      await FileService.dowloadCSVTemplate("questionnaire");
      setToast({
        open: true,
        message: `Questionnaire template file downloaded successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Error: unable to download the questionnaire template file",
        severity: "error",
      });
    }
  };

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
  console.log(controlsForListing);

  // memoize props used by list/header
  const headerProps = useMemo(
    () => ({
      breadcrumbItems,
      metaDatas: questionFilters,
      addButtonText: "Add Question",
      addAction: () => setIsAddOpen(true),
      sortItems,
      fileUploadTitle: "Import Questions",
      file,
      setFile,
      isFileUploadOpen,
      setIsFileUploadOpen,
      handleImport: handleImportQuestions,
      handledownloadTemplateFile: handledownloadQuestionnaireTemplateFile,
      onImport: () => setIsFileUploadOpen(true),
      isImportRequired: true,
      onExport: () => handleExportQuestionnaire(),
      searchPattern,
      setSearchPattern,
      sort,
      setSort,
      statusFilters,
      setStatusFilters,
      filters,
      setFilters,
    }),
    [statusFilters, file, isFileUploadOpen]
  );

  return (
    <>
      {/* View modal */}
      {selectedQuestion && isViewOpen && (
        <ViewQuestionnaireModal
          open={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          recordData={selectedQuestion}
          setIsEditQuestionnaireOpen={setIsEditOpen}
          setSelectedRecord={setSelectedQuestion}
        />
      )}

      {/* Add form */}
      {isAddOpen && asset_categories && (
        <QuestionnaireFormModal
          operation="create"
          open={isAddOpen}
          assetCategories={asset_categories}
          controls={controlsForListing}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreate}
          onClose={() => setIsAddConfirmOpen(true)}
        />
      )}

      {/* Edit form */}
      {isEditOpen && selectedQuestion && asset_categories && (
        <QuestionnaireFormModal
          operation="edit"
          open={isEditOpen}
          formData={selectedQuestion}
          setFormData={(val: any) => {
            if (typeof val === "function") {
              setSelectedQuestion((prev) => val(prev as QuestionnaireData));
            } else {
              setSelectedQuestion(val);
            }
          }}
          assetCategories={asset_categories}
          controls={controlsForListing}
          onSubmit={handleUpdate}
          onClose={() => setIsEditConfirmOpen(true)}
        />
      )}

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={isAddConfirmOpen}
        onClose={() => setIsAddConfirmOpen(false)}
        title="Cancel Question Creation?"
        description="Are you sure you want to cancel the question creation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsAddConfirmOpen(false);
          setFormData(initialQuestionnaireData);
          setIsAddOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <ConfirmDialog
        open={isEditConfirmOpen}
        onClose={() => setIsEditConfirmOpen(false)}
        title="Cancel Question Updation?"
        description="Are you sure you want to cancel the question updation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsEditConfirmOpen(false);
          setSelectedQuestion(null);
          setIsEditOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Confirm Question Deletion?"
        description={`Are you sure you want to delete question ${selectedQuestion?.questionCode} for platform ${selectedAssetCategory}? All associated data will be removed from the system.`}
        onConfirm={handleDelete}
        cancelText="Cancel"
        confirmText="Yes, Delete"
      />

      {/* Page content */}
      <Box p={5}>
        <LibraryHeader {...headerProps} />

        {/* Tabs to select the Asset Category */}
        {asset_categories && (
          <ButtonTabs
            selectedTab={selectedAssetCategory}
            setSelectedTab={setSelectedAssetCategory}
            items={asset_categories}
          />
        )}

        <QuestionnaireList
          loading={loading}
          data={questionnaireData}
          totalRows={totalRows}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          setSelectedRecord={setSelectedQuestion}
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
