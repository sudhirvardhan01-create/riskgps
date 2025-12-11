import DashboardContainer from "@/containers/DashboardContainer";
import withAuth from "@/hoc/withAuth";

function DashboardPage() {
  return <DashboardContainer />;
}

export default withAuth(DashboardPage);
