import LibraryCardIcon from "@/icons/risk-scenario-card.svg";
import ThreatCardIcon from "@/icons/threats-card.svg";
import AssetCardIcon from "@/icons/assets-card.svg";
import ControlCardIcon from "@/icons/controls-card.svg";
import ProcessCardIcon from "@/icons/processes-card.svg";
import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import withAuth from "@/hoc/withAuth";
import { useEffect, useState } from "react";
import { getLibraryData } from "../api/library";
import { LibraryData } from "@/types/library";

const LibraryPage = () => {
  const router = useRouter();

  const [libData, setLibData] = useState<LibraryData>();

  useEffect(() => {
    (async () => {
      try {
        const data = await getLibraryData();
        setLibData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  }, []);

  console.log(libData);

  const libs = [
    {
      name: "Processes",
      description:
        "Streamline and optimize cybersecurity processes, enhancing overall efficiency and bolstering Bluocean's commitment to client cybersecurity.",
      tags: [
        {
          label: "All Processes",
          value: libData?.process.total_count,
        },
        {
          label: "Published",
          value: libData?.process.published,
        },
        {
          label: "Disabled",
          value: libData?.process.not_published,
        },
        {
          label: "Draft",
          value: libData?.process.draft,
        },
      ],
      icon: <ProcessCardIcon height={24} width={24} />,
      href: "/library/process",
    },
    {
      name: "Risk Scenarios",
      description:
        "Anticipate and address potential cybersecurity threats through proactive exploration of impactful scenarios.",
      tags: [
        {
          label: "All Scenarios",
          value: libData?.riskScenario.total_count,
        },
        {
          label: "Published",
          value: libData?.riskScenario.published,
        },
        {
          label: "Disabled",
          value:libData?.riskScenario.not_published,
        },
        {
          label: "Draft",
          value: libData?.riskScenario.draft,
        },
      ],
      icon: <LibraryCardIcon height={24} width={24} />,
      href: "/library/risk-scenario",
    },
    {
      name: "Assets",
      description:
        "Effectively catalog and manage digital assets, providing a clear overview of their significance in the risk assessment process.",
      tags: [
        {
          label: "All Assets",
          value: libData?.asset.total_count,
        },
        {
          label: "Published",
          value: libData?.asset.published,
        },
        {
          label: "Disabled",
          value: libData?.asset.not_published,
        },
        {
          label: "Draft",
          value: libData?.asset.draft,
        },
      ],
      icon: <AssetCardIcon height={24} width={24} />,
      href: "/library/assets",
    },
    {
      name: "Threats",
      description:
        "Categorize and stay informed about diverse cyber threats to empower risk assessment strategies with up-to-date intelligence.",
      tags: [
        {
          label: "All Threats",
          value: libData?.mitreThreats.total_count,
        },
        {
          label: "Published",
          value: libData?.mitreThreats.published,
        },
        {
          label: "Disabled",
          value: libData?.mitreThreats.not_published,
        },
        {
          label: "Draft",
          value: libData?.mitreThreats.draft,
        },
      ],
      icon: <ThreatCardIcon height={24} width={24} />,
      href: "/library/threats",
    },
    {
      name: "Controls",
      description:
        "Implement and manage security controls strategically, fortifying client assets against potential threats within the risk assessment framework.",
      tags: [
        {
          label: "All Controls",
          value: libData?.mitreControls.total_count,
        },
        {
          label: "Published",
          value: libData?.mitreControls.published,
        },
        {
          label: "Disabled",
          value: libData?.mitreControls.not_published,
        },
        {
          label: "Draft",
          value: libData?.mitreControls.draft,
        },
      ],
      icon: <ControlCardIcon height={24} width={24} />,
      href: "/library/controls",
    },
  ];

  return (
    <Box sx={{ p: 5, mb: 8 }}>
      <Typography variant="h5" fontWeight={600} mb={5}>
        Library
      </Typography>
      <Grid
        container
        rowSpacing={3}
        columnSpacing={3}
        sx={{ overflow: "auto", maxHeight: "calc(100vh - 290px)" }}
        className="scroll-container"
      >
        {libs.map((lib) => {
          return (
            <Grid size={{ xs: 12, md: 6 }} key={lib.name}>
              <Box
                key={lib.name}
                sx={{
                  p: 4,
                  border: "1px solid #E4E4E4",
                  borderRadius: 2,
                  boxShadow: "0px 4px 4px 0px #D9D9D98F",
                  cursor: "pointer",
                }}
                onClick={() => {
                  router.push(lib.href);
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Box sx={{ height: 24, width: 24 }}>{lib.icon}</Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="primary.main"
                  >
                    {lib.name}
                  </Typography>
                </Stack>
                <Typography variant="body1" color="#91939A" sx={{ height: 96 }}>
                  {lib.description}
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mt: 1 }}>
                  {lib.tags.map((tag) => (
                    <Box
                      key={tag.label}
                      sx={{ display: "inline-block", mr: 1 }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1" color="#91939A">
                          {tag.label}:
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          color="#484848"
                        >
                          {tag.value}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default withAuth(LibraryPage);
