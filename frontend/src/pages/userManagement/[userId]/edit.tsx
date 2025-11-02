import React, { useEffect, useState } from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import { UserService } from "@/services/userService";
import { UserData } from "@/types/user";
import UserEditFormModal from "@/components/UserManagement/UserEditFormModal";
import ToastComponent from "@/components/ToastComponent";
import ConfirmDialog from "@/components/ConfirmDialog";
import withAuth from "@/hoc/withAuth";

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
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState<boolean>(false);

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
    <>
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
                company: userData.company,
                communicationPreference: userData.communicationPreference,
                role: userData.roleId ? userData.roleId : "",
                organization: userData.organizationId
                  ? userData.organizationId
                  : "",
              }}
              setIsEditConfirmOpen={setIsEditConfirmOpen}
              setToast={setToast}
            />
          )}
        </Box>
      </Box>

      <ConfirmDialog
        open={isEditConfirmOpen}
        onClose={() => setIsEditConfirmOpen(false)}
        title="You have unsaved changes"
        description="Are you sure you want to discard the information?"
        onConfirm={() => {
          setIsEditConfirmOpen(false);
          router.back();
        }}
        cancelText="Cancel"
        confirmText="Yes, Discard"
      />

      <ToastComponent
        open={toast.open}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        message={toast.message}
        toastBorder={
          toast.severity === "success" ? "1px solid #147A50" : undefined
        }
        toastColor={toast.severity === "success" ? "#147A50" : undefined}
        toastBackgroundColor={
          toast.severity === "success" ? "#DDF5EB" : undefined
        }
        toastSeverity={toast.severity}
      />
    </>
  );
}

export default withAuth(UserEditPage);
