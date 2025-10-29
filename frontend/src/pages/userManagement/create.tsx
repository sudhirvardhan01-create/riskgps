import React from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import UserFormModal from "@/components/UserManagement/UserFormModal";

function UserCreatePage() {
  const router = useRouter();
  return (
    <Box
      p={5}
      sx={{
        height: "calc(100vh - 120px)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <IconButton onClick={() => router.push("/userManagement")} size="small">
          <ArrowBackIcon sx={{ color: "text.primary" }} />
        </IconButton>
        <Typography variant="h6" color="text.primary">
          User Management/
        </Typography>
        <Typography variant="h6" color="primary" fontWeight={600}>
          Add User
        </Typography>
      </Stack>
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <UserFormModal onClose={() => router.push("/userManagement")} />
      </Box>
    </Box>
  );
}

export default UserCreatePage;
