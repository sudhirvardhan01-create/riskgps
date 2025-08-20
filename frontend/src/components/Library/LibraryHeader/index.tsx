import Breadcrumb from "@/components/Breadcrumb";
import { FilterAltOutlined, Search } from "@mui/icons-material";
import {
  Box, Button, FormControl, InputAdornment, InputLabel,
  MenuItem, Select, Stack, TextField, Typography, useMediaQuery, useTheme
} from "@mui/material";
import { useState } from "react";
import FilterComponent from "@/components/Library/FilterComponent";


interface Props {
  breadcrumbItems: any[];
  addButtonText: string;
  addAction: () => void;
  sortItems: { label: string; value: string }[];
  // optional controlled props
  onImport?: () => void;
  isImportRequired?: boolean,
  onExport?: () => void;
  isExportRequired?: boolean,
  searchPattern?: string;
  setSearchPattern?: (val: string) => void;
  sortValue?: string;
  setSort?: (val: string) => void;
}

const LibraryHeader: React.FC<Props> = ({ breadcrumbItems, addButtonText, addAction, sortItems, isImportRequired = true, onImport, isExportRequired =true, onExport, searchPattern = "", setSearchPattern, sortValue, setSort }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchPattern);
  const [localSort, setLocalSort] = useState(sortValue ?? sortItems[0]?.value ?? "");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    setSearchPattern?.(e.target.value);
  };

  const handleSortChange = (event: any) => {
    setLocalSort(event.target.value);
    setSort?.(event.target.value);
  };

  return (
    <>
      <Box mb={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" spacing={2} sx={{ mb: 2 }}>
          <Breadcrumb items={breadcrumbItems} />


          <Stack direction={"row"} gap={2}>
          {isImportRequired && <Button onClick={onImport} variant="outlined" sx={{ textTransform: "none", borderRadius: 1 }}>
            <Typography variant="body1" fontWeight={600}>
              Import
            </Typography>
          </Button>}
          {isExportRequired && <Button onClick={onExport} variant="outlined" sx={{ textTransform: "none", borderRadius: 1}}>
            <Typography variant="body1" fontWeight={600}>
              Export
            </Typography>
          </Button>}  
          <Button onClick={addAction} variant="contained" sx={{ backgroundColor: "primary.main", textTransform: "none", borderRadius: 1, "&:hover": { backgroundColor: "#001080" } }}>
            <Typography variant="body1" fontWeight={600}>
              {addButtonText}
            </Typography>
          </Button>
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} useFlexGap flexWrap="wrap" justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }}>
          <TextField
            size="small"
            placeholder="Search by keywords"
            value={localSearch}
            onChange={handleSearchChange}
            variant="outlined"
            sx={{ borderRadius: 1, height: "40px", width: "33%", minWidth: 200, backgroundColor: "#FFFFFF" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent={isMobile ? "flex-start" : "flex-end"}>
            <FormControl sx={{ backgroundColor: "#FFFFFF", borderRadius: 1, width: 271 }}>
              <InputLabel id="sort-risk-scenarios">Sort</InputLabel>
              <Select size="small" value={localSort} label="Sort" labelId="sort-risk-scenarios" onChange={handleSortChange}>
                {sortItems.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="outlined" endIcon={<FilterAltOutlined />} onClick={() => setIsOpenFilter(true)} sx={{ textTransform: "none", borderColor: "#ccc", color: "black", backgroundColor: "#FFFFFF", borderRadius: 1 }}>
              <Typography variant="body1">{"Filter"}</Typography>
            </Button>
          </Stack>
        </Stack>
      </Box>

      <FilterComponent items={["Published", "Draft", "Disabled"]} open={isOpenFilter} onClose={() => setIsOpenFilter(false)} onClear={() => setIsOpenFilter(false)} onApply={() => setIsOpenFilter(false)} />
    </>
  );
};

export default LibraryHeader;
