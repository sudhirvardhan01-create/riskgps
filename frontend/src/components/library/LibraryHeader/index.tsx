import Breadcrumb from "@/components/Breadcrumb";
import { ArrowBack, FilterAltOutlined, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import FilterComponent from "../FilterComponent";
import { useState } from "react";

const LibraryHeader = ({
  breadcrumbItems,
  addButtonText,
  addAction,
  sortItems,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  return (
    <>
      <Box mb={3}>
        {/* Row 1: Breadcrumb + Add Button */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Breadcrumb items={breadcrumbItems} />

          <Button
            onClick={addAction}
            variant="contained"
            sx={{
              backgroundColor: "primary.main",
              textTransform: "none",
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "#001080",
              },
            }}
          >
            <Typography variant="body1" fontWeight={600}>
              {addButtonText}
            </Typography>
          </Button>
        </Stack>

        {/* Row 2: Search + Sort + Filter */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          useFlexGap
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          {/* Search Bar */}
          <TextField
            size="small"
            placeholder="Search by keywords"
            variant="outlined"
            sx={{
              borderRadius: 1,
              height: "40px",
              width: "33%",
              minWidth: 200,
              backgroundColor: "#FFFFFF",
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

          {/* Right Controls */}
          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            justifyContent={isMobile ? "flex-start" : "flex-end"}
          >
            <FormControl
              sx={{ backgroundColor: "#FFFFFF", borderRadius: 1, width: 271 }}
            >
              <InputLabel id="sort-risk-scenarios">Sort</InputLabel>
              <Select
                size="small"
                defaultValue={sortItems[0].value}
                label="Sort"
                labelId="sort-risk-scenarios"
              >
                {sortItems.map((item: { label: string; value: string }) => (
                  <MenuItem value={item.value}>{item.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              endIcon={<FilterAltOutlined />}
              onClick={() => setIsOpenFilter(true)}
              sx={{
                textTransform: "none",
                borderColor: "#ccc",
                color: "black",
                backgroundColor: "#FFFFFF",
                borderRadius: 1,
              }}
            >
              <Typography variant="body1">{"Filter"}</Typography>
            </Button>
          </Stack>
        </Stack>
      </Box>

      <FilterComponent
        items={["Published", "Draft", "Disabled"]}
        open={isOpenFilter}
        onClose={() => setIsOpenFilter(false)}
        onClear={() => setIsOpenFilter(false)}
        onApply={() => setIsOpenFilter(false)}
      />
    </>
  );
};

export default LibraryHeader;
