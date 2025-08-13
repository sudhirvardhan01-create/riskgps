import withAuth from "@/hoc/withAuth";
import RiskScenarioContainer from "@/containers/RiskScenarioContainer";

function RiskScenariosPage() {
  return <RiskScenarioContainer />;
}

export default withAuth(RiskScenariosPage);
