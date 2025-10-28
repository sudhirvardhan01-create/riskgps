import { useRouter } from "next/router";
import UserDetails from "@/components/UserManagement/UserDetails";
import { UserData } from "@/types/user";
import { useEffect, useState } from "react";
import { UserService } from "@/services/userService";

export default function UserDetailsPage() {
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
          message: "Failed to fetch users",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {userData && (
        <UserDetails
          user={userData}
          onEdit={(id) => router.push(`/userManagement/${id}/edit`)}
          onDelete={(id) => console.log("Delete user:", id)}
          onResetPassword={(id) => console.log("Reset password for:", id)}
        />
      )}
    </>
  );
}
