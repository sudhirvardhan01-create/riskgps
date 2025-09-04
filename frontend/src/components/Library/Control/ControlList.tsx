import { Box, Stack, TablePagination } from "@mui/material";
import { ControlForm } from "@/types/control";
import ThreatControlCard from "../ThreatControlCard";

interface Props {
  loading: boolean;
  data: ControlForm[];
  totalRows: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (e: any, page: number) => void;
  onRowsPerPageChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setSelectedControl: React.Dispatch<React.SetStateAction<ControlForm | null>>;
  setIsViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateStatus: (id: number, status: string) => void;
}

const ControlList: React.FC<Props> = ({
  data,
  totalRows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  setSelectedControl,
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
                <ThreatControlCard
                  module="control"
                  threatControlData={item}
                  setSelectedData={setSelectedControl}
                  setIsViewOpen={setIsViewOpen}
                  setIsEditOpen={setIsEditOpen}
                  setIsDeleteConfirmPopupOpen={setIsDeleteConfirmOpen}
                  handleUpdateStatus={handleUpdateStatus}
                  rowID={item.mitreControlId ?? ""}
                  headerChip={item.mitreControlType ?? ""}
                  title={item.mitreControlName ?? ""}
                  status={item.status ?? ""}
                  lastUpdated={item.updated_at}
                  footerChips={[
                    { label: "NIST 2.0 Control Category ID:", value: item.nistControls?.[0].frameWorkControlCategoryId },
                    { label: "NIST 2.0 Control Category:", value: item.nistControls?.[0].frameWorkControlCategory },
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

export default ControlList;
