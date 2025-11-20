import { Box, Grid, Typography } from "@mui/material";

interface TableViewHeader {
  columnSize: number;
  columnTitle: string;
}

interface TableViewHeaderProps {
  headerData: TableViewHeader[];
}

const TableViewHeader: React.FC<TableViewHeaderProps> = ({ headerData }) => {
  return (
    <Box sx={{ borderRadius: 1, backgroundColor: "#E7E7E84D", p: 1.5, my: 2 }}>
      <Grid container spacing={2}>
        {headerData.map((item, index) => (
          <Grid size={item.columnSize} key={index}>
            <Typography variant="body2" color="text.primary" fontWeight={600}>
              {item.columnTitle}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TableViewHeader;
