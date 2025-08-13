import { InfoOutline } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

interface TooltipComponentProps {
  title?: string;
  width?: string | number;
  height?: string | number;
}

const TooltipComponent: React.FC<TooltipComponentProps> = ({
  title,
  width="12px",
  height="12px"
}: TooltipComponentProps) => {
  return (
    <Tooltip title={title}>
      <IconButton sx={{ padding: 0, height: {height}, width: {width} }}>
        <InfoOutline sx={{ height: {height}, width: {width}, color: "#FF830F" }} />
      </IconButton>
    </Tooltip>
  );
};

export default TooltipComponent;
