import React, { useState } from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import UserFormModal from "@/components/UserManagement/UserFormModal";
import { UserFormData } from "@/types/user";
import { UserService } from "@/services/userService";
import ToastComponent from "@/components/ToastComponent";
import withAuth from "@/hoc/withAuth";

function UserCreatePage() {
  const router = useRouter();
  const initialUserFormData = {
    name: "",
    email: "",
    phone: "",
    communicationPreference: "Email",
    company: "",
    role: "",
    organization: "",
    isTermsAndConditionsAccepted: false,
    isActive: true,
    password: "",
    confirmPassword: "",
  };
  const [formData, setFormData] = useState<UserFormData>(initialUserFormData);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setPageLoading(true);
      await UserService.create(formData);
      setToast({
        open: true,
        message: `User created successfully`,
        severity: "success",
      });
      setTimeout(() => {
        router.push("/userManagement");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setToast({
        open: true,
        message: err.message || "Failed to create user",
        severity: "error",
      });
    } finally {
      setPageLoading(false);
    }
  };
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
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <IconButton
            onClick={() => router.push("/userManagement")}
            size="small"
          >
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
          <UserFormModal
            onClose={() => router.push("/userManagement")}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            pageLoading={pageLoading}
          />
        </Box>
      </Box>

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

export default withAuth(UserCreatePage);
