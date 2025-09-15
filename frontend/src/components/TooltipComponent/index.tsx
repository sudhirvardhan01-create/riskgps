import { Info } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

interface TooltipComponentProps {
  title?: string;
  width?: string | number;
  height?: string | number;
}

const TooltipComponent: React.FC<TooltipComponentProps> = ({
  title,
  width = "16px",
  height = "16px",
}: TooltipComponentProps) => {
  return (
    <Tooltip title={title} placement="top">
      <IconButton sx={{ padding: 0, height: { height }, width: { width } }}>
        <Info sx={{ height: { height }, width: { width } }} />
      </IconButton>
    </Tooltip>
  );
};

export default TooltipComponent;

