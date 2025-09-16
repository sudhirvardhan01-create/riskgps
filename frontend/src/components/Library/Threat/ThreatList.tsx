import { Box, Stack, TablePagination } from "@mui/material";
import { ThreatForm } from "@/types/threat";
import ThreatControlCard from "../ThreatControlCard";

interface Props {
  loading: boolean;
  data: ThreatForm[];
  totalRows: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (e: any, page: number) => void;
  onRowsPerPageChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setSelectedThreat: React.Dispatch<React.SetStateAction<ThreatForm | null>>;
  setIsViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateStatus: (
    status: string,
    mitreTechniqueId: string,
    subTechniqueId?: string
  ) => void;
}

const ThreatList: React.FC<Props> = ({
  data,
  totalRows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  setSelectedThreat,
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
            <div key={item.id ?? JSON.stringify(item)}>
              <ThreatControlCard
                module="threat"
                threatControlData={item}
                setSelectedData={setSelectedThreat}
                setIsViewOpen={setIsViewOpen}
                setIsEditOpen={setIsEditOpen}
                setIsDeleteConfirmPopupOpen={setIsDeleteConfirmOpen}
                handleUpdateStatus={handleUpdateStatus}
                rowID={item.mitreTechniqueId ?? ""}
                headerChip={item.platforms.join(", ") ?? ""}
                title={item.mitreTechniqueName ?? ""}
                status={item.status ?? ""}
                lastUpdated={item.updated_at}
                footerChips={[
                  {
                    label: "CIA Mapping:",
                    value: item.ciaMapping?.join(","),
                  },
                ]}
              />
            </div>
          ))
        ) : (
          // empty state could be enhanced
          <div>No threats found</div>
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

export default ThreatList;
