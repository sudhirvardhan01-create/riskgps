import { Box, Stack, TablePagination, Typography, TextField, InputAdornment, FormControl, Select, MenuItem } from "@mui/material";
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
  setIsDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  localSearch?: string;
  handleSearchChange?: (val: string) => void;
  statusFilter?: string;
  handleStatusChange?: (val: string) => void;
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
  localSearch,
  handleSearchChange,
  statusFilter,
  handleStatusChange,
  onEditOrganization,
}) => {
  const statusOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "disabled", label: "Disabled" },
  ];

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
            width: "480px",
            height: "48px",
            borderRadius: "4px",
            backgroundColor: "#E7E7E84D",
            gap: "16px",

            "& .MuiOutlinedInput-root": {
              height: "48px",
              padding: "12px 16px",
              "& fieldset": {
                border: "1px solid #D9D9D9",
                borderRadius: "4px",
              },
              "&:hover fieldset": {
                border: "1px solid #D9D9D9",
              },
              "&.Mui-focused fieldset": {
                border: "1px solid #D9D9D9",
              },
            },

            "& .MuiInputBase-input": {
              padding: "12px 16px",
              height: "48px",
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
                  <Search 
                    color="action" 
                    sx={{
                      width: "24px",
                      height: "24px",
                      opacity: 1,
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Status Dropdown */}
        <FormControl
          size="small"
          sx={{
            width: "183px",
            height: "40px",
            borderRadius: "4px",
            gap: "16px",
            "& .MuiOutlinedInput-root": {
              height: "40px",
              padding: "10px 16px",
              "& fieldset": {
                border: "1px solid #484848",
                borderRadius: "4px",
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
              const option = statusOptions.find(opt => opt.value === selected);
              const statusText = option ? option.label : "All";
              return `Status: ${statusText}`;
            }}
            sx={{
              height: "40px",
              padding: "10px 16px",
              "& .MuiSelect-select": {
                fontWeight: 400,
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                height: "40px",
              },
            }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
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
