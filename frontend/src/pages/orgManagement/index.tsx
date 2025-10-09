import OrgManagementContainer from "@/containers/OrgManagementContainer";
import withAuth from "@/hoc/withAuth";

function OrgManagementPage() {
  return <OrgManagementContainer />;
}

export default withAuth(OrgManagementPage);