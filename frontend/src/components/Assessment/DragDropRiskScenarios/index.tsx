"use client";

import React, { useEffect, useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { Grid } from "@mui/material";

import RiskScenarioPool from "../RiskScenarioPool";
import ProcessCardRisk from "../ProcessCardRisk";
import MoveProcessModal from "../MoveProcessModal";
import { useAssessment } from "@/context/AssessmentContext";
import { getOrganizationRisks } from "@/pages/api/organization";
import { ProcessUnit, Risk } from "@/types/assessment";

const DragDropRiskScenarios = () => {
  const { assessment, updateAssessment } = useAssessment();

  const [riskPool, setRiskPool] = useState<Risk[]>([]);

  const [processes, setProcesses] = useState<ProcessUnit[] | undefined>(
    assessment?.processes
  );

  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [activeProcessId, setActiveProcessId] = useState<string | null>(null);
  const [activeProcessName, setActiveProcessName] = useState<string | null>(
    null
  );

  useEffect(() => {
    const getOrg = async () => {
      const res = await getOrganizationRisks(assessment?.orgId);

      if (!res?.data) return;

      // 🔹 Collect all risk IDs already in the assessment
      const existingRiskIds = new Set(
        assessment?.processes?.flatMap((p) => p?.risks?.map((r) => r.id)) || []
      );

      // 🔹 Filter out risks already present in assessment
      const filteredRisks = res.data.filter(
        (risk: any) => !existingRiskIds.has(risk.id)
      );

      setRiskPool(filteredRisks);
    };

    if (assessment?.orgId) {
      getOrg();
    }
  }, [assessment]);

  useEffect(() => {
    updateAssessment({ processes });
  }, [processes]);

  const handleDeleteBulk = (processId: string) => {
    setProcesses((prev) =>
      prev?.map((p) =>
        p.id === processId
          ? {
              ...p,
              risks: p.risks.filter((r) => !selectedRisks.includes(r.id)),
            }
          : p
      )
    );

    setSelectedRisks([]);

    const deletedRisks =
      processes
        ?.find((p) => p.id === processId)
        ?.risks.filter((r) => selectedRisks.includes(r.id)) || [];

    if (deletedRisks.length > 0) {
      setRiskPool((prev) => [...prev, ...deletedRisks]);
    }
  };

  const handleDelete = (processId: string, riskId: string) => {
    setProcesses((prev) =>
      prev?.map((p) =>
        p.id === processId
          ? {
              ...p,
              risks: p.risks.filter((r) => r.id !== riskId),
            }
          : p
      )
    );
    const deletedRisk = processes
      ?.find((p) => p.id === processId)
      ?.risks.find((r) => r.id === riskId);
    if (deletedRisk) {
      setRiskPool((prev) => [...prev, deletedRisk]);
    }
  };

  const handleMoveSelected = (
    fromProcessId: string,
    fromProcessName: string
  ) => {
    setActiveProcessId(fromProcessId);
    setActiveProcessName(fromProcessName);
    setMoveModalOpen(true);
  };

  const confirmMove = (fromProcessId: string | null, toProcessId: string) => {
    if (!activeProcessId) return;
    setProcesses((prev) => {
      const fromProcess = prev?.find((p) => p.id === fromProcessId);
      if (!fromProcess) return prev;

      const movingRisks = fromProcess.risks.filter((r: { id: string }) =>
        selectedRisks.includes(r.id)
      );

      return prev?.map((p) => {
        if (p.id === fromProcessId) {
          return {
            ...p,
            risks: p.risks.filter((r) => !selectedRisks.includes(r.id)),
          };
        }
        if (p.id === toProcessId) {
          return {
            ...p,
            risks: [...(p.risks ?? []), ...(movingRisks ?? [])],
          };
        }
        return p;
      });
    });
    setSelectedRisks([]);
    setActiveProcessId(null);
    setMoveModalOpen(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const draggedRisk = riskPool.find((r) => r.id === active.id);
    if (!draggedRisk) return;

    if (over.id !== "risk-pool") {
      setRiskPool((prev) => prev.filter((r) => r.id !== active.id));

      setProcesses((prev) =>
        prev?.map((p) =>
          p.id === over.id
            ? { ...p, risks: [...(p.risks ?? []), draggedRisk] }
            : p
        )
      );
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <RiskScenarioPool riskPool={riskPool} />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          {processes?.map((process) => (
            <ProcessCardRisk
              key={process.id}
              process={process}
              selectedRisks={selectedRisks}
              setSelectedRisks={setSelectedRisks}
              onDelete={handleDelete}
              onDeleteBulk={handleDeleteBulk}
              onMoveSelected={handleMoveSelected}
            />
          ))}
        </Grid>
      </Grid>

      <MoveProcessModal
        open={moveModalOpen}
        onClose={() => setMoveModalOpen(false)}
        processes={processes}
        fromProcessId={activeProcessId}
        fromProcessName={activeProcessName}
        onMove={confirmMove}
        title="Risk Scenario"
      />
    </DndContext>
  );
};

export default DragDropRiskScenarios;
