import React, { useEffect, useState } from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import { UserService } from "@/services/userService";
import { UserData } from "@/types/user";
import UserEditFormModal from "@/components/UserManagement/UserEditFormModal";

function UserEditPage() {
  const router = useRouter();
  const { userId } = router.query;
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  //Fetch user by id
  useEffect(() => {
    (async () => {
      try {
        if (!userId) {
          throw new Error("Invalid selection");
        }
        setLoading(true);
        const data = await UserService.fetchById(userId as string);
        setUserData(data);
      } catch (err) {
        console.error(err);
        setToast({
          open: true,
          message: "Failed to fetch user",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);
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
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {userData && (
          <UserEditFormModal
            onClose={() => router.back()}
            userData={{
              userId: userData.userId,
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
              communicationPreference: userData.communicationPreference,
              company: userData.company,
              role: userData.role,
              organization: userData.organization,
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export default UserEditPage;
