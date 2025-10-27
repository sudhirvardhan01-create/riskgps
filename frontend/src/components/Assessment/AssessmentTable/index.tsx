import {
  Avatar,
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { useState } from "react";
import { Assessment } from "@/types/assessment";

interface Props {
  data: Assessment[];
  onMenuClick: (event: React.MouseEvent<HTMLElement>, runId: string) => void;
  onCardClick: (runId: string) => void;
  variant?: "default" | "businessUnit";
  businessUnitName?: string;
}

const userData = {
  name: "Harsh Kansal",
  avatar: "/path/to/avatar",
};

// ✅ Child row component for default variant
const AssessmentRow: React.FC<{
  assessment: Assessment;
  onMenuClick: Props["onMenuClick"];
  onCardClick: Props["onCardClick"];
}> = ({ assessment, onMenuClick, onCardClick }) => {
  const [expanded, setExpanded] = useState(false);
  const desc = assessment.assessmentDesc || "";

  const limit = 25;
  const isLong = desc.length > limit;
  const displayedText =
    expanded || !isLong ? desc : desc.slice(0, limit) + "...";

  return (
    <Paper
      variant="outlined"
      sx={{
        mb: 2,
        p: 2,
        border: "1px solid #E7E7E8",
        borderRadius: "8px",
        display: "grid",
        gridTemplateColumns: "42px 160px 260px 80px 80px 80px 130px 160px 20px",
        alignItems: "center",
        gap: 2,
        "&:hover": { border: "1px solid #1976d2" },
        width: "100%",
        cursor: "pointer",
      }}
      onClick={() => onCardClick(assessment.assessmentId)}
    >
      {/* Run ID */}
      <Typography>{assessment.runId}</Typography>

      {/* Org + Industry */}
      <Box>
        <Typography fontWeight={600}>{assessment.orgName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {assessment.orgDesc}
        </Typography>
      </Box>

      {/* Assessment Name + Description */}
      <Box>
        <Typography fontWeight={600}>{assessment.assessmentName}</Typography>
        <Typography variant="caption">
          <span style={{ color: "#484848", fontWeight: 600 }}>
            Description:{" "}
          </span>
          <span style={{ color: "#91939A", textWrap: "wrap" }}>
            {displayedText}{" "}
          </span>
          {isLong && (
            <span
              style={{ color: "#1976d2", cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? "read less" : "read more"}
            </span>
          )}
        </Typography>
      </Box>

      {/* Dates */}
      <Typography variant="body2">
        {new Date(assessment.startDate).toLocaleDateString()}
      </Typography>
      <Typography variant="body2">
        {new Date(assessment.lastActivity).toLocaleDateString()}
      </Typography>
      <Typography variant="body2">
        {assessment.endDate &&
          new Date(assessment.endDate).toLocaleDateString()}
      </Typography>

      {/* Last Modified */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar src={userData.avatar} sx={{ width: 24, height: 24 }} />
        <Typography variant="body2">{userData.name}</Typography>
      </Box>

      {/* Status */}
      <Box textAlign={"center"}>
        <Typography variant="caption" fontWeight={600}>
          {assessment.status == "in_progress" ? 61 : 100}
          {"% Completed "}
          {assessment.status == "closed" && " • Closed"}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={assessment.status == "in_progress" ? 61 : 100}
          sx={{
            height: 12,
            borderRadius: 1,
            "& .MuiLinearProgress-bar": {
              backgroundColor:
                assessment.status == "completed" ? "#147A50" : "#FFD966",
            },
          }}
        />
      </Box>

      {/* Actions */}
      <IconButton onClick={(e) => onMenuClick(e, assessment.runId)}>
        <MoreVertIcon />
      </IconButton>
    </Paper>
  );
};

// ✅ Main table component
const AssessmentTable: React.FC<Props> = ({
  data,
  onMenuClick,
  onCardClick,
  variant = "default",
  businessUnitName,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(
    new Set()
  );

  // Different column templates based on variant
  const columnTemplate =
    variant === "businessUnit"
      ? "42px 170px 90px 90px 90px 120px 130px 15px"
      : "42px 160px 260px 80px 80px 80px 130px 145px 20px";

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const toggleDescription = (runId: string) => {
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(runId)) {
        newSet.delete(runId);
      } else {
        newSet.add(runId);
      }
      return newSet;
    });
  };

  const truncateText = (text: string, maxLength: number = 35) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Empty state for business unit variant
  if (variant === "businessUnit" && data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography
          variant="body1"
          sx={{
            color: "#121212",
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          No assessments available for {businessUnitName || 'business unit'}. Create new assessment.
        </Typography>
      </Box>
    );
  }

  // Get data to display (with pagination for business unit variant)
  const displayData =
    variant === "businessUnit"
      ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : data;

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: columnTemplate,
          backgroundColor: "#91939A",
          borderRadius: 1,
          p: 2,
          alignItems: "center",
          gap: 2,
          width: "100%",
        }}
      >
        {(variant === "businessUnit"
          ? [
              "Run ID",
              "Assessment Run Name",
              "Start Date",
              "Last Activity",
              "End Date",
              "Last Updated By",
              "Status",
              "",
            ]
          : [
              "Run ID",
              "Org",
              "Assessment Run Name",
              "Start Date",
              "Last Activity",
              "End Date",
              "Last Updated By",
              "Status",
              "",
            ]
        ).map((header, ind) => (
          <Typography
            key={header}
            variant="caption"
            color="#FFFFFF"
            fontWeight={600}
            textAlign={ind > 2 ? "center" : "left"}
          >
            {header}
          </Typography>
        ))}
      </Box>

      {/* Table Body */}
      {variant === "default" ? (
        // Default variant - use AssessmentRow component
        <Box sx={{ mt: 2, overflow: "auto", maxHeight: "calc(100vh - 344px)" }}>
          {displayData.map((assessment) => (
            <AssessmentRow
              key={assessment.runId}
              assessment={assessment}
              onMenuClick={onMenuClick}
              onCardClick={onCardClick}
            />
          ))}
        </Box>
      ) : (
        // Business unit variant - inline rendering
        <Box sx={{ mt: 2 }}>
          {displayData.map((assessment) => (
            <Paper
              key={assessment.runId}
              variant="outlined"
              sx={{
                mb: 2,
                p: 1,
                border: "1px solid #E7E7E8",
                borderRadius: "8px",
                display: "grid",
                gridTemplateColumns: columnTemplate,
                alignItems: "center",
                gap: 1,
                "&:hover": {
                  border: "1px solid #04139A",
                },
                width: "100%",
                cursor: "pointer",
              }}
              onClick={() => onCardClick(assessment.runId)}
            >
              {/* Run ID */}
              <Typography>{assessment.runId}</Typography>

              {/* Assessment Name + Description */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 400,
                    verticalAlign: "middle",
                    color: "#484848",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {assessment.assessmentName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 400,
                    verticalAlign: "middle",
                    color: "#91939A",
                    maxWidth: "100%",
                    wordWrap: "break-word",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <span style={{ color: "#484848" }}>Description: </span>
                  {expandedDescriptions.has(assessment.runId)
                    ? assessment.assessmentDesc
                    : truncateText(assessment.assessmentDesc || "")}{" "}
                  {(assessment.assessmentDesc || "").length > 35 && (
                    <span
                      style={{ color: "#04139A", cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDescription(assessment.runId);
                      }}
                    >
                      {expandedDescriptions.has(assessment.runId)
                        ? "read less"
                        : "read more"}
                    </span>
                  )}
                </Typography>
              </Box>

              {/* Dates */}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 400,
                  fontStyle: "normal",
                  verticalAlign: "middle",
                  color: "#484848",
                }}
              >
                {new Date(assessment.startDate).toLocaleDateString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 400,
                  fontStyle: "normal",
                  verticalAlign: "middle",
                  color: "#484848",
                }}
              >
                {new Date(assessment.lastActivity).toLocaleDateString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 400,
                  fontStyle: "normal",
                  verticalAlign: "middle",
                  color: "#484848",
                }}
              >
                {assessment.endDate
                  ? new Date(assessment.endDate).toLocaleDateString()
                  : ""}
              </Typography>

              {/* Last Modified */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar src={userData.avatar} sx={{ width: 24, height: 24 }}>
                  {userData.name.charAt(0)}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 400,
                    fontStyle: "normal",
                    verticalAlign: "middle",
                    color: "#484848",
                  }}
                >
                  {userData.name}
                </Typography>
              </Box>

              {/* Status */}
              <Box textAlign={"center"}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 500,
                    fontStyle: "normal",
                    color: "#484848",
                    mb: 1,
                  }}
                >
                  {assessment.status == "in_progress" ? 61 : 100}
                  {"% Completed "}
                  {assessment.status == "closed" && " • Closed"}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={assessment.status == "in_progress" ? 61 : 100}
                  sx={{
                    height: 12,
                    borderRadius: 1,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        assessment.status == "completed"
                          ? "#147A50"
                          : "#FFD966",
                    },
                  }}
                />
              </Box>

              {/* Actions */}
              <IconButton onClick={(e) => onMenuClick(e, assessment.runId)}>
                <MoreVertIcon />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}

      {/* Pagination (only for business unit variant) */}
      {variant === "businessUnit" && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
            px: 1,
            gap: 4,
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 400,
                fontStyle: "normal",
                textAlign: "center",
                color: "#191919",
              }}
            >
              View users per page
            </Typography>
            <FormControl size="small">
              <Select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #E7E7E8",
                    borderRadius: "8px",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #002F75",
                    borderRadius: "8px",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #002F75",
                    borderRadius: "8px",
                  },
                  height: "37px",
                  fontSize: "14px",
                  color: "#191919",
                  borderRadius: "8px",
                  backgroundColor: "#E7E7E84D",
                }}
              >
                {[5, 10, 25].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 400,
                fontStyle: "normal",
                textAlign: "center",
                color: "#191919",
              }}
            >
              {page * rowsPerPage + 1}-
              {Math.min((page + 1) * rowsPerPage, data.length)} of {data.length}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                size="small"
                sx={{
                  border: "1px solid #002F75",
                  borderRadius: "8px",
                  width: 36,
                  height: 36,
                  "&:disabled": {
                    opacity: 0.5,
                  },
                }}
              >
                <Typography variant="h6" sx={{ color: "#002F75" }}>
                  &lt;
                </Typography>
              </IconButton>
              <IconButton
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(data.length / rowsPerPage) - 1}
                size="small"
                sx={{
                  border: "1px solid #002F75",
                  borderRadius: "8px",
                  width: 36,
                  height: 36,
                  "&:disabled": {
                    opacity: 0.5,
                  },
                }}
              >
                <Typography variant="h6" sx={{ color: "#002F75" }}>
                  &gt;
                </Typography>
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AssessmentTable;
