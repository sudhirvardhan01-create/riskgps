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
  const { assessment?.orgId, assessment?.processes, setSelectedProcesses } =
    useAssessment();

  const [riskPool, setRiskPool] = useState<Risk[]>([]);

  const [processes, setProcesses] = useState<ProcessUnit[]>(assessment?.processes);

  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [activeProcessId, setActiveProcessId] = useState<string | null>(null);
  const [activeProcessName, setActiveProcessName] = useState<string | null>(
    null
  );

  useEffect(() => {
    const getOrg = async () => {
      const res = await getOrganizationRisks(assessment?.orgId);
      setRiskPool(res.data);
    };

    getOrg();
  }, []);

  useEffect(() => {
    setSelectedProcesses(processes);
  }, [processes]);

  const handleDeleteBulk = (processId: string) => {
    setProcesses((prev) =>
      prev.map((p) =>
        p.orgProcessId === processId
          ? {
              ...p,
              risks: p.risks.filter(
                (r) => !selectedRisks.includes(r.orgRiskId)
              ),
            }
          : p
      )
    );

    setSelectedRisks([]);

    const deletedRisks =
      processes
        .find((p) => p.orgProcessId === processId)
        ?.risks.filter((r) => selectedRisks.includes(r.orgRiskId)) || [];

    if (deletedRisks.length > 0) {
      setRiskPool((prev) => [...prev, ...deletedRisks]);
    }
  };

  const handleDelete = (processId: string, riskId: string) => {
    setProcesses((prev) =>
      prev.map((p) =>
        p.orgProcessId === processId
          ? {
              ...p,
              risks: p.risks.filter((r) => r.orgRiskId !== riskId),
            }
          : p
      )
    );
    const deletedRisk = processes
      .find((p) => p.orgProcessId === processId)
      ?.risks.find((r) => r.orgRiskId === riskId);
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
      const fromProcess = prev.find((p) => p.orgProcessId === fromProcessId);
      if (!fromProcess) return prev;

      const movingRisks = fromProcess.risks.filter((r: { orgRiskId: string }) =>
        selectedRisks.includes(r.orgRiskId)
      );

      return prev.map((p) => {
        if (p.orgProcessId === fromProcessId) {
          return {
            ...p,
            risks: p.risks.filter((r) => !selectedRisks.includes(r.orgRiskId)),
          };
        }
        if (p.orgProcessId === toProcessId) {
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

    const draggedRisk = riskPool.find((r) => r.orgRiskId === active.id);
    if (!draggedRisk) return;

    if (over.id !== "risk-pool") {
      setRiskPool((prev) => prev.filter((r) => r.orgRiskId !== active.id));

      setProcesses((prev) =>
        prev.map((p) =>
          p.orgProcessId === over.id
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
          {processes.map((process) => (
            <ProcessCardRisk
              key={process.orgProcessId}
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
