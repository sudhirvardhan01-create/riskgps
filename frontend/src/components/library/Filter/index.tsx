import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Checkbox, FormControlLabel, FormGroup, IconButton, Stack, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

export default function Filter() {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 480 }} role="presentation">
            <Stack direction="row" justifyContent="space-between" alignItems="center" m={2}>
                <Typography variant="h2" sx={{ color: '#191919', fontWeight: 500, fontSize: '24px' }}>
                    Filters
                </Typography>
                <IconButton onClick={toggleDrawer(false)} sx={{ color: 'black', padding: '0px !important'  }}>
                    <Close fontSize='small' />
                </IconButton>
            </Stack>

            <Stack bgcolor='#F3F8FF' mx={2} borderRadius={2} p={2} direction="column" spacing={1}>
                <Typography variant='h1' sx={{ color: '#191919', fontWeight: 500, fontSize: '16px' }}>
                    Status
                </Typography>
                <FormGroup>
                    <FormControlLabel control={<Checkbox size="small"/>} label="published" />
                    <FormControlLabel control={<Checkbox size="small"/>} label="draft" />
                    <FormControlLabel control={<Checkbox size="small"/>} label="disabled" />
                </FormGroup>

            </Stack>

        </Box>
    );

    return (
        <div>
            <Button onClick={toggleDrawer(true)}>Open drawer</Button>
            <Drawer open={open} onClose={toggleDrawer(false)} anchor='right'>
                {DrawerList}
            </Drawer>
        </div>
    );
}
