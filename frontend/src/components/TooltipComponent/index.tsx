import { InfoOutline } from "@mui/icons-material"
import { IconButton, Tooltip } from "@mui/material"

interface TooltipComponentProps {
    title: string;
}

const TooltipComponent : React.FC<TooltipComponentProps> = ({title} : TooltipComponentProps) => {
    return (
        <Tooltip title={title}>
            <IconButton sx={{padding: 0}}>
                <InfoOutline/>
            </IconButton>
        </Tooltip>
    )
}

export default TooltipComponent;