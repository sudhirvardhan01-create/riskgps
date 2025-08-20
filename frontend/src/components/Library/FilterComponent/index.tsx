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
import { filter } from 'd3';


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
    items: string[];
    open: boolean;
    onClose: () => void;
    onClear: () => void;
    onApply: () => void;
    filters: Filter[];
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ items, open, onClose, onClear, onApply, filters, setFilters }) => {

React.useEffect(() => {
  console.log("Filters changed:", filters);
}, [filters]);
    const FormControlLabelStyled = styled(FormControlLabel)({
        '& .MuiFormControlLabel-label': {
            fontWeight: 400,  // or "bold"
            fontSize: '14px',
        },
    });

const handleStatusChange = (item: string, checked: boolean) => {
    alert(checked)
  setFilters((prev: Filter[]) => {
    const mappedValue = STATUS_VALUE_MAP[item]; 
    const existing = prev.find((f) => f.status);

    if (checked) {
      if (existing) {
        return prev.map((f) =>
          f.status
            ? { ...f, status: [...new Set([...f.status, mappedValue])] }
            : f
        );
      } else {
        // No status filter yet, add new one
        return [...prev, { status: [mappedValue] }];
      }
    } else {
      if (existing) {
        // Remove value
        const updated = existing.status.filter((s) => s !== mappedValue);

        if (updated.length > 0) {
          return prev.map((f) =>
            f.status ? { ...f, status: updated } : f
          );
        } else {
          // If nothing left, remove the whole status filter
          return prev.filter((f) => !f.status);
        }
      }
      return prev;
    }
  });
};


    // const [selectedKey, setSelectedKey] = useState<keyof typeof TAG_VALUES | ''>('');
    // const [selectedValue, setSelectedValue] = useState('');
    // const [tags, setTags] = useState<{ key: string; value: string }[]>([]);

    // const handleAddTag = () => {
    //     if (selectedKey && selectedValue) {
    //         setTags([...tags, { key: selectedKey, value: selectedValue }]);
    //         setSelectedKey('');
    //         setSelectedValue('');
    //     }
    // };

    // const handleValueChange = (event: SelectChangeEvent<string>) => {
    //     const value = event.target.value;

    //     if (selectedKey && value) {
    //         const tag = { key: selectedKey, value };

    //         const alreadyExists = tags.some(
    //             (t) => t.key === tag.key && t.value === tag.value
    //         );

    //         if (!alreadyExists) {
    //             setTags((prev) => [...prev, tag]);
    //         }

    //         setSelectedKey('');
    //         setSelectedValue('');
    //     }
    // };

    // const handleRemoveTag = (index: number) => {
    //     setTags(tags.filter((_, i) => i !== index));
    // };

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
                                    console.log(mappedValue);
                                    console.log(filter.length);
                                    filters.map((fil)=>{
                                        console.log(fil, typeof fil)
                                    })
                                    const isChecked = filters.some(
                                    (f) => f.status && f.status.includes("draft")
                                    );
                                    console.log(isChecked)
                                return (<FormControlLabelStyled key={index} control={<Checkbox checked={isChecked} onChange={(e) => handleStatusChange(item, e.target.checked)} size="small" />} label={item} />)})}
                        </FormGroup>
                    </Stack>

                    {/* <Stack bgcolor='#F3F8FF' mx={2} borderRadius={2} p={2} direction="column" spacing={1}>
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
                                        setSelectedKey(e.target.value);
                                        setSelectedValue('');
                                    }}
                                    label="Key"
                                    sx={{ borderRadius: 2, border: '1px solid #CECFD2' }}
                                >
                                    {TAG_KEYS.map((key) => (
                                        <MenuItem key={key} value={key}>
                                            {key}
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
                                    {selectedKey && TAG_VALUES[selectedKey]?.map((value) => (
                                        <MenuItem key={value} value={value}>
                                            {value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box display="flex" flexWrap="wrap" gap={1} mt={3}>
                            {tags.map((tag, index) => (
                                <Chip
                                    key={`${tag.key}-${tag.value}-${index}`}
                                    label={`${tag.key}: ${tag.value}`}
                                    variant="outlined"
                                    onDelete={() => handleRemoveTag(index)}
                                    deleteIcon={<Close sx={{ color: '#04139A !important' }} />}
                                    sx={{
                                        borderRadius: '2px',
                                        border: '0.5px solid #04139A',
                                        color: '#91939A',
                                    }}
                                />
                            ))}
                        </Box>
                    </Stack> */}
                    <Box sx={{ position: 'absolute', bottom: 0, borderTop: '1px solid #E8E8E8', height: '72px', width: 480 }}>
                        <Stack direction="row" spacing={2} mx={3} my={2} justifyContent="center" alignItems="center">
                            <Button
                                onClick={onClear}
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
                                onClick={onApply}
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
