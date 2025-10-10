import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Avatar,
  LinearProgress,
  IconButton,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

interface Assessment {
  runId: string;
  name: string;
  description: string;
  startDate: string;
  lastActivity: string;
  endDate: string;
  lastModifiedBy: {
    name: string;
    avatar: string;
  };
  status: {
    progress: number;
    closed?: boolean;
  };
}

interface BusinessUnitAssessmentTableProps {
  data: Assessment[];
  onMenuClick: (event: React.MouseEvent<HTMLElement>, runId: string) => void;
}

const BusinessUnitAssessmentTable: React.FC<BusinessUnitAssessmentTableProps> = ({
  data,
  onMenuClick
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const columnTemplate = "42px 150px 90px 90px 90px 130px 110px 15px";

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const toggleDescription = (runId: string) => {
    console.log('Toggling description for runId:', runId);
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(runId)) {
        newSet.delete(runId);
        console.log('Collapsing description for:', runId);
      } else {
        newSet.add(runId);
        console.log('Expanding description for:', runId);
      }
      console.log('Current expanded descriptions:', Array.from(newSet));
      return newSet;
    });
  };

  const truncateText = (text: string, maxLength: number = 35) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography
          variant="body1"
          sx={{
            color: '#666666',
            fontSize: '14px',
          }}
        >
          No assessments available for this business unit.
        </Typography>
      </Box>
    );
  }

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: columnTemplate,
          backgroundColor: "#91939A",
          borderRadius: "4px",
          p: 1.5,
          alignItems: "center",
          gap: 1,
          width: "100%",
        }}
      >
        {[
          "Run ID",
          "Assessment Run Name",
          "Start Date",
          "Last Activity",
          "End Date",
          "Last Updated By",
          "Status",
          "",
        ].map((header, ind) => (
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

      {/* Table Body (Card style rows) */}
      <Box sx={{ mt: 2 }}>
        {paginatedData.map((assessment) => (
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
              gap: 2,
              "&:hover": {
                border: "1px solid #04139A",
              },
              width: "100%",
              cursor: "pointer",
            }}
          >
            {/* Run ID */}
            <Typography>{assessment.runId}</Typography>

            {/* Assessment Name + Description */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 400,
                  verticalAlign: 'middle',
                  color: '#484848',
                  margin: 0,
                  padding: 0
                }}
              >
                {assessment.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 400,
                  verticalAlign: 'middle',
                  color: '#91939A',
                  maxWidth: '100%',
                  wordWrap: 'break-word',
                  margin: 0,
                  padding: 0,
                }}
              >
                <span style={{ color: '#484848' }}>Description: </span>
                {expandedDescriptions.has(assessment.runId)
                  ? assessment.description
                  : truncateText(assessment.description)
                }{" "}
                {assessment.description.length > 35 && (
                  <span
                    style={{ color: "#04139A", cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDescription(assessment.runId);
                    }}
                  >
                    {expandedDescriptions.has(assessment.runId) ? 'read less' : 'read more'}
                  </span>
                )}
              </Typography>
            </Box>

            {/* Dates */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 400,
                fontStyle: 'normal',
                verticalAlign: 'middle',
                color: '#484848'
              }}
            >
              {assessment.startDate}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 400,
                fontStyle: 'normal',
                verticalAlign: 'middle',
                color: '#484848'
              }}
            >
              {assessment.lastActivity}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 400,
                fontStyle: 'normal',
                verticalAlign: 'middle',
                color: '#484848'
              }}
            >
              {assessment.endDate}
            </Typography>

            {/* Last Modified */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                src={assessment.lastModifiedBy.avatar}
                sx={{ width: 24, height: 24 }}
              >
                {assessment.lastModifiedBy.name.charAt(0)}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 400,
                  fontStyle: 'normal',
                  verticalAlign: 'middle',
                  color: "#484848"
                }}
              >
                {assessment.lastModifiedBy.name}
              </Typography>
            </Box>

            {/* Status */}
            <Box textAlign={"center"}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  fontStyle: 'normal',
                  color: '#484848',
                  mb: 1
                }}
              >
                {assessment.status.progress}
                {"% Completed "}
                {assessment.status.closed && " • Closed"}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={assessment.status.progress}
                sx={{
                  height: 12,
                  borderRadius: 1,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor:
                      assessment.status.progress === 100
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

      {/* Pagination */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 2,
        px: 1,
        gap: 4,
        mb: 1,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 400,
              fontStyle: 'normal',
              textAlign: 'center',
              color: '#191919'
            }}
          >
            View users per page
          </Typography>
          <FormControl size="small">
            <Select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid #E7E7E8',
                  borderRadius: '8px',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid #002F75',
                  borderRadius: '8px',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid #002F75',
                  borderRadius: '8px',
                },
                height: '37px',
                fontSize: '14px',
                color: "#191919",
                borderRadius: '8px',
                backgroundColor: "#E7E7E84D"
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 400,
              fontStyle: 'normal',
              textAlign: 'center',
              color: '#191919'
            }}
          >
            {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, data.length)} of {data.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              size="small"
              sx={{
                border: '1px solid #002F75',
                borderRadius: "8px",
                width: 36,
                height: 36,
                '&:disabled': {
                  opacity: 0.5,
                }
              }}
            >
              <Typography variant="h6" sx={{ color: '#002F75' }}>&lt;</Typography>
            </IconButton>
            <IconButton
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(data.length / rowsPerPage) - 1}
              size="small"
              sx={{
                border: '1px solid #002F75',
                borderRadius: "8px",
                width: 36,
                height: 36,
                '&:disabled': {
                  opacity: 0.5,
                }
              }}
            >
              <Typography variant="h6" sx={{ color: '#002F75' }}>&gt;</Typography>
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BusinessUnitAssessmentTable;
