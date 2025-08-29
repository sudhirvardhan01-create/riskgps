import { Box, Stack, TablePagination } from "@mui/material";
import { ThreatForm } from "@/types/threat";
import ThreatCard from "./ThreatCard";

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
  handleUpdateStatus: (id: number, status: string) => void;
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
      <Box
        display={"flex"}
        flexDirection={"column"}
        sx={{ maxHeight: "calc(100vh - 290px)" }}
      >
        <Stack spacing={2} sx={{ overflow: "auto" }}>
          {data && data.length > 0 ? (
            data.map((item) => (
              <div key={item.id ?? JSON.stringify(item)}>
                <ThreatCard
                  threatData={item}
                  setSelectedThreatData={setSelectedThreat}
                  setIsViewThreatOpen={setIsViewOpen}
                  setIsEditThreatOpen={setIsEditOpen}
                  setIsDeleteConfirmPopupOpen={setIsDeleteConfirmOpen}
                  handleUpdateStatus={handleUpdateStatus}
                  threatTechniqueID={item.mitreTechniqueId ?? ""}
                  mitrePlatform={item.platforms.join(", ") ?? ""}
                  threatTechniqueName={item.mitreTechniqueName ?? ""}
                  status={item.status ?? ""}
                  ciaMapping={item.ciaMapping}
                  tagItems={[
                    { label: "MITRE Control ID", value: item.mitreControlId },
                    {
                      label: "MITRE Control Name",
                      value: item.mitreControlName,
                    },
                    {
                      label: "MITRE Control Type",
                      value: item.mitreControlType,
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
            mb: -2,
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

export default ThreatList;
