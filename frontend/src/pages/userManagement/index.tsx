import UserDetailsPage from "./[userId]";
import withAuth from "@/hoc/withAuth";

function UserManagementPage() {
  return <UserDetailsPage />;
}

export default withAuth(UserManagementPage);
