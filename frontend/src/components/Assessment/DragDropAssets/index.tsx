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
  const { assessment, updateAssessment } = useAssessment();

  const [assetPool, setAssetPool] = useState<Asset[]>([]);

  const [processes, setProcesses] = useState<ProcessUnit[] | undefined>(
    assessment?.processes
  );

  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [activeProcessId, setActiveProcessId] = useState<string | null>(null);
  const [activeProcessName, setActiveProcessName] = useState<string | null>(
    null
  );

  useEffect(() => {
    const getOrg = async () => {
      const res = await getOrganizationAssets(assessment?.orgId);

      if (!res?.data) return;

      // 🔹 Collect all asset IDs already in the assessment
      const existingAssetIds = new Set(
        assessment?.processes?.flatMap((p) => p?.assets?.map((r) => r.id)) || []
      );

      // 🔹 Filter out assets already present in assessment
      const filteredAssets = res.data.filter(
        (asset: any) => !existingAssetIds.has(asset.id)
      );

      setAssetPool(filteredAssets);
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
              assets: p.assets.filter((r) => !selectedAssets.includes(r.id)),
            }
          : p
      )
    );

    setSelectedAssets([]);

    const deletedAssets =
      processes
        ?.find((p) => p.id === processId)
        ?.assets.filter((r) => selectedAssets.includes(r.id)) || [];

    if (deletedAssets.length > 0) {
      setAssetPool((prev) => [...prev, ...deletedAssets]);
    }
  };

  const handleDelete = (processId: string, assetId: string) => {
    setProcesses((prev) =>
      prev?.map((p) =>
        p.id === processId
          ? {
              ...p,
              assets: p.assets.filter((r) => r.id !== assetId),
            }
          : p
      )
    );
    const deletedAsset = processes
      ?.find((p) => p.id === processId)
      ?.assets.find((r) => r.id === assetId);
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
      const fromProcess = prev?.find((p) => p.id === fromProcessId);
      if (!fromProcess) return prev;

      const movingAssets = fromProcess.assets.filter((r: { id: string }) =>
        selectedAssets.includes(r.id)
      );

      return prev?.map((p) => {
        if (p.id === fromProcessId) {
          return {
            ...p,
            assets: p.assets.filter((r) => !selectedAssets.includes(r.id)),
          };
        }
        if (p.id === toProcessId) {
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

    const draggedAsset = assetPool.find((r) => r.id === active.id);
    if (!draggedAsset) return;

    if (over.id !== "asset-pool") {
      setAssetPool((prev) => prev.filter((r) => r.id !== active.id));

      setProcesses((prev) =>
        prev?.map((p) =>
          p.id === over.id
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
          {processes?.map((process) => (
            <ProcessCardAsset
              key={process.id}
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
