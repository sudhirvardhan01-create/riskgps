import { useRouter } from "next/router";
import UserDetails from "@/components/UserManagement/UserDetails";
import { UserData } from "@/types/user";
import { useEffect, useState } from "react";
import { UserService } from "@/services/userService";
import withAuth from "@/hoc/withAuth";
import ConfirmDialog from "@/components/ConfirmDialog";
import ToastComponent from "@/components/ToastComponent";
import ResetPasswordModal from "@/components/UserManagement/ResetPasswordModal";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

function UserDetailsPage() {
  const router = useRouter();
  const { userId } = router.query;
  const initialPasswordData = {
    password: "",
    confirmPassword: "",
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] =
    useState<boolean>(false);
  const [resetPasswordFormData, setResetPasswordFormData] =
    useState<ResetPasswordForm>(initialPasswordData);

  //Fetch user by id
  useEffect(() => {
    (async () => {
      try {
        if (!router.isReady || !userId) {
          return;
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
  }, [router.isReady, userId]);

  //Delete function
  const handleDelete = async () => {
    try {
      await UserService.delete(userId as string);
      setIsDeleteConfirmOpen(false);
      setToast({
        open: true,
        message: `${userData?.name} account deleted`,
        severity: "success",
      });
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to delete account",
        severity: "error",
      });
    }
  };

  const handleResetPassword = async () => {
    try {
      await UserService.resetPassword(
        userId as string,
        resetPasswordFormData.password
      );
      setIsResetPasswordOpen(false);
      setResetPasswordFormData(initialPasswordData);
      setToast({
        open: true,
        message: `Reset password successfully`,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Failed to reset password",
        severity: "error",
      });
    }
  };

  return (
    <>
      {userData && (
        <UserDetails
          user={userData}
          onEdit={(id) => router.push(`/userManagement/${id}/edit`)}
          onDelete={() => setIsDeleteConfirmOpen(true)}
          onResetPassword={() => setIsResetPasswordOpen(true)}
        />
      )}

      <ResetPasswordModal
        open={isResetPasswordOpen}
        onClose={() => {
          setIsResetPasswordOpen(false);
          setResetPasswordFormData(initialPasswordData);
        }}
        formData={resetPasswordFormData}
        setFormData={setResetPasswordFormData}
        onSubmit={() => handleResetPassword()}
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Delete Account"
        description={`Are you sure about deleting ${userData?.name}?`}
        onConfirm={() => {
          handleDelete();
        }}
        cancelText="Cancel"
        confirmText="Yes, Delete"
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

export default withAuth(UserDetailsPage);
