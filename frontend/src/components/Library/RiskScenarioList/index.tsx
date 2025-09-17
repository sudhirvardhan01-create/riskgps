import { Box, Stack, TablePagination } from "@mui/material";
import LibraryCard from "@/components/Library/LibraryCard";
import { RiskScenarioData } from "@/types/risk-scenario";

interface Props {
  loading: boolean;
  data: RiskScenarioData[];
  totalRows: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (e: any, page: number) => void;
  onRowsPerPageChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setSelectedRiskScenario: React.Dispatch<
    React.SetStateAction<RiskScenarioData | null>
  >;
  setIsViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateStatus: (id: number, status: string) => void;
}

const RiskScenarioList: React.FC<Props> = ({
  data,
  totalRows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  setSelectedRiskScenario,
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
            <div key={item.id ?? item.risk_code ?? JSON.stringify(item)}>
              <LibraryCard
                libraryData={item}
                setSelectedLibraryData={setSelectedRiskScenario}
                setIsViewLibraryOpen={setIsViewOpen}
                setIsEditLibraryOpen={setIsEditOpen}
                setIsDeleteConfirmPopupOpen={setIsDeleteConfirmOpen}
                handleUpdateStatus={handleUpdateStatus}
                title={item.risk_code ?? ""}
                desc={item.riskScenario ?? ""}
                chip={
                  item.industry?.length
                    ? item.industry.join(", ")
                    : "Not Defined"
                }
                status={item.status ?? ""}
                lastUpdated={item.lastUpdated ?? ""}
                tagItems={[
                  { label: "Tags", value: item.attributes?.length },
                  { label: "Processes", value: item.related_processes?.length },
                ]}
              />
            </div>
          ))
        ) : (
          // empty state could be enhanced
          <div>No risk scenarios found</div>
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

export default RiskScenarioList;
