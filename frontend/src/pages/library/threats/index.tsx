import withAuth from "@/hoc/withAuth";
import ThreatContainer from "@/containers/ThreatContainer";

function ThreatsPage() {
  return <ThreatContainer />;
}

export default withAuth(ThreatsPage);


