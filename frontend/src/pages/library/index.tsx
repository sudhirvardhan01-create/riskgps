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
import { constants } from "@/utils/constants";

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

  const libs = [
    {
      name: constants.libProcessTitle,
      description: constants.libProcessDescription,
      tags: [
        {
          label: constants.allProcessesTitle,
          value: libData?.process.total_count,
        },
        {
          label: constants.publishedStatus,
          value: libData?.process.published,
        },
        {
          label: constants.disabledStatus,
          value: libData?.process.not_published,
        },
        {
          label: constants.draftStatus,
          value: libData?.process.draft,
        },
      ],
      icon: <ProcessCardIcon height={24} width={24} />,
      href: "/library/process",
    },
    {
      name: constants.libRiskScenarioTitle,
      description: constants.libRiskScenarioDescription,
      tags: [
        {
          label: constants.allRiskScenariosTitle,
          value: libData?.riskScenario.total_count,
        },
        {
          label: constants.publishedStatus,
          value: libData?.riskScenario.published,
        },
        {
          label: constants.disabledStatus,
          value: libData?.riskScenario.not_published,
        },
        {
          label: constants.draftStatus,
          value: libData?.riskScenario.draft,
        },
      ],
      icon: <LibraryCardIcon height={24} width={24} />,
      href: "/library/risk-scenario",
    },
    {
      name: constants.libAssetTitle,
      description: constants.libAssetDescription,
      tags: [
        {
          label: constants.allAssetsTitle,
          value: libData?.asset.total_count,
        },
        {
          label: constants.publishedStatus,
          value: libData?.asset.published,
        },
        {
          label: constants.disabledStatus,
          value: libData?.asset.not_published,
        },
        {
          label: constants.draftStatus,
          value: libData?.asset.draft,
        },
      ],
      icon: <AssetCardIcon height={24} width={24} />,
      href: "/library/assets",
    },
    {
      name: constants.libThreatTitle,
      description: constants.libThreatDescription,
      tags: [
        {
          label: constants.allThreatsTitle,
          value: libData?.mitreThreats.total_count,
        },
        {
          label: constants.publishedStatus,
          value: libData?.mitreThreats.published,
        },
        {
          label: constants.disabledStatus,
          value: libData?.mitreThreats.not_published,
        },
        {
          label: constants.draftStatus,
          value: libData?.mitreThreats.draft,
        },
      ],
      icon: <ThreatCardIcon height={24} width={24} />,
      href: "/library/threats",
    },
    {
      name: constants.libControlTitle,
      description: constants.libControlDescription,
      tags: [
        {
          label: constants.allControlsTitle,
          value: libData?.mitreControls.total_count,
        },
        {
          label: constants.publishedStatus,
          value: libData?.mitreControls.published,
        },
        {
          label: constants.disabledStatus,
          value: libData?.mitreControls.not_published,
        },
        {
          label: constants.draftStatus,
          value: libData?.mitreControls.draft,
        },
      ],
      icon: <ControlCardIcon height={24} width={24} />,
      href: "/library/controls",
    },
    {
      name: constants.libQuestionnnaireTitle,
      description: constants.libQuestionnaireDescription,
      tags: [
        {
          label: constants.allQuestionnaireTitle,
          value: libData?.questionnaire.total_count,
        },
        {
          label: constants.publishedStatus,
          value: libData?.questionnaire.published,
        },
        {
          label: constants.disabledStatus,
          value: libData?.questionnaire.not_published,
        },
        {
          label: constants.draftStatus,
          value: libData?.questionnaire.draft,
        },
      ],
      icon: <LibraryCardIcon height={24} width={24} />,
      href: "/library/questionnaire",
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
                  backgroundColor: "#FFFFFF",
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
