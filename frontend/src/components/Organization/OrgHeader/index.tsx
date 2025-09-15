import { Box, Typography, IconButton } from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";

interface OrgHeaderProps {
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

const OrgHeader: React.FC<OrgHeaderProps> = ({
  onSort,
  sortField,
  sortDirection
}) => {
  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? (
      <KeyboardArrowUp fontSize="small" />
    ) : (
      <KeyboardArrowDown fontSize="small" />
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 2,
        backgroundColor: "#91939A",
        borderRadius: "4px",
        height: "40px",
        gap: "24px",
        flexWrap: { xs: "wrap", md: "nowrap" },
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Org Name Column */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flex: "0 0 170px",
          height: "20px",
        }}
      >
        <Typography
          variant="body2"
          fontWeight={600}
          color="#FFFFFF"
          sx={{
            fontSize: "14px",
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          Org Name
        </Typography>
        <IconButton
          onClick={() => handleSort('name')}
          sx={{
            padding: 0,
            color: sortField === 'name' ? '#FFFFFF' : '#91939A',
            '&:hover': {
              backgroundColor: 'transparent',
              color: '#FFFFFF'
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <KeyboardArrowUp
              sx={{ 
                fontSize: '16px',
                opacity: sortField === 'name' && sortDirection === 'asc' ? 1 : 0.3,
                color: sortField === 'name' && sortDirection === 'asc' ? '#FFFFFF' : '#91939A'
              }} 
            />
            <KeyboardArrowDown 
              sx={{ 
                fontSize: '16px',
                marginTop: '-4px',
                opacity: sortField === 'name' && sortDirection === 'desc' ? 1 : 0.3,
                color: sortField === 'name' && sortDirection === 'desc' ? '#FFFFFF' : '#91939A'
              }} 
            />
          </Box>
        </IconButton>
      </Box>

      {/* Tags Column */}
      <Box
        sx={{
          flex: "0 0 320px",
          height: "18px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body2"
          fontWeight={600}
          color="#FFFFFF"
          sx={{
            fontSize: "14px",
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          Tags
        </Typography>
      </Box>

      {/* Org Members Column */}
      <Box
        sx={{
          flex: "0 0 100px",
          height: "18px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body2"
          fontWeight={600}
          color="#FFFFFF"
          sx={{
            fontSize: "14px",
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          Org Members
        </Typography>
      </Box>

      {/* Business Units Column */}
      <Box
        sx={{
          flex: "0 0 270px",
          height: "18px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body2"
          fontWeight={600}
          color="#FFFFFF"
          sx={{
            fontSize: "14px",
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          Business Units
        </Typography>
      </Box>

      {/* Status Column */}
      <Box
        sx={{
          flex: "0 0 200px",
          height: "18px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body2"
          fontWeight={600}
          color="#FFFFFF"
          sx={{
            fontSize: "14px",
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          Status
        </Typography>
      </Box>
    </Box>
  );
};

export default OrgHeader;
