import withAuth from "@/hoc/withAuth";
import AssetContainer from "@/containers/AssetContainer";

function AssetsPage() {
  return <AssetContainer />;
}

export default withAuth(AssetsPage);