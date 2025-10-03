import { Box, Stack, TablePagination, Typography, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Search } from "@mui/icons-material";
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
  setIsViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  // handleUpdateStatus: (id: string, status: string) => void;
  localSearch?: string;
  handleSearchChange?: (val: string) => void;
  statusFilter?: string;
  handleStatusChange?: (val: string) => void;
}

const OrgList: React.FC<Props> = ({
  data,
  totalRows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  setSelectedOrganization,
  setIsViewOpen,
  setIsEditOpen,
  setIsDeleteConfirmOpen,
  onSort,
  sortField,
  sortDirection,
  // handleUpdateStatus,
  localSearch,
  handleSearchChange,
  statusFilter,
  handleStatusChange,
}) => {
  return (
    <>
      {/* Search and Status Filter Row */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        useFlexGap
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{ mb: 2 }}
      >
        {/* Search Input Field */}
        <TextField
          size="small"
          placeholder="Search by User ID, Username"
          value={localSearch}
          onChange={(event) => handleSearchChange?.(event.target.value)}
          variant="outlined"
          sx={{
            borderRadius: 1,
            height: 40,
            width: { xs: "100%", sm: "33%" },
            minWidth: 200,
            backgroundColor: "#E7E7E84D",

            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "1px solid #D9D9D9",
              },
              "&:hover fieldset": {
                border: "1px solid #D9D9D9",
              },
              "&.Mui-focused fieldset": {
                border: "1px solid #D9D9D9",
              },
            },

            "& .MuiInputBase-input::placeholder": {
              fontWeight: 400,
              verticalAlign: "middle",
              opacity: 1,
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Status Dropdown */}
        <FormControl
          size="small"
          sx={{
            borderRadius: 1,
            width: { xs: "100%", sm: "200px" },
            minWidth: 150,
            height: 40,
            "& .MuiOutlinedInput-root": {
              height: 40,
              "& fieldset": {
                border: "1px solid #484848",
              },
              "&:hover fieldset": {
                border: "1px solid #484848",
              },
              "&.Mui-focused fieldset": {
                border: "1px solid #484848",
              },
            },
          }}
        >
          <Select
            value={statusFilter || "all"}
            onChange={(event) => handleStatusChange?.(event.target.value)}
            displayEmpty
            renderValue={(selected) => {
              const statusText = selected === "all" ? "All" : selected === "active" ? "Active" : "Disabled";
              return `Status: ${statusText}`;
            }}
            sx={{
              height: 40,
              "& .MuiSelect-select": {
                fontWeight: 400,
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
              },
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="disabled">Disabled</MenuItem>
          </Select>
        </FormControl>
      </Stack>

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
            pb: "120px"
          }}
        >
          {data && data.length > 0 ? (
            data.map((organization) => (
              <div key={organization.id}>
                <OrgCard
                  organization={organization}
                  setSelectedOrganization={setSelectedOrganization}
                  setIsViewOpen={setIsViewOpen}
                  setIsEditOpen={setIsEditOpen}
                  setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
                // handleUpdateStatus={handleUpdateStatus}
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
