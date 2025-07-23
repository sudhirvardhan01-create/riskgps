import {
    Box,
    Typography,
    Stack,
    Select,
    MenuItem,
    Button,
    InputAdornment,
    TextField,
    InputLabel,
    FormControl,
} from '@mui/material';
import AccessTypeCard from '@/components/metadata/metadataCard'
import React from 'react'
import { Search } from '@mui/icons-material';

const Index = () => {

    return (
        <>
            <Box p={5}>
            <Box mb={3}>
                {/* Row 1: Breadcrumb + Add Button */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    spacing={2}
                    sx={{ mb: 2 }}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body1" color="textPrimary" fontWeight={600}>
                            Metadata
                        </Typography>
                    </Stack>

                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#0018A8',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#001080',
                            },
                        }}
                    >
                        Add Configuration
                    </Button>
                </Stack>

                {/* Row 2: Search + Sort */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    useFlexGap
                    flexWrap="wrap"
                    justifyContent="space-between"
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                >
                    {/* Search Bar */}
                    <TextField
                        size="small"
                        placeholder="Search by key, value"
                        variant="outlined"
                        sx={{ borderRadius: 0.5, height: "48px", width: "33%", minWidth: 200 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Right Controls */}
                    <FormControl>
                        <InputLabel id="sort-metadata">Sort</InputLabel>
                        <Select size="small" defaultValue="Alphabetical (A-Z)" label="Sort" labelId="sort-metadata">
                            <MenuItem value="Latest First">Latest First</MenuItem>
                            <MenuItem value="Oldest First">Oldest First</MenuItem>
                            <MenuItem value="Alphabetical (A-Z)">Alphabetical (A-Z)</MenuItem>
                            <MenuItem value="Alphabetical (Z-A)">Alphabetical (Z-A)</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Box>

            <AccessTypeCard
                keyLabel="Access Type Configuration"
                values={['View', 'Edit', 'Delete', 'Share', 'Others']}
                onEdit={() => console.log('Edit clicked')}
                onDelete={() => console.log('Delete clicked')}
            />

            <AccessTypeCard
                keyLabel="Access Type Configuration"
                values={['View', 'Edit', 'Delete', 'Share', 'Others']}
                onEdit={() => console.log('Edit clicked')}
                onDelete={() => console.log('Delete clicked')}
            />
            <AccessTypeCard
                keyLabel="Access Type Configuration"
                values={['View', 'Edit', 'Delete', 'Share', 'Others']}
                onEdit={() => console.log('Edit clicked')}
                onDelete={() => console.log('Delete clicked')}
            />
            <AccessTypeCard
                keyLabel="Access Type Configuration"
                values={['View', 'Edit', 'Delete', 'Share', 'Others']}
                onEdit={() => console.log('Edit clicked')}
                onDelete={() => console.log('Delete clicked')}
            />
            <AccessTypeCard
                keyLabel="Access Type Configuration"
                values={['View', 'Edit', 'Delete', 'Share', 'Others']}
                onEdit={() => console.log('Edit clicked')}
                onDelete={() => console.log('Delete clicked')}
            />
            <AccessTypeCard
                keyLabel="Access Type Configuration"
                values={['View', 'Edit', 'Delete', 'Share', 'Others']}
                onEdit={() => console.log('Edit clicked')}
                onDelete={() => console.log('Delete clicked')}
            />
            </Box>
        </>

    )
}

export default Index