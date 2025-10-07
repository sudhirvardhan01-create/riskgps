import { Box, Typography, IconButton } from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { ORG_COLUMN_TEMPLATE } from "@/constants/constant";

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


  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: ORG_COLUMN_TEMPLATE,
        backgroundColor: "#91939A",
        borderRadius: 1,
        px: 2,
        py: 1,
        alignItems: "center",
        gap: 2,
        width: "100%",
      }}
    >
      {/* Org Name Column */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          height: "20px",
        }}
      >
        <Typography
          variant="body1"
          fontWeight={600}
          color="#FFFFFF"
        >
          Org Name
        </Typography>
        <IconButton
          onClick={() => handleSort('name')}
          sx={{
            padding: 0,
            color: '#FFFFFF',
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
                opacity: sortField === 'name' && sortDirection === 'asc' ? 1 : 0.6,
                color: sortField === 'name' && sortDirection === 'asc' ? '#FFFFFF' : '#FFFFFF'
              }}
            />
            <KeyboardArrowDown
              sx={{
                fontSize: '16px',
                marginTop: '-4px',
                opacity: sortField === 'name' && sortDirection === 'desc' ? 1 : 0.6,
                color: sortField === 'name' && sortDirection === 'desc' ? '#FFFFFF' : '#FFFFFF'
              }}
            />
          </Box>
        </IconButton>
      </Box>

      {/* Tags Column */}
      <Typography
        variant="body1"
        fontWeight={600}
        color="#FFFFFF"
      >
        Tags
      </Typography>

      {/* Org Members Column */}
      <Typography
        variant="body1"
        fontWeight={600}
        color="#FFFFFF"
        textAlign="center"
      >
        Org Members
      </Typography>

      {/* Business Units Column */}
      <Typography
        variant="body1"
        fontWeight={600}
        color="#FFFFFF"
      >
        Business Units
      </Typography>

      {/* Status Column */}
      <Typography
        variant="body1"
        fontWeight={600}
        color="#FFFFFF"
        textAlign="center"
      >
        Status
      </Typography>
    </Box>
  );
};

export default OrgHeader;
