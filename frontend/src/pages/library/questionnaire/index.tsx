import QuestionnaireContainer from "@/containers/QuestionnaireContainer";
import withAuth from "@/hoc/withAuth";

function QuestionnairePage() {
  return <QuestionnaireContainer />;
}

export default withAuth(QuestionnairePage);
