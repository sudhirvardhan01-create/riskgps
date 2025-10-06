import {
  Box,
  Typography,
  Stack,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  TextField,
  InputLabel,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MetaDataCard from "@/components/MetaData/MetaDataCard";
import React, { useState, useEffect } from "react";
import { Search } from "@mui/icons-material";
import { MetaDataService } from "@/services/metaDataService";
import { MetaData } from "@/types/meta-data";
import ConfirmDialog from "@/components/ConfirmDialog";
import ToastComponent from "@/components/ToastComponent";
import ViewMetaDataModal from "@/components/MetaData/ViewMetaDataModal";
import MetaDataFormModal from "@/components/MetaData/MetaDataFormModal";
import withAuth from "@/hoc/withAuth";

const Index = () => {
  const sortItems = [
    { value: "id:asc", label: "ID (Ascending)" },
    { value: "id:desc", label: "ID (Descending)" },
    { value: "name:asc", label: "Key (Ascending)" },
    { value: "name:desc", label: "Key (Descending)" },
    { value: "created_at:asc", label: "Created (Oldest to Latest)" },
    { value: "created_at:desc", label: "Created (Latest to Oldest)" },
    { value: "updated_at:asc", label: "Updated (Oldest to Latest)" },
    { value: "updated_at:desc", label: "Updated (Latest to Oldest)" },
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchPattern, setSearchPattern] = useState("");
  const [sort, setSort] = useState(sortItems[0].value);
  const [loading, setLoading] = useState(false);
  const [metaDatas, setMetaDatas] = useState<MetaData[]>();
  const [selectedMetaData, setSelectedMetaData] = useState<MetaData | null>(
    null
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isViewMetaDataModalOpen, setIsViewMetaDataModalOpen] = useState(false);
  const [isAddMetaDataModalOpen, setIsAddMetaDataModalOpen] = useState(false);
  const [isEditMetaDataModalOpen, setIsEditMetaDataModalOpen] = useState(false);
  const [isEditConfirmPopupOpen, setIsEditConfirmPopupOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });
  const [
    isDeleteMetaDataConfirmPopupOpen,
    setIsDeleteMetaDataConfirmPopupOpen,
  ] = useState(false);
  const [formData, setFormData] = useState<MetaData>({
    name: "",
    label: "",
    input_type: "",
    supported_values: [] as string[],
    applies_to: [] as string[],
  });

  // fetch meta data
  useEffect(() => {
    const getMetaDatas = async () => {
      try {
        setLoading(true);
        const [meta] = await Promise.all([
          MetaDataService.fetch(0, -1, searchPattern, sort),
        ]);
        setMetaDatas(meta.data ?? []);
      } catch (error) {
        console.error("Error while fetching metadata:", error);
      } finally {
        setLoading(false);
      }
    };
    getMetaDatas();
  }, [refreshTrigger, searchPattern, sort]);

  //Function to handle the delete of a metadata
  const handleDeleteMetaData = async () => {
    try {
      if (selectedMetaData?.id) {
        const res = await MetaDataService.delete(
          selectedMetaData?.id as number
        );
        console.log(res);
        setRefreshTrigger((prev) => prev + 1);
        setIsDeleteMetaDataConfirmPopupOpen(false);
        setToast({
          open: true,
          message: `${selectedMetaData.name} deleted`,
          severity: "success",
        });
      } else {
        throw new Error("Invalid ID");
      }
    } catch (err) {
      console.log("Something went wrong", err);
      setToast({
        open: true,
        message: `Error : Failed to delete metadata`,
        severity: "error",
      });
    }
  };

  //Function to handle the create of a metadata
  const handleCreateMetaData = async () => {
    try {
      const reqBody = formData;
      const res = await MetaDataService.create(reqBody);
      console.log(res);
      setFormData({
        name: "",
        label: "",
        input_type: "",
        supported_values: [] as string[],
        applies_to: [] as string[],
      });
      setRefreshTrigger((prev) => prev + 1);
      setIsAddMetaDataModalOpen(false);
      setToast({
        open: true,
        message: `${reqBody.name} has been added successfully.`,
        severity: "success",
      });
    } catch (err) {
      console.log("Something went wrong", err);
      setToast({
        open: true,
        message: `Error : Failed to create metadata`,
        severity: "error",
      });
    }
  };

  //Function to handle the update of a metadata
  const handleUpdateMetaData = async () => {
    try {
      if (selectedMetaData?.id) {
        const reqBody = selectedMetaData;
        const res = await MetaDataService.update(reqBody.id as number, reqBody);
        console.log(res);
        setRefreshTrigger((prev) => prev + 1);
        setIsEditMetaDataModalOpen(false);
        setSelectedMetaData(null);
        setToast({
          open: true,
          message: `Changes have been saved successfully.`,
          severity: "success",
        });
      } else {
        alert("Invalid Operation");
      }
    } catch (err) {
      console.log("Something went wrong", err);
      setToast({
        open: true,
        message: `Error : Failed to update metadata`,
        severity: "error",
      });
    }
  };

  //Function for Form Validation
  const handleFormValidation = async () => {
    try {
      const res = await MetaDataService.fetch(
        0,
        1,
        formData.name.trim(),
        "id:asc"
      );
      if (res.data?.length > 0 && res.data[0].name === formData.name.trim()) {
        setToast({
          open: true,
          message: `Key already exists`,
          severity: "error",
        });
      } else {
        handleCreateMetaData();
      }
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Failed to create metadata",
        severity: "error",
      });
    }
  };

  return (
    <>
      {/* To view Metadata */}
      {selectedMetaData && isViewMetaDataModalOpen && (
        <ViewMetaDataModal
          open={isViewMetaDataModalOpen}
          metaData={selectedMetaData}
          onClose={() => setIsViewMetaDataModalOpen(false)}
          onEditButtonClick={() => {
            setIsViewMetaDataModalOpen(false);
            setSelectedMetaData(selectedMetaData);
            setIsEditMetaDataModalOpen(true);
          }}
        />
      )}

      {/* To add Metadata */}
      {isAddMetaDataModalOpen && (
        <MetaDataFormModal
          open={isAddMetaDataModalOpen}
          onClose={() => {
            setIsAddMetaDataModalOpen(false);
            setFormData({
              name: "",
              label: "",
              input_type: "",
              supported_values: [] as string[],
              applies_to: [] as string[],
            });
          }}
          operation="create"
          onSubmit={handleFormValidation}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {/* To edit Metadata */}
      {selectedMetaData && isEditMetaDataModalOpen && (
        <MetaDataFormModal
          open={isEditMetaDataModalOpen}
          onClose={() => setIsEditConfirmPopupOpen(true)}
          operation="edit"
          onSubmit={handleUpdateMetaData}
          formData={selectedMetaData}
          setFormData={(val) => {
            if (typeof val === "function") {
              setSelectedMetaData((prev) => val(prev as MetaData));
            } else {
              setSelectedMetaData(val);
            }
          }}
        />
      )}

      <ConfirmDialog
        open={isEditConfirmPopupOpen}
        onClose={() => {
          setIsEditConfirmPopupOpen(false);
        }}
        title="You have unsaved changes"
        description="Are you sure you want to discard the changes?"
        onConfirm={() => {
          setIsEditConfirmPopupOpen(false);
          setSelectedMetaData(null);
          setIsEditMetaDataModalOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Discard"
      />

      {/* To delete Metadata */}
      {selectedMetaData?.id && (
        <ConfirmDialog
          open={isDeleteMetaDataConfirmPopupOpen}
          onClose={() => setIsDeleteMetaDataConfirmPopupOpen(false)}
          onConfirm={handleDeleteMetaData}
          title={"Delete " + selectedMetaData.name + "?"}
          description={"Are you sure about " + selectedMetaData.name + "?"}
          cancelText="Cancel"
          confirmText="Yes, Delete"
          confirmColor="#B20606"
        />
      )}

      <ToastComponent
        open={toast.open}
        onClose={() => setToast((toast) => ({ ...toast, open: false }))}
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

      {/* Landing Page code*/}
      <Box p={5} mb={5}>
        <Stack display={"flex"} flexDirection={"column"} gap={5} mb={5}>
          {/* Row 1: Breadcrumb + Add Button */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            spacing={2}
          >
            <Typography variant="h5" color="#121212" fontWeight={600}>
              Metadata
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "primary.main",
                textTransform: "none",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "#001080",
                },
              }}
              onClick={() => setIsAddMetaDataModalOpen(true)}
            >
              <Typography variant="body1" fontWeight={600} color="#F4F4F4">
                Add Configuration
              </Typography>
            </Button>
          </Stack>

          {/* Row 2: Search + Sort */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            useFlexGap
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            {/* Search Bar */}
            <TextField
              size="small"
              placeholder="Search by key"
              variant="outlined"
              value={searchPattern}
              onChange={(e) => setSearchPattern(e.target.value)}
              sx={{
                borderRadius: 1,
                height: "40px",
                width: "33%",
                minWidth: 200,
                backgroundColor: "#FFFFFF",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Sort */}
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              justifyContent={isMobile ? "flex-start" : "flex-end"}
            >
              <FormControl
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 1,
                  width: 271,
                  height: "40px",
                }}
              >
                <InputLabel id="sort-metadata">Sort</InputLabel>
                <Select
                  size="small"
                  label="Sort"
                  labelId="sort-metadata"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  {sortItems.map((item) => {
                    return (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {/* <Button
                variant="outlined"
                endIcon={<FilterAltOutlined />}
                onClick={() => console.log("Open Filter")}
                sx={{
                  textTransform: "none",
                  borderColor: "#ccc",
                  color: "black",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 1,
                }}
              >
                Filter
              </Button> */}
            </Stack>
          </Stack>
        </Stack>

        <Stack
          spacing={3}
          sx={{
            overflow: "auto",
            maxHeight: "calc(100vh - 350px)",
          }}
        >
          {metaDatas &&
            metaDatas?.length > 0 &&
            metaDatas?.map((item, index) => (
              <MetaDataCard
                key={index}
                keyLabel={item.name}
                values={item.supported_values}
                onEdit={() => {
                  setSelectedMetaData(item);
                  setIsEditMetaDataModalOpen(true);
                }}
                onDelete={() => {
                  setSelectedMetaData(item);
                  setIsDeleteMetaDataConfirmPopupOpen(true);
                }}
                onClick={() => {
                  setSelectedMetaData(item);
                  setIsViewMetaDataModalOpen(true);
                }}
              />
            ))}
        </Stack>
      </Box>
    </>
  );
};

export default withAuth(Index);
