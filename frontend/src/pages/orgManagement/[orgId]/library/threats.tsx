import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Button,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import withAuth from "@/hoc/withAuth";
import { useOrganization } from "@/hooks/useOrganization";
import Image from "next/image";

function ThreatsPage() {
  const router = useRouter();
  const { orgId } = router.query;
  const { organization, loading, error } = useOrganization(orgId);

  const handleBackClick = () => {
    router.push(`/orgManagement/${orgId}?tab=1`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading organization: {error}</Typography>
      </Box>
    );
  }

  if (!organization) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Organization not found</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "calc(100vh - 95px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "#F0F2FB",
      }}
    >
      {/* Breadcrumb */}
      <Stack sx={{ pt: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1, pl: 2 }}>
          <IconButton onClick={handleBackClick} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box
              component="span"
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0px",
                color: "#484848",
              }}
            >
              Org Management/
            </Box>
            <Box
              component="span"
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0px",
                color: "#484848",
              }}
            >
              {organization.name}/
            </Box>
            <Box
              component="span"
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0px",
                color: "#484848",
              }}
            >
              Library/
            </Box>
            <Box
              component="span"
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0px",
                color: "#04139A",
              }}
            >
              Threats
            </Box>
          </Typography>
        </Box>
      </Stack>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: "667px",
            p: 4,
            border: "1px solid #E7E7E8",
            borderRadius: "8px",
            textAlign: "center",
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* Empty state icon placeholder */}
          <Box
            sx={{
              width: "120px",
              height: "120px",
              borderRadius: "8px",
              margin: "0 auto 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={"/create.png"}
              alt="org-image"
              width={120}
              height={120}
            />
          </Box>

          <Typography variant="h6" sx={{ mb: 2, color: "#484848" }}>
            Looks like there are no threats added yet. <br /> Click on &apos;Add Threats&apos; to start adding threats.
          </Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#04139A",
              color: "#FFFFFF",
              p: "12px, 40px",
              height: "40px",
              borderRadius: "4px",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "#030d6b",
              },
            }}
          >
            Add Threats
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default withAuth(ThreatsPage);