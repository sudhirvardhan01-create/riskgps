import { Box, Stack, TablePagination, Typography } from "@mui/material";
import { Organization } from "@/types/organization";
import OrgCard from "../OrgCard";
import OrgHeader from "../OrgHeader";

interface Props {
  data: Organization[];
  totalRows: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: any, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setSelectedOrganization: React.Dispatch<React.SetStateAction<Organization | null>>;
  setIsDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onEditOrganization?: (organization: Organization) => void;
}

const OrgList: React.FC<Props> = ({
  data,
  totalRows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  setSelectedOrganization,
  setIsDeleteConfirmOpen,
  onSort,
  sortField,
  sortDirection,
  onEditOrganization,
}) => {
  return (
    <>
      {/* Fixed Header */}
      <Box sx={{ mb: "24px" }}>
        <OrgHeader
          onSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      </Box>

      {/* org details card */}
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Stack
          spacing={2}
          sx={{
            flex: 1,
            overflowY: "auto",
            scrollbarWidth: "none",
            pb: "130px"
          }}
        >
          {data && data.length > 0 ? (
            data.map((organization) => (
              <div key={organization.id}>
                <OrgCard
                  organization={organization}
                  setSelectedOrganization={setSelectedOrganization}
                  setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
                  onEditOrganization={onEditOrganization}
                />
              </div>
            ))
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No organizations found
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
      {/* Pagination */}
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
        }}
      >
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 15, 20]}
        />
      </Box>
    </>
  );
};

export default OrgList;
