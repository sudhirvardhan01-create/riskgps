import { Box, Stack, TablePagination } from "@mui/material";
import { AssetForm } from "@/types/asset";
import QuestionnaireCard from "../QuestionnaireCard";

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
  setSelectedRecord: React.Dispatch<React.SetStateAction<AssetForm | null>>;
  setIsViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateStatus: (id: number, status: string) => void;
}

const QuestionnaireList: React.FC<Props> = ({
  data,
  totalRows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  setSelectedRecord,
  setIsViewOpen,
  setIsEditOpen,
  setIsDeleteConfirmOpen,
  handleUpdateStatus,
}) => {
  return (
    <>
      <Stack
        spacing={2}
        sx={{ overflow: "auto", maxHeight: "calc(100vh - 340px)" }}
      >
        {data && data.length > 0 ? (
          data.map((item) => (
            <div key={item.id ?? item.assetCode ?? JSON.stringify(item)}>
              <QuestionnaireCard
                recordData={item}
                setSelectedRecordData={setSelectedRecord}
                setIsViewOpen={setIsViewOpen}
                setIsEditOpen={setIsEditOpen}
                setIsDeleteConfirmPopupOpen={setIsDeleteConfirmOpen}
                handleUpdateStatus={handleUpdateStatus}
                title={item.assetCode ?? ""}
                desc={item.applicationName ?? ""}
                status={item.status ?? ""}
                lastUpdated={item.updatedAt ?? ""}
                tagItems={[
                  {
                    label: "Linked Controls",
                    value:
                      item.relatedProcesses?.length === 0
                        ? "0"
                        : item.relatedProcesses?.length,
                  },
                ]}
              />
            </div>
          ))
        ) : (
          // empty state could be enhanced
          <div>No records found</div>
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

export default QuestionnaireList;
