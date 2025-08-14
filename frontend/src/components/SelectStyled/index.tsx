import {
  Box,
  FormControl,
  InputLabel,
  Select,
  SelectProps,
  styled,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import TooltipComponent from "../TooltipComponent";

type SelectStyledProps = Omit<SelectProps, "label"> & {
  label: string;
  required?: boolean;
  children?: ReactNode;
  tooltipTitle?: string;
  isTooltipRequired?: boolean;
};

const SelectStyled = ({
  label,
  required = false,
  children,
  tooltipTitle,
  isTooltipRequired = false,
  displayEmpty = true,
  renderValue,
  ...selectProps
}: SelectStyledProps) => {
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel
        id={`${selectProps.name}-label`}
        sx={{
          fontSize: "14px",
          fontWeight: 500,
          color: "#121212",
          backgroundColor: "#fff",
          px: "4px",
          "&.Mui-focused": {
            color: "#121212",
          },
          "& .MuiFormLabel-asterisk": {
            color: "#FB2020",
          },
        }}
        shrink
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography variant="body1" color="#121212" fontWeight={500}>
            {label}
          </Typography>
          {required && <Typography color="#FB2020">*</Typography>}
          {isTooltipRequired && <TooltipComponent title={tooltipTitle} />}
        </Box>
      </InputLabel>

      <StyledSelect
        {...selectProps}
        displayEmpty={displayEmpty}
        renderValue={renderValue}
        labelId={`${selectProps.name}-label`}
      >
        {children}
      </StyledSelect>
    </FormControl>
  );
};

const StyledSelect = styled(Select)(() => ({
  borderRadius: 8,
  backgroundColor: "#ffffff",
  fontSize: "14px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#cecfd2",
    borderWidth: "1px",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#cecfd2",
    borderWidth: "1.5px",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#cecfd2",
    borderWidth: "1.5px",
  },
  "& .MuiSelect-select": {
    padding: "14px 16px",
    fontSize: "14px",
  },
}));

export default SelectStyled;
