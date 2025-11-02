"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  Grid,
  Stack,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { useAssessment } from "@/context/AssessmentContext";

interface AssessmentPreviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function AssessmentPreviewModal({
  open,
  onClose,
  onSubmit,
}: AssessmentPreviewModalProps) {
  const { assessment } = useAssessment();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleExpand =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const getResponseValue = (response: number) => {
    switch (response) {
      case 0:
        return "Not Implemented";
        break;
      case 1:
        return "Partially Implemented";
        break;
      case 2:
        return "Fully Implemented";
        break;
      default:
        return "Not Applicable";
    }
  };

  if (!assessment) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Assessment Preview</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              height: "50vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
            }}
          >
            No assessment data available.
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") return; // block backdrop clicks
        onClose();
      }}
      disableEscapeKeyDown
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            Assessment Preview
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Review all details before submitting your assessment.
        </Typography>

        {/* General Details */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              General Details
            </Typography>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography>
                  Assessment Name: {assessment.assessmentName}
                </Typography>
                <Typography>Run ID: {assessment.runId}</Typography>
                <Typography>Organization: {assessment.orgName}</Typography>
                <Typography>
                  Business Unit: {assessment.businessUnitName}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography>Status: {assessment.status}</Typography>
                {assessment.startDate && (
                  <Typography>
                    Start Date:{" "}
                    {new Date(assessment.startDate).toLocaleString()}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Processes */}
        {assessment.processes?.map((process: any, idx: number) => (
          <Accordion
            key={process.assessmentProcessId || idx}
            expanded={expanded === `panel-${idx}`}
            onChange={handleExpand(`panel-${idx}`)}
            sx={{
              mb: 2,
              borderRadius: "10px !important",
              border: "1px solid #e0e0e0",
              "&:before": { display: "none" },
              boxShadow: expanded === `panel-${idx}` ? 3 : 0,
              transition: "box-shadow 0.3s ease",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: expanded === `panel-${idx}` ? "#f5f7ff" : "#fafafa",
                borderBottom:
                  expanded === `panel-${idx}` ? "1px solid #e0e0e0" : "none",
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {process.processName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    maxWidth: "50vw",
                  }}
                >
                  {process.processDescription}
                </Typography>
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ bgcolor: "#fff" }}>
              {/* Risks */}
              {process.risks?.length > 0 && (
                <>
                  <Typography
                    variant="subtitle1"
                    fontWeight={550}
                    sx={{ mb: 1 }}
                  >
                    Risk Scenarios
                  </Typography>
                  {process.risks.map((risk: any) => (
                    <Box
                      key={risk.assessmentProcessRiskId}
                      sx={{ pl: 2, mb: 2 }}
                    >
                      <Typography variant="body1" fontWeight={550}>
                        {risk.riskScenario}
                      </Typography>

                      {/* Taxonomy */}
                      <Stack
                        direction="row"
                        flexWrap="wrap"
                        gap={1}
                        sx={{ mt: 1 }}
                      >
                        {risk.taxonomy?.map((t: any, idx2: number) => (
                          <Chip
                            key={idx2}
                            label={`${t.name}: ${
                              t.severityDetails?.name ?? "N/A"
                            }`}
                            sx={{
                              bgcolor: t.severityDetails?.color ?? "#bdbdbd",
                              color: "#fff",
                              fontWeight: 600,
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  ))}
                </>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Assets */}
              {process.assets?.length > 0 && (
                <>
                  <Typography
                    variant="subtitle1"
                    fontWeight={550}
                    sx={{ mb: 1 }}
                  >
                    Assets
                  </Typography>
                  {process.assets.map((asset: any) => (
                    <Box
                      key={asset.assessmentProcessAssetId}
                      sx={{
                        pl: 2,
                        mb: 2,
                        p: 1.5,
                        border: "1px solid #eee",
                        borderRadius: 1,
                        bgcolor: "#fafafa",
                      }}
                    >
                      <Typography fontWeight={550}>
                        {asset.applicationName}
                      </Typography>

                      {/* Questionnaires */}
                      {asset.questionnaire?.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {asset.questionnaire.map((q: any, qi: number) => (
                            <Box
                              key={qi}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                borderBottom: "1px solid #f0f0f0",
                                py: 0.5,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ pr: 2, flex: 1 }}
                              >
                                {q.questionaireName}
                              </Typography>
                              <Chip
                                size="small"
                                label={getResponseValue(q.responseValue)}
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}
                </>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
        {/* Footer */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
          onClick={onSubmit}
        >
          <Chip label="Submit Assessment" color="primary" clickable />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
