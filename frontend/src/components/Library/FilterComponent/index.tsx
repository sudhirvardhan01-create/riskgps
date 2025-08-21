import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { Checkbox, Chip, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import styled from '@emotion/styled';
import { SelectChangeEvent } from '@mui/material/Select';
import { Filter } from '@/types/filter';



const TAG_KEYS = ['Domain', 'Category'];
const TAG_VALUES: Record<'Domain' | 'Category', string[]> = {
    Domain: ['NIST', 'GDPR', 'ISO'],
    Category: ['NIST-CSF', 'COBIT', 'ISO-27001'],
};

const STATUS_VALUE_MAP: Record<string, string> = {
  Draft: "draft",
  Published: "published",
  "Not Published": "not_published",
};

interface FilterComponentProps {
    metaDatas: any[];
    items: string[];
    open: boolean;
    onClose: () => void;
    onClear: () => void;
    onApply: () => void;
    statusFilters: string[];
    setStatusFilters: React.Dispatch<React.SetStateAction<string[]>>;
    filters: Filter[];
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>
}

const FilterComponent: React.FC<FilterComponentProps> = ({ metaDatas, items, open, onClose, onClear, onApply, statusFilters, setStatusFilters, filters, setFilters }) => {
    const [localStatusFilters, setLocalStatusFilters] = useState<string[]>([]);
    const [selectedKey, setSelectedKey] = useState<number | null>(null);
    const [selectedKeySupportedValues, setSelectedKeySupportedValues] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');

    const [tags, setTags] = useState<{ key: number; value: string }[]>([]);

    const FormControlLabelStyled = styled(FormControlLabel)({
        '& .MuiFormControlLabel-label': {
            fontWeight: 400,  // or "bold"
            fontSize: '14px',
        },
    });

    const onApplyFilters = () => {
        const groupedMap: Record<number, string[]> = {};

        for (const { key, value } of tags) {
        if (!groupedMap[key]) {
            groupedMap[key] = [];
        }
        groupedMap[key].push(value);
        }

        const grouped: Filter[] = Object.entries(groupedMap).map(([k, v]) => ({
        [Number(k)]: v,
        }));
        console.log(localStatusFilters);
        console.log(grouped);
        setStatusFilters(localStatusFilters);
        setFilters(grouped);

        onClose();
    }

    const onClearFilters = () => {
        setLocalStatusFilters([]);
        setTags([]);
        setFilters([]);
        setStatusFilters([]);
        onClose();
    }

    const handleStatusChange = (item: string, checked: boolean) => {
        setLocalStatusFilters((prev: string[]) => {
            const mappedValue = STATUS_VALUE_MAP[item];

            if (checked) {
            return prev.includes(mappedValue) ? prev : [...prev, mappedValue];
            } else {
            return prev.filter((s) => s !== mappedValue);
            }
        });
    };


    const handleAddTag = () => {
        if (selectedKey && selectedValue) {
            setTags([...tags, { key: selectedKey, value: selectedValue }]);
            setSelectedKey(null);
            setSelectedKeySupportedValues([]);
            setSelectedValue('');
        }
    };

    const handleValueChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;

        if (selectedKey && value) {
            const tag = { key: selectedKey, value };

            const alreadyExists = tags.some(
                (t) => t.key === tag.key && t.value === tag.value
            );

            if (!alreadyExists) {
                setTags((prev) => [...prev, tag]);
            }

            setSelectedKey(null);
            setSelectedKeySupportedValues([]);
            setSelectedValue('');
        }
    };

    const handleRemoveTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    return (
        <>
            <Drawer open={open} onClose={onClose} anchor='right'>
                <Box sx={{ width: 480 }} role="presentation">
                    <Stack direction="row" justifyContent="space-between" alignItems="center" m={2}>
                        <Typography variant="h2" sx={{ color: '#191919', fontWeight: 500, fontSize: '24px' }}>
                            Filters
                        </Typography>
                        <IconButton onClick={onClose} sx={{ color: 'black', padding: '0px !important' }}>
                            <Close fontSize='small' />
                        </IconButton>
                    </Stack>

                    <Stack bgcolor='#F3F8FF' mx={2} borderRadius={2} p={2} direction="column" spacing={1} mb={2}>
                        <Typography variant="h6" sx={{ color: '#191919', fontWeight: 500, fontSize: '16px' }}>
                            Status
                        </Typography>
                        <FormGroup sx={{ paddingLeft: 1 }}>
                            {items.map((item, index) => { 
                                    const mappedValue = STATUS_VALUE_MAP[item];
                                    const isChecked = localStatusFilters.includes(mappedValue);
                                return (<FormControlLabelStyled key={index} control={<Checkbox checked={isChecked} onChange={(e) => handleStatusChange(item, e.target.checked)} size="small" />} label={item} />)})}
                        </FormGroup>
                    </Stack>

                    <Stack bgcolor='#F3F8FF' mx={2} borderRadius={2} p={2} direction="column" spacing={1}>
                        <Typography variant='h6' sx={{ color: '#191919', fontWeight: 500, fontSize: '16px' }}>
                            Tags
                        </Typography>

                        <Box display="flex" gap={2} flexWrap="wrap" alignItems="flex-start">
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel id="select-key-in-filter">Key</InputLabel>
                                <Select
                                    labelId='select-key-in-filter'
                                    value={selectedKey}
                                    onChange={(e) => {
                                        setSelectedKey(e.target.value as number);
                                        setSelectedKeySupportedValues(metaDatas.find((m) => m.id === e.target.value).supported_values)
                                        setSelectedValue('');
                                    }}
                                    label="Key"
                                    sx={{ borderRadius: 2, border: '1px solid #CECFD2' }}
                                >
                                    {metaDatas?.map((key) => (
                                        <MenuItem key={key.id} value={key.id}>
                                            {key.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl sx={{ minWidth: 200 }} disabled={!selectedKey}>
                                <InputLabel id="select-value-in-filter">Value</InputLabel>
                                <Select
                                    labelId='select-value-in-filter'
                                    value={selectedValue}
                                    onChange={handleValueChange}
                                    label="Value"
                                    onClose={handleAddTag}
                                    sx={{ borderRadius: 2, border: '1px solid #CECFD2' }}
                                >
                                    {selectedKey && selectedKeySupportedValues?.map((value) => (
                                        <MenuItem key={value} value={value}>
                                            {value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box display="flex" flexWrap="wrap" gap={1} mt={3}>
                            {tags.map((tag, index) => {
                                const metaDataLabel = metaDatas.find((meta) => meta.id === tag.key).label
                                return (
                                    <Chip
                                        key={`${tag.key}-${tag.value}-${index}`}
                                        label={`${metaDataLabel}: ${tag.value}`}
                                        variant="outlined"
                                        onDelete={() => handleRemoveTag(index)}
                                        deleteIcon={<Close sx={{ color: '#04139A !important' }} />}
                                        sx={{
                                            borderRadius: '2px',
                                            border: '0.5px solid #04139A',
                                            color: '#91939A',
                                        }}
                                    />
                                    )
                            })}
                        </Box>
                    </Stack>
                    <Box sx={{ position: 'absolute', bottom: 0, borderTop: '1px solid #E8E8E8', height: '72px', width: 480 }}>
                        <Stack direction="row" spacing={2} mx={3} my={2} justifyContent="center" alignItems="center">
                            <Button
                                onClick={onClearFilters}
                                variant="text"
                                sx={{
                                    color: "primary.main",
                                    px: 3,
                                    fontWeight: 600,
                                    textTransform: "none",
                                    width: '208px',
                                    marginRight: '16px !important'
                                }}
                            >
                                Clear All
                            </Button>

                            <Button
                                onClick={onApplyFilters}
                                variant="contained"
                                sx={{
                                    backgroundColor: 'primary.main',
                                    borderRadius: 2,
                                    width: '208px',
                                    color: "white",
                                    px: 3,
                                    fontWeight: 600,
                                    textTransform: "none",
                                    ml: '0 !important',
                                    "&:hover": {
                                        backgroundColor: 'primary.main',
                                        opacity: 0.9,
                                    },
                                }}
                            >
                                Apply
                            </Button>
                        </Stack>
                    </Box>

                </Box>
            </Drawer>
        </>
    );
}

export default FilterComponent
