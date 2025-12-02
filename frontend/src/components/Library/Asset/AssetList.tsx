import { Box, Stack, TablePagination } from "@mui/material";
import LibraryCard from "@/components/Library/LibraryCard";
import { AssetForm } from "@/types/asset";

interface Props {
  loading: boolean;
  data: AssetForm[];
  totalRows: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (e: any, page: number) => void;
  onRowsPerPageChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setSelectedAsset: React.Dispatch<React.SetStateAction<AssetForm | null>>;
  setIsViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateStatus: (id: number, status: string) => void;
}

const AssetList: React.FC<Props> = ({
  data,
  totalRows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  setSelectedAsset,
  setIsViewOpen,
  setIsEditOpen,
  setIsDeleteConfirmOpen,
  handleUpdateStatus,
}) => {
  return (
    <>
      <Stack
        spacing={2}
        sx={{ overflow: "auto", maxHeight: "calc(100vh - 300px)" }}
      >
        {data && data.length > 0 ? (
          data.map((item) => (
            <div key={item.id ?? item.assetCode ?? JSON.stringify(item)}>
              <LibraryCard
                libraryData={item}
                setSelectedLibraryData={setSelectedAsset}
                setIsViewLibraryOpen={setIsViewOpen}
                setIsEditLibraryOpen={setIsEditOpen}
                setIsDeleteConfirmPopupOpen={setIsDeleteConfirmOpen}
                handleUpdateStatus={handleUpdateStatus}
                title={item.assetCode ?? ""}
                desc={item.applicationName ?? ""}
                chip={item.assetCategory ? item.assetCategory : "Not Defined"}
                status={item.status ?? ""}
                lastUpdated={item.updatedAt ?? ""}
                tagItems={[
                  {
                    label: "Linked Processes",
                    value:
                      item.relatedProcesses?.length === 0
                        ? "0"
                        : item.relatedProcesses?.length,
                  },
                ]}
                module="Asset"
                footerChipKey="Third Party Involvement"
                footerChipValue={
                  item.isThirdPartyManagement === null
                    ? "Not Defined"
                    : item.isThirdPartyManagement === true
                    ? "Yes"
                    : "No"
                }
              />
            </div>
          ))
        ) : (
          // empty state could be enhanced
          <div>No assets found</div>
        )}
      </Stack>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          bottom: 0,
          left: "140px",
          right: "30px",
          zIndex: 1000,
          // position: "absolute",
          // bottom: 55,
          // left: "50%", // place horizontally at 50%
          // transform: "translateX(-50%)",
        }}
      >
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[2, 6, 12, 18, 24, 30]}
        />
      </Box>
    </>
  );
};

export default AssetList;
