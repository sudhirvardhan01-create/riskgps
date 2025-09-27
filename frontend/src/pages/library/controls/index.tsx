import ControlContainer from "@/containers/ControlContainer";
import withAuth from "@/hoc/withAuth";

function ControlLibraryPage() {
  return <ControlContainer />;
}

export default withAuth(ControlLibraryPage);
