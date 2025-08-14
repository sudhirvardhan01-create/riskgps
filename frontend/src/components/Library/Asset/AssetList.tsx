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
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
      <Stack spacing={2} sx={{ overflow: "auto", maxHeight: "calc(100vh - 290px)" }}>
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
                desc={item.assetDescription ?? ""}
                chip={item.industry?.length ? item.industry.join(",") : "Not Defined"}
                status={item.status ?? ""}
                lastUpdated={item.updatedAt ?? ""}
                tagItems={[
                //   { label: "Tags", value: item.tags },
                  { label: "Processes", value: item.relatedProcesses },
                //   { label: "Assets", value: item.assets },
                //   { label: "Threats", value: item.threats },
                ]}
              />
            </div>
          ))
        ) : (
          // empty state could be enhanced
          <div>No assets found</div>
        )}
      </Stack>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2 }}>
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
