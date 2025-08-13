import ProcessContainer from "@/containers/ProcessContainer";
import withAuth from "@/hoc/withAuth";

function ProcessPage() {
  return <ProcessContainer />;
}

export default withAuth(ProcessPage);

