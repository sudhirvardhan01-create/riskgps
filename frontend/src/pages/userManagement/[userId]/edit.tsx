import React from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";

function UserEditPage() {
  const router = useRouter();
  return (
    <Box p={5}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={() => router.back()} size="small">
          <ArrowBackIcon sx={{ color: "text.primary" }} />
        </IconButton>
        <Typography variant="h6" color="text.primary">
          User Management/
        </Typography>
        <Typography variant="h6" color="primary" fontWeight={600}>
          Edit User
        </Typography>
      </Stack>
    </Box>
  );
}

export default UserEditPage;
