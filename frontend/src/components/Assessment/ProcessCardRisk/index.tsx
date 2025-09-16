"use client";

import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Checkbox,
  IconButton,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AddIcon from "@mui/icons-material/Add";
import { useDroppable } from "@dnd-kit/core";
import FileMoveIcon from "@/icons/fileMove.svg";

interface ProcessCardRiskProps {
  process: {
    orgProcessId: string;
    name: string;
    risks: { orgRiskId: string; name: string; description: string }[];
  };
  selectedRisks: string[];
  setSelectedRisks: React.Dispatch<React.SetStateAction<string[]>>;
  onDelete: (processId: string, riskId: string) => void;
  onDeleteBulk: (processId: string) => void;
  onMoveSelected: (processId: string, processName: string) => void;
}

const ProcessCardRisk: React.FC<ProcessCardRiskProps> = ({
  process,
  selectedRisks,
  setSelectedRisks,
  onDelete,
  onDeleteBulk,
  onMoveSelected,
}) => {
  const { setNodeRef } = useDroppable({ id: process.orgProcessId });

  const allSelected =
    process.risks.length > 0 &&
    process.risks.every(
      (r) => selectedRisks.length > 0 && selectedRisks.includes(r.orgRiskId)
    );

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRisks((prev) =>
        prev.filter((id) => !process.risks.find((r) => r.orgRiskId === id))
      );
    } else {
      setSelectedRisks((prev) => [
        ...prev,
        ...process.risks.map((r) => r.orgRiskId),
      ]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedRisks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <Accordion
      disableGutters
      sx={{
        mb: 2,
        borderRadius: "12px !important",
        boxShadow: "none",
      }}
      expanded={true}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: "#F0F2FB",
          height: 40,
          border: "1px solid #E7E7E8",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <Typography
          variant="body2"
          color="#121212"
          fontWeight={600}
          sx={{ flexGrow: 1 }}
        >
          {process.name} ({process.risks.length})
        </Typography>
      </AccordionSummary>
      <AccordionDetails ref={setNodeRef} sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1.5,
            gap: 1.5,
            justifyContent: "space-between",
          }}
        >
          <Stack direction={"row"} sx={{ gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                checked={allSelected}
                onChange={toggleSelectAll}
                size="small"
                sx={{ p: 0, mr: 1 }}
              />
              <Typography variant="body2" color="#484848" fontWeight={600}>
                Select All
              </Typography>
            </Box>
            {selectedRisks.length > 0 && (
              <>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<FileMoveIcon height={20} width={20} />}
                  sx={{ textTransform: "none" }}
                  onClick={() =>
                    onMoveSelected(process.orgProcessId, process.name)
                  }
                >
                  Move Selected to Another Process
                </Button>
                <Button
                  variant="text"
                  size="small"
                  startIcon={
                    <DeleteOutlineIcon
                      sx={{ color: "#DC2626", height: 20, width: 20 }}
                    />
                  }
                  color="error"
                  sx={{ textTransform: "none" }}
                  onClick={() => onDeleteBulk(process.orgProcessId)}
                >
                  Remove selected items
                </Button>
              </>
            )}
          </Stack>
          {selectedRisks.length == 0 && (
            <Button
              size="small"
              color="primary"
              sx={{ textTransform: "none", fontSize: "14px" }}
              startIcon={<AddIcon fontSize="medium" />}
            >
              Add Risk Scenarios
            </Button>
          )}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.5,
          }}
        >
          {process.risks.map((risk) => (
            <Paper
              key={risk.orgRiskId}
              sx={{
                bgcolor: "#fff",
                borderRadius: "8px",
                borderLeft: "4px solid #04139A",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.08)",
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Stack direction="column">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Checkbox
                    size="small"
                    sx={{
                      color: "#04139A",
                      "&.Mui-checked": {
                        color: "#04139A", // ensures blue tick and box
                      },
                      px: 1.5,
                      pt: 1.5,
                      pb: 1,
                    }}
                    checked={selectedRisks.includes(risk.orgRiskId)}
                    onChange={() => toggleSelect(risk.orgRiskId)}
                  />
                  <Box
                    sx={{
                      px: 1.5,
                      pt: 1.5,
                      pb: 1,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => {
                        toggleSelect(risk.orgRiskId);
                        onMoveSelected(process.orgProcessId, process.name);
                      }}
                    >
                      <FileMoveIcon height={16} width={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        onDelete(process.orgProcessId, risk.orgRiskId);
                      }}
                    >
                      <DeleteOutlineIcon
                        fontSize="small"
                        sx={{ color: "#DC2626" }}
                      />
                    </IconButton>
                  </Box>
                </Box>
                <Box
                  sx={{
                    flexGrow: 1,
                    fontSize: "13px",
                    px: 1.5,
                    pb: 1.5,
                  }}
                >
                  {risk?.description?.length > 60
                    ? risk.description.substring(0, 60) + " read more"
                    : risk.description}
                </Box>
              </Stack>
            </Paper>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ProcessCardRisk;
