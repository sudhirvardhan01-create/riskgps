import { Search } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface OrgManagementHeaderProps {
  onAddOrg: () => void;
  localSearch?: string;
  handleSearchChange?: (val: string) => void;
  statusFilter?: string;
  handleStatusChange?: (val: string) => void;
}

const OrgManagementHeader: React.FC<OrgManagementHeaderProps> = ({
  onAddOrg,
  localSearch,
  handleSearchChange,
  statusFilter,
  handleStatusChange,
}) => {
  const statusOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "disabled", label: "Disabled" },
  ];
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 5,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#121212" }}>
          Org Management
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "primary.main",
            color: "#FFFFFF",
            borderRadius: "4px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "100%",
            letterSpacing: "0%",
            padding: "12px 32px",
            "&:hover": {
              backgroundColor: "primary.main",
              opacity: 0.9,
            },
          }}
          onClick={onAddOrg}
        >
          Create New Org
        </Button>
      </Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        useFlexGap
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{ mb: 5 }}
      >
        {/* Search Input Field */}
        <TextField
          size="small"
          placeholder="Search by Org Name"
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
              const option = statusOptions.find(
                (opt) => opt.value === selected
              );
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
    </>
  );
};

export default OrgManagementHeader;

