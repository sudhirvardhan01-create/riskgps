import { Menu, MenuItem, ListItemIcon, IconButton } from '@mui/material'
import React from 'react'
import { EditOutlined, DeleteOutlineOutlined, MoreVert } from '@mui/icons-material';

const EditDeleteDialog = () => {

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
                <MenuItem onClick={handleClose}>
                    <ListItemIcon sx={{ color: 'primary.main' }}>
                        <EditOutlined fontSize="small" />
                    </ListItemIcon>
                    Edit
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon sx={{ color: '#CD0303' }}>
                        <DeleteOutlineOutlined fontSize="small" />
                    </ListItemIcon>
                    Delete
                </MenuItem>
            </Menu>
        </>
    )
}

export default EditDeleteDialog