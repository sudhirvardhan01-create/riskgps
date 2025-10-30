"use client";

import React from "react";
import { Paper, Typography } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";

const DraggableAssetItem = ({
  asset,
}: {
  asset: { id: string; name: string; description: string };
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: asset.id,
      data: { type: "asset", asset },
    });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <Paper
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        py: 1.5,
        px: 2,
        borderRadius: "4px",
        border: "1px solid #E7E7E8",
        backgroundColor: "#fff",
        zIndex: 10,
        boxShadow: "none",
        "&:hover": { borderColor: "#6366F1", boxShadow: "0 0 6px #E0E7FF" },
      }}
      style={style}
    >
      <Typography variant="body2">
        {/* {asset?.description?.length > 60
          ? asset.description.substring(0, 60) + " read more"
          : asset?.description} */}
        {asset?.name}
      </Typography>
    </Paper>
  );
};

export default DraggableAssetItem;
