import { Box, Stack, TablePagination } from "@mui/material";
import { ControlForm, MITREControlForm } from "@/types/control";
import ThreatControlCard from "../ThreatControlCard";

interface Props {
  loading: boolean;
  data: MITREControlForm[];
  totalRows: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (e: any, page: number) => void;
  onRowsPerPageChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setSelectedControl: React.Dispatch<React.SetStateAction<MITREControlForm | null>>;
  setIsViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateStatus: (
    status: string,
    mitreControlId: string,
    mitreControlName?: string
  ) => void;
  setIsSelectControlsToDeleteOpen?: React.Dispatch<React.SetStateAction<boolean>>;
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
  setIsSelectControlsToDeleteOpen,
}) => {
  return (
    <>
      <Stack
        spacing={2}
        sx={{ overflow: "auto", maxHeight: "calc(100vh - 390px)" }}
      >
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
                headerChip={""}
                title={item.controlDetails.map((item) => item.mitreControlName).join(", ") ?? ""}
                status={item.status ?? ""}
                lastUpdated={item.updated_at}
                footerChips={[{label: "MITRE Control Type:", value: item.mitreControlType ?? ""}]}
                setIsSelectControlsToDeleteOpen={setIsSelectControlsToDeleteOpen}
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
          rowsPerPageOptions={[6, 12, 18, 24, 30]}
        />
      </Box>
    </>
  );
};

export default ControlList;
