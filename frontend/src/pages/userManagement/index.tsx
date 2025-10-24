import UserManagementContainer from "@/containers/UserManagementContainer";
import withAuth from "@/hoc/withAuth";

function UserManagementPage() {
  return <UserManagementContainer />;
}

export default withAuth(UserManagementPage);
