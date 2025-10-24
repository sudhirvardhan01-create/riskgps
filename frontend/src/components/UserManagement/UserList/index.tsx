import { Box, Stack, TablePagination, Typography } from "@mui/material";
import { UserData } from "@/types/user";
import UserCard from "../UserCard";

interface Props {
  data: UserData[];
  totalRows: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: any, newPage: number) => void;
  onRowsPerPageChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setSelectedRecord: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const UserList: React.FC<Props> = ({
  data,
  totalRows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  setSelectedRecord,
}) => {
  return (
    <>
      {/* User details card */}
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Stack
          spacing={2}
          sx={{
            flex: 1,
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          {data && data.length > 0 ? (
            data.map((row) => (
              <div key={row.userId}>
                <UserCard record={row} setSelectedRecord={setSelectedRecord} />
              </div>
            ))
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No users found
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

export default UserList;
