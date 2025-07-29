import { Menu, MenuItem, ListItemIcon, IconButton } from '@mui/material'
import React from 'react'
import { MoreVert } from '@mui/icons-material'

interface EditDeleteDialogItem {
    onAction: () => void;
    color: string;
    action: string;
    icon: React.ReactNode;
}

interface EditDeleteDialogProps {
    items: EditDeleteDialogItem[];
}

const EditDeleteDialog: React.FC<EditDeleteDialogProps> = ({ items }) => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton sx={{ px: 0, mx: '0px !important' }}
                id="open-edit-delete-dialog"
                aria-controls={open ? 'edit-delete-dialog' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}>
                <MoreVert sx={{ color: "primary.main" }} />
            </IconButton>
            <Menu
                id="edit-delete-dialog"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'open-edit-delete-dialog',
                    },
                    paper: {
                        sx: {
                            width: '160px',
                            height: '84px',
                            boxShadow: '0px 8px 16px 0px #12121221',
                            borderRadius: 2,
                            border: '1px solid #CECFD2',
                        }
                    }
                }}
            >
                {items.map((item, index) => (
                    <MenuItem key={index} onClick={() => {item.onAction();setAnchorEl(null)}}>
                        <ListItemIcon sx={{ color: item.color }}>
                            {item.icon}
                        </ListItemIcon>
                        {item.action}
                    </MenuItem>
                ))}

            </Menu>
        </>
    )
}

export default EditDeleteDialog
