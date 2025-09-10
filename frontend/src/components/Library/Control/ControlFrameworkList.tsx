import { Box, Stack, TablePagination } from "@mui/material";
import { ControlFrameworkForm } from "@/types/control";
import ControlFrameworkCard from "./ControlFrameworkCard";


interface Props {
  loading: boolean;
  data: ControlFrameworkForm[];
  totalRows: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (e: any, page: number) => void;
  onRowsPerPageChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setSelectedControlFrameworkRecord: React.Dispatch<React.SetStateAction<ControlFrameworkForm | null>>;
  setIsViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateStatus: (id: number, status: string) => void;
}

const ControlFrameworkList: React.FC<Props> = ({
  data,
  totalRows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  setSelectedControlFrameworkRecord,
  setIsViewOpen,
  setIsEditOpen,
  setIsDeleteConfirmOpen,
  handleUpdateStatus,
}) => {
  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"column"}
        sx={{ maxHeight: "calc(100vh - 290px)" }}
      >
        <Stack spacing={2} sx={{ overflow: "auto" }}>
          {data && data.length > 0 ? (
            data.map((item) => (
              <div key={item.id ?? JSON.stringify(item)}>
                <ControlFrameworkCard
                  controlFrameworkRecord={item}
                  setSelectedControlFrameworkRecord={setSelectedControlFrameworkRecord}
                  setIsViewOpen={setIsViewOpen}
                  setIsEditOpen={setIsEditOpen}
                  setIsDeleteConfirmPopupOpen={setIsDeleteConfirmOpen}
                  handleUpdateStatus={handleUpdateStatus}
                  rowID={item.frameWorkControlCategoryId ?? ""}
                  headerChip={"Not Defined"}
                  title={item.frameWorkControlCategory?? ""}
                  status={item.status ?? ""}
                  lastUpdated={item.updated_at}
                  footerChips={[{label: "Sub-Category ID", value: "ID"}]}
                />
              </div>
            ))
          ) : (
            // empty state could be enhanced
            <div>No controls found</div>
          )}
        </Stack>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: -0.5,
          }}
        >
          <TablePagination
            component="div"
            count={totalRows}
            page={page}
            onPageChange={onPageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange}
            rowsPerPageOptions={[6, 12, 18, 24, 30]}
          />
        </Box>
      </Box>
    </>
  );
};

export default ControlFrameworkList;
