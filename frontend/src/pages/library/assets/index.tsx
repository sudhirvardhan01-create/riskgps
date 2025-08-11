import {
  Box,
  Typography,
  Stack,
  Select,
  MenuItem,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
  useMediaQuery,
  InputLabel,
  FormControl,
  TablePagination,
} from "@mui/material";
import { useRouter } from "next/router";
import { FilterAltOutlined, ArrowBack, Search } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import AssetFormModal from "@/components/Library/Asset/AssetFormModal";
import {
  createAsset,
  updateAsset,
  deleteAsset,
  fetchAssets,
  updateAssetStatus,
} from "@/pages/api/asset";
import { fetchProcesses } from "@/pages/api/process";
import { fetchMetaDatas } from "@/pages/api/meta-data";
import ConfirmDialog from "@/components/ConfirmDialog";
import FilterComponent from "@/components/Library/FilterComponent";
import ToastComponent from "@/components/ToastComponent";
import withAuth from "@/hoc/withAuth";
import { AssetAttributes, AssetForm } from "@/types/asset";
import ViewAssetModal from "@/components/Library/Asset/ViewAssetModal";
import AssetCard from "@/components/Library/Asset/AssetCard";

const Index = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalRows, setTotalRows] = useState(-1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [assetsData, setAssetsData] = useState<AssetForm[]>();
  const [processesData, setProcessesData] = useState([]);
  const [metaDatas, setMetaDatas] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState<AssetForm | null>(null);
  const [isDeleteConfirmPopupOpen, setIsDeleteConfirmPopupOpen] =
    useState(false);
  const [isAddConfirmPopupOpen, setIsAddConfirmPopupOpen] = useState(false);
  const [isEditConfirmPopupOpen, setIsEditConfirmPopupOpen] = useState(false);
  const [isViewRiskScenarioOpen, setIsViewRiskScenarioOpen] = useState(false);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isEditRiskScenarioOpen, setIsEditRiskScenarioOpen] = useState(false);
  const [isAddDeleteRSSuccessToastOpen, setIsAddDeleteRSSuccessToastOpen] =
    useState(false);
  const [addDeleteRSSuccessToastMessage, setAddDeleteRSSuccessToastMessage] =
    useState("");
  const [assetFormData, setAssetFormData] = useState<AssetForm>({
    assetName: "",
    assetCategory: "",
    assetDescription: "",
    assetOwner: "",
    assetITOwner: "",
    isThirdPartyManagement: null,
    thirdPartyName: "",
    thirdPartyLocation: "",
    hosting: "",
    hostingFacility: "",
    cloudServiceProvider: [],
    geographicLocation: "",
    isRedundancy: null,
    databases: "",
    isNetworkSegmentation: null,
    networkName: "",
    attributes: [{ meta_data_key_id: null, values: [] }] as AssetAttributes[],
  });
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  // useEffect(() => {
  //   const getAssetsData = async () => {
  //     try {
  //       setLoading(true);
  //       const data = await fetchAssets(page, rowsPerPage);
  //       setAssetsData(data.data);
  //       setTotalRows(data.total);
  //     } catch (error) {
  //       console.error("Error fetching risk scenarios:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getAssetsData();
  // }, [page, rowsPerPage, refreshTrigger]);

  useEffect(() => {
    const getProcessesData = async () => {
      try {
        setLoading(true);
        const data = await fetchProcesses();
        setProcessesData(data);
      } catch (error) {
        console.error("Error fetching risk scenarios:", error);
      } finally {
        setLoading(false);
      }
    };
    getProcessesData();
  }, []);

  useEffect(() => {
    const getMetaDatas = async () => {
      try {
        setLoading(true);
        const data = await fetchMetaDatas();
        setMetaDatas(data);
      } catch (error) {
        console.error("Error fetching risk scenarios:", error);
      } finally {
        setLoading(false);
      }
    };
    getMetaDatas();
  }, []);

  const handleCreateAsset = async (status: string) => {
    try {
      const reqBody = assetFormData;
      reqBody.status = status;
      const res = await createAsset(reqBody);
      console.log(res);
      setAssetFormData({
        assetName: "",
        assetCategory: "",
        assetDescription: "",
        assetOwner: "",
        assetITOwner: "",
        isThirdPartyManagement: null,
        thirdPartyName: "",
        thirdPartyLocation: "",
        hosting: "",
        hostingFacility: "",
        cloudServiceProvider: [],
        geographicLocation: "",
        isRedundancy: null,
        databases: "",
        isNetworkSegmentation: null,
        networkName: "",
        attributes: [
          { meta_data_key_id: null, values: [] },
        ] as AssetAttributes[],
      });
      setRefreshTrigger((prev) => prev + 1);
      setIsAddAssetOpen(false);
      //alert("created");
      setIsAddDeleteRSSuccessToastOpen(true);
      setAddDeleteRSSuccessToastMessage(
        `Success! The risk scenario RS-ID has been ${
          status === "published" ? "published" : "saved as a draft"
        }`
      );
    } catch (err) {
      console.log("Something went wrong", err);
    }
  };

  const handleUpdateAsset = async (status: string) => {
    try {
      if (selectedAsset?.id) {
        console.log(selectedAsset);
        const reqBody = selectedAsset;
        reqBody.status = status;
        const res = await updateAsset(reqBody.id as number, reqBody);
        console.log(res);
        setRefreshTrigger((prev) => prev + 1);
        setIsEditRiskScenarioOpen(false);
        setSelectedAsset(null);
        alert("updated");
      } else {
        alert("Invalid operation");
      }
    } catch (err) {
      console.log("Something went wrong", err);
    }
  };

  const handleUpdateAssetStatus = async (id: number, status: string) => {
    try {
      const res = await updateAssetStatus(id, status);
      console.log(res);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.log("Something went wrong", err);
    }
  };

  const handleDeleteAsset = async () => {
    try {
      if (selectedAsset?.id) {
        const res = await deleteAsset(selectedAsset?.id as number);
        console.log(res);
        setRefreshTrigger((prev) => prev + 1);
        setIsDeleteConfirmPopupOpen(false);
        setIsAddDeleteRSSuccessToastOpen(true);
        setAddDeleteRSSuccessToastMessage(
          `Success! The risk scenario RS-${selectedAsset?.id} has been deleted`
        );
      } else {
        throw new Error("Invalid ID");
      }
    } catch (err) {
      console.log("Something went wrong", err);
      alert("Failed to Delete");
    }
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
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
      {selectedAsset && isViewRiskScenarioOpen && (
        <ViewAssetModal
          assetData={selectedAsset}
          setIsEditAssetOpen={setIsEditRiskScenarioOpen}
          setSelectedAsset={setSelectedAsset}
          processes={processesData}
          metaDatas={metaDatas}
          open={isViewRiskScenarioOpen}
          onClose={() => {
            setIsViewRiskScenarioOpen(false);
          }}
        />
      )}
      {selectedAsset?.id && (
        <ConfirmDialog
          open={isDeleteConfirmPopupOpen}
          onClose={() => {
            setIsDeleteConfirmPopupOpen(false);
          }}
          title="Confirm Risk Scenario Deletion?"
          description={
            "Are you sure you want to delete Risk Scenario #" +
            selectedAsset?.id +
            "? All associated data will be removed from the system."
          }
          onConfirm={handleDeleteAsset}
          cancelText="Cancel"
          confirmText="Yes, Delete"
        />
      )}
      {isAddAssetOpen && (
        <AssetFormModal
          operation={"create"}
          open={isAddAssetOpen}
          assetFormData={assetFormData}
          setAssetFormData={setAssetFormData}
          processes={processesData}
          metaDatas={metaDatas}
          onSubmit={handleCreateAsset}
          onClose={() => {
            setIsAddConfirmPopupOpen(true);
          }}
        />
      )}

      <ConfirmDialog
        open={isAddConfirmPopupOpen}
        onClose={() => {
          setIsAddConfirmPopupOpen(false);
        }}
        title="Cancel Risk Scenario Creation?"
        description="Are you sure you want to cancel the risk scenario creation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsAddConfirmPopupOpen(false);
          setAssetFormData({
            assetName: "",
            assetCategory: "",
            assetDescription: "",
            assetOwner: "",
            assetITOwner: "",
            isThirdPartyManagement: null,
            thirdPartyName: "",
            thirdPartyLocation: "",
            hosting: "",
            hostingFacility: "",
            cloudServiceProvider: [],
            geographicLocation: "",
            isRedundancy: null,
            databases: "",
            isNetworkSegmentation: null,
            networkName: "",
            attributes: [
              { meta_data_key_id: null, values: [] },
            ] as AssetAttributes[],
          });
          setIsAddAssetOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <ToastComponent
        open={isAddDeleteRSSuccessToastOpen}
        onClose={() => setIsAddDeleteRSSuccessToastOpen(false)}
        message={addDeleteRSSuccessToastMessage}
        toastBorder="1px solid #147A50"
        toastColor="#147A50"
        toastBackgroundColor="#DDF5EB"
        toastSeverity="success"
      />

      {isEditRiskScenarioOpen && selectedAsset && (
        <AssetFormModal
          operation={"edit"}
          open={isEditRiskScenarioOpen}
          assetFormData={selectedAsset}
          processes={processesData}
          metaDatas={metaDatas}
          setAssetFormData={(val) => {
            if (typeof val === "function") {
              setSelectedAsset((prev) => val(prev as AssetForm));
            } else {
              setSelectedAsset(val);
            }
          }}
          onSubmit={handleUpdateAsset}
          onClose={() => {
            setIsEditConfirmPopupOpen(true);
          }}
        />
      )}

      <ConfirmDialog
        open={isEditConfirmPopupOpen}
        onClose={() => {
          setIsEditConfirmPopupOpen(false);
        }}
        title="Cancel Risk Scenario Updation?"
        description="Are you sure you want to cancel the risk scenario updation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsEditConfirmPopupOpen(false);
          setSelectedAsset(null);
          setIsEditRiskScenarioOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      <FilterComponent
        items={["Published", "Draft", "Disabled"]}
        open={isOpenFilter}
        onClose={() => setIsOpenFilter(false)}
        onClear={() => setIsOpenFilter(false)}
        onApply={() => setIsOpenFilter(false)}
      />

      <Box p={2} sx={{ pb: 8 }}>
        <Box mb={3}>
          {/* Row 1: Breadcrumb + Add Button */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton onClick={() => router.back()} size="small">
                <ArrowBack fontSize="small" />
              </IconButton>
              <Typography variant="body1" color="textPrimary">
                Library /
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "primary.main", fontWeight: 600 }}
              >
                Assets
              </Typography>
            </Stack>

            <Button
              onClick={() => {
                setIsAddAssetOpen(true);
              }}
              variant="contained"
              sx={{
                backgroundColor: "primary.main",
                textTransform: "none",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "#001080",
                },
              }}
            >
              Add Asset
            </Button>
          </Stack>

          {/* Row 2: Search + Sort + Filter */}
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
              placeholder="Search by keywords"
              variant="outlined"
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

            {/* Right Controls */}
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              justifyContent={isMobile ? "flex-start" : "flex-end"}
            >
              <FormControl sx={{ backgroundColor: "#FFFFFF", borderRadius: 1 }}>
                <InputLabel id="sort-assets">Sort</InputLabel>
                <Select
                  size="small"
                  defaultValue="Asset ID (Ascending)"
                  label="Sort"
                  labelId="sort-assets"
                >
                  <MenuItem value="Asset ID (Ascending)">
                    Asset ID (Ascending)
                  </MenuItem>
                  <MenuItem value="Asset ID (Descending)">
                    Asset ID (Descending)
                  </MenuItem>
                  <MenuItem value="Created (Latest to Oldest)">
                    Created (Latest to Oldest)
                  </MenuItem>
                  <MenuItem value="Created (Oldest to Latest)">
                    Created (Oldest to Latest)
                  </MenuItem>
                  <MenuItem value="Updated (Latest to Oldest)">
                    Updated (Latest to Oldest)
                  </MenuItem>
                  <MenuItem value="Updated (Oldest to Latest)">
                    Updated (Oldest to Latest)
                  </MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                endIcon={<FilterAltOutlined />}
                onClick={() => setIsOpenFilter(true)}
                sx={{
                  textTransform: "none",
                  borderColor: "#ccc",
                  color: "black",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 1,
                }}
              >
                Filter
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Stack spacing={2}>
          {assetsData &&
            assetsData?.length > 0 &&
            assetsData?.map((item: AssetForm, index) => (
              <div key={index}>
                <AssetCard
                  key={index}
                  assetData={item}
                  handleUpdateAssetStatus={handleUpdateAssetStatus}
                  setIsViewAssetOpen={setIsViewRiskScenarioOpen}
                  setSelectedAsset={setSelectedAsset}
                  setIsEditAssetOpen={setIsEditRiskScenarioOpen}
                  setIsDeleteConfirmPopupOpen={setIsDeleteConfirmPopupOpen}
                />
              </div>
            ))}
        </Stack>

        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TablePagination
            component="div"
            count={totalRows}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[2, 6, 12, 18, 24, 30]}
          />
        </Box>
      </Box>
    </>
  );
};

export default Index;
