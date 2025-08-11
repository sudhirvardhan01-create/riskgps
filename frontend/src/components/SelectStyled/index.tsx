import {
  FormControl,
  InputLabel,
  Select,
  SelectProps,
  styled,
} from "@mui/material";
import { ReactNode } from "react";

type SelectStyledProps = Omit<SelectProps, "label"> & {
  label: string;
  required?: boolean;
  children?: ReactNode;
};

const SelectStyled = ({
  label,
  required = false,
  children,
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
        required={required}
      >
        {label}
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