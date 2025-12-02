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
  setSelectedControlFrameworkRecord: React.Dispatch<
    React.SetStateAction<ControlFrameworkForm | null>
  >;
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
      <Stack
        spacing={2}
        sx={{ overflow: "auto", maxHeight: "calc(100vh - 356px)" }}
      >
        {data && data.length > 0 ? (
          data.map((item) => (
            <div key={item.id ?? JSON.stringify(item)}>
              <ControlFrameworkCard
                controlFrameworkRecord={item}
                setSelectedControlFrameworkRecord={
                  setSelectedControlFrameworkRecord
                }
                setIsViewOpen={setIsViewOpen}
                setIsEditOpen={setIsEditOpen}
                setIsDeleteConfirmPopupOpen={setIsDeleteConfirmOpen}
                handleUpdateStatus={handleUpdateStatus}
                rowID={item.frameWorkControlCategoryId ?? ""}
                headerChip={"Not Defined"}
                title={item.frameWorkControlCategory ?? ""}
                status={item.status ?? ""}
                lastUpdated={item.updated_at}
                footerChips={[
                  {
                    label: "Sub-Category ID:",
                    value: item.frameWorkControlSubCategoryId,
                  },
                ]}
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
          rowsPerPageOptions={[6, 12, 18, 24, 30]}
        />
      </Box>
    </>
  );
};

export default ControlFrameworkList;
