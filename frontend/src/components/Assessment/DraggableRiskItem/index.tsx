"use client";

import React from "react";
import { Paper, Typography } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";

const DraggableRiskItem = ({
  risk,
}: {
  risk: { orgRiskId: string; name: string; description: string };
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: risk.orgRiskId,
      data: { type: "risk", risk },
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
        {risk?.description?.length > 60
          ? risk.description.substring(0, 60) + " read more"
          : risk?.description}
      </Typography>
    </Paper>
  );
};

export default DraggableRiskItem;
