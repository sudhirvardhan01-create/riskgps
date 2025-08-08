import { styled, TextField, TextFieldProps, InputLabelProps } from "@mui/material";

const TextFieldStyled = styled((props: TextFieldProps) => {
  const { label, required, slotProps, ...rest } = props;

  return (
    <TextField
      {...rest}
      fullWidth
      variant="outlined"
      label={label}
      required={required}
      slotProps={{
        ...slotProps,
        inputLabel: {
          ...(typeof slotProps?.inputLabel === "object" ? slotProps.inputLabel : {}),
          shrink: true,
          sx: {
            ...(typeof slotProps?.inputLabel === "object" &&
            "sx" in slotProps.inputLabel &&
            typeof slotProps.inputLabel.sx === "object"
              ? slotProps.inputLabel.sx
              : {}),
            "& .MuiFormLabel-asterisk": {
              color: "#FB2020", // Red asterisk
            },
          } as InputLabelProps["sx"],
        },
      }}
    />
  );
})<TextFieldProps>(({ multiline }) => ({
  "& .MuiOutlinedInput-root": {
    height: multiline ? "auto" : "52px", // Conditional height
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    "& fieldset": {
      borderColor: "#cecfd2",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: "#cecfd2",
      borderWidth: "1.5px",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#cecfd2",
      borderWidth: "1.5px",
    },
    "& input": {
      padding: "14px 16px",
      fontSize: "16px",
      color: "#484848",
      "&::placeholder": {
        color: "#9E9FA5",
        opacity: 1,
      },
    },
    "& textarea": {
      fontSize: "16px",
      color: "#484848",
      "&::placeholder": {
        color: "#9E9FA5",
        opacity: 1,
      },
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "14px",
    fontWeight: 500,
    color: "#121212",
    "&.Mui-focused": {
      color: "#121212",
    },
    "&.MuiInputLabel-shrink": {
      transform: "translate(14px, -9px) scale(0.75)",
    },
  },
}));

export default TextFieldStyled;
