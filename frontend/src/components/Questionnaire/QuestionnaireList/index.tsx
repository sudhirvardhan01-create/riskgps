import { Box, Stack, TablePagination } from "@mui/material";
import QuestionnaireCard from "../QuestionnaireCard";
import { QuestionnaireData } from "@/types/questionnaire";

interface Props {
  loading: boolean;
  data: QuestionnaireData[];
  totalRows: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (e: any, page: number) => void;
  onRowsPerPageChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setSelectedRecord: React.Dispatch<
    React.SetStateAction<QuestionnaireData | null>
  >;
  setIsViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateStatus: (id: string, status: string) => void;
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
        sx={{ overflow: "auto", maxHeight: "calc(100vh - 390px)" }}
      >
        {data && data.length > 0 ? (
          data.map((item) => (
            <div
              key={
                item.questionnaireId ??
                item.questionCode ??
                JSON.stringify(item)
              }
            >
              <QuestionnaireCard
                recordData={item}
                setSelectedRecordData={setSelectedRecord}
                setIsViewOpen={setIsViewOpen}
                setIsEditOpen={setIsEditOpen}
                setIsDeleteConfirmPopupOpen={setIsDeleteConfirmOpen}
                handleUpdateStatus={handleUpdateStatus}
                title={item.questionCode ?? ""}
                desc={item.question ?? ""}
                status={item.status ?? ""}
                lastUpdated={item.modifiedDate ?? ""}
                tagItems={[
                  {
                    label: "Linked Controls",
                    value:
                      item.mitreControlId?.length === 0
                        ? "0"
                        : item.mitreControlId?.length,
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
