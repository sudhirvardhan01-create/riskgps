import { Box, Typography, IconButton } from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { USER_TABLE_HEADER_COLUMN_TEMPLATE } from "@/constants/constant";

interface UserTableHeaderProps {
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}

const UserTableHeader: React.FC<UserTableHeaderProps> = ({
  onSort,
  sortField,
  sortDirection,
}) => {
  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: USER_TABLE_HEADER_COLUMN_TEMPLATE,
        backgroundColor: "#91939A",
        borderRadius: 1,
        px: 2,
        py: 1,
        alignItems: "center",
        gap: 2,
        width: "100%",
      }}
    >
      {/* User Name Column */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          height: "20px",
        }}
      >
        <Typography variant="body1" fontWeight={600} color="#FFFFFF">
          Name
        </Typography>
        <IconButton
          onClick={() => handleSort("name")}
          sx={{
            padding: 0,
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "transparent",
              color: "#FFFFFF",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <KeyboardArrowUp
              sx={{
                fontSize: "16px",
                opacity:
                  sortField === "name" && sortDirection === "asc" ? 1 : 0.6,
                color:
                  sortField === "name" && sortDirection === "asc"
                    ? "#FFFFFF"
                    : "#FFFFFF",
              }}
            />
            <KeyboardArrowDown
              sx={{
                fontSize: "16px",
                marginTop: "-4px",
                opacity:
                  sortField === "name" && sortDirection === "desc" ? 1 : 0.6,
                color:
                  sortField === "name" && sortDirection === "desc"
                    ? "#FFFFFF"
                    : "#FFFFFF",
              }}
            />
          </Box>
        </IconButton>
      </Box>

      {/* User Type Column */}
      <Typography variant="body1" fontWeight={600} color="#FFFFFF">
        User Type
      </Typography>

      {/* Created On Column */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          height: "20px",
        }}
      >
        <Typography variant="body1" fontWeight={600} color="#FFFFFF">
          Created On
        </Typography>
        <IconButton
          onClick={() => handleSort("name")}
          sx={{
            padding: 0,
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "transparent",
              color: "#FFFFFF",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <KeyboardArrowUp
              sx={{
                fontSize: "16px",
                opacity:
                  sortField === "name" && sortDirection === "asc" ? 1 : 0.6,
                color:
                  sortField === "name" && sortDirection === "asc"
                    ? "#FFFFFF"
                    : "#FFFFFF",
              }}
            />
            <KeyboardArrowDown
              sx={{
                fontSize: "16px",
                marginTop: "-4px",
                opacity:
                  sortField === "name" && sortDirection === "desc" ? 1 : 0.6,
                color:
                  sortField === "name" && sortDirection === "desc"
                    ? "#FFFFFF"
                    : "#FFFFFF",
              }}
            />
          </Box>
        </IconButton>
      </Box>

      {/* Organisation Column */}
      <Typography variant="body1" fontWeight={600} color="#FFFFFF">
        Organisation
      </Typography>

      {/* Status Column */}
      <Typography
        variant="body1"
        fontWeight={600}
        color="#FFFFFF"
        textAlign="start"
      >
        Status
      </Typography>
    </Box>
  );
};

export default UserTableHeader;
