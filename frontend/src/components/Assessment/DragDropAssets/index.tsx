"use client";

import React, { useEffect, useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { Grid } from "@mui/material";

import AssetPool from "../AssetPool";
import ProcessCardAsset from "../ProcessCardAsset";
import MoveProcessModal from "../MoveProcessModal";
import { useAssessment } from "@/context/AssessmentContext";
import { getOrganizationAssets } from "@/pages/api/organization";
import { ProcessUnit, Asset } from "@/types/assessment";

const DragDropAssets = () => {
  const { assessment?.orgId, assessment?.processes, setSelectedProcesses } =
    useAssessment();

  const [assetPool, setAssetPool] = useState<Asset[]>([]);

  const [processes, setProcesses] = useState<ProcessUnit[]>(assessment?.processes);

  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [activeProcessId, setActiveProcessId] = useState<string | null>(null);
  const [activeProcessName, setActiveProcessName] = useState<string | null>(
    null
  );

  useEffect(() => {
    const getOrg = async () => {
      const res = await getOrganizationAssets(assessment?.orgId);
      setAssetPool(res.data);
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
              assets: p.assets.filter(
                (r) => !selectedAssets.includes(r.orgAssetId)
              ),
            }
          : p
      )
    );

    setSelectedAssets([]);

    const deletedAssets =
      processes
        .find((p) => p.orgProcessId === processId)
        ?.assets.filter((r) => selectedAssets.includes(r.orgAssetId)) || [];

    if (deletedAssets.length > 0) {
      setAssetPool((prev) => [...prev, ...deletedAssets]);
    }
  };

  const handleDelete = (processId: string, assetId: string) => {
    setProcesses((prev) =>
      prev.map((p) =>
        p.orgProcessId === processId
          ? {
              ...p,
              assets: p.assets.filter((r) => r.orgAssetId !== assetId),
            }
          : p
      )
    );
    const deletedAsset = processes
      .find((p) => p.orgProcessId === processId)
      ?.assets.find((r) => r.orgAssetId === assetId);
    if (deletedAsset) {
      setAssetPool((prev) => [...prev, deletedAsset]);
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

      const movingAssets = fromProcess.assets.filter(
        (r: { orgAssetId: string }) => selectedAssets.includes(r.orgAssetId)
      );

      return prev.map((p) => {
        if (p.orgProcessId === fromProcessId) {
          return {
            ...p,
            assets: p.assets.filter(
              (r) => !selectedAssets.includes(r.orgAssetId)
            ),
          };
        }
        if (p.orgProcessId === toProcessId) {
          return {
            ...p,
            assets: [...(p.assets ?? []), ...(movingAssets ?? [])],
          };
        }
        return p;
      });
    });
    setSelectedAssets([]);
    setActiveProcessId(null);
    setMoveModalOpen(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const draggedAsset = assetPool.find((r) => r.orgAssetId === active.id);
    if (!draggedAsset) return;

    if (over.id !== "asset-pool") {
      setAssetPool((prev) => prev.filter((r) => r.orgAssetId !== active.id));

      setProcesses((prev) =>
        prev.map((p) =>
          p.orgProcessId === over.id
            ? { ...p, assets: [...(p.assets ?? []), draggedAsset] }
            : p
        )
      );
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <AssetPool assetPool={assetPool} />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          {processes.map((process) => (
            <ProcessCardAsset
              key={process.orgProcessId}
              process={process}
              selectedAssets={selectedAssets}
              setSelectedAssets={setSelectedAssets}
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
        title="Asset"
      />
    </DndContext>
  );
};

export default DragDropAssets;
