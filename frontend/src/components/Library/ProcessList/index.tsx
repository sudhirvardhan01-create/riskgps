import { Box, Stack, TablePagination } from "@mui/material";
import LibraryCard from "@/components/Library/LibraryCard";
import { ProcessData } from "@/types/process";

interface Props {
  loading: boolean;
  data: ProcessData[];
  totalRows: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (e: any, page: number) => void;
  onRowsPerPageChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setSelectedProcess: React.Dispatch<React.SetStateAction<ProcessData | null>>;
  setIsViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateStatus: (id: number, status: string) => void;
}

const ProcessList: React.FC<Props> = ({
  data,
  totalRows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  setSelectedProcess,
  setIsViewOpen,
  setIsEditOpen,
  setIsDeleteConfirmOpen,
  handleUpdateStatus,
}) => {
  console.log(data);
  return (
    <>
      <Stack
        spacing={2}
        sx={{ overflow: "auto", maxHeight: "calc(100vh - 340px)" }}
      >
        {data && data.length > 0 ? (
          data.map((item) => (
            <div key={item.id ?? item.processCode ?? JSON.stringify(item)}>
              <LibraryCard
                libraryData={item}
                setSelectedLibraryData={setSelectedProcess}
                setIsViewLibraryOpen={setIsViewOpen}
                setIsEditLibraryOpen={setIsEditOpen}
                setIsDeleteConfirmPopupOpen={setIsDeleteConfirmOpen}
                handleUpdateStatus={handleUpdateStatus}
                title={item.processCode ?? ""}
                desc={item.processName ?? ""}
                chip={
                  item.industry?.length
                    ? item.industry.join(", ")
                    : "Not Defined"
                }
                status={item.status ?? ""}
                lastUpdated={item.lastUpdated ?? ""}
                tagItems={[
                  { label: "Dependant Processes", value:item.processDependency?.length },
                  { label: "Follows", value: item.processDependency?.filter((pd) => (pd.relationshipType === "follows" && item.id === pd.sourceProcessId) || (pd.relationshipType === "precedes" && item.id === pd.targetProcessId))?.length },
                  { label: "Precedes", value: item.processDependency?.filter((pd) => (pd.relationshipType === "precedes" && item.id === pd.sourceProcessId) || (pd.relationshipType === "follows" && item.id === pd.targetProcessId))?.length },
                ]}
                module="Process"
                footerChipKey="Users"
                footerChipValue={item.users ? item.users : "Not Defined"}
              />
            </div>
          ))
        ) : (
          // empty state could be enhanced
          <div>No process found</div>
        )}
      </Stack>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: 55,
          left: "50%", // place horizontally at 50%
          transform: "translateX(-50%)",
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

export default ProcessList;
