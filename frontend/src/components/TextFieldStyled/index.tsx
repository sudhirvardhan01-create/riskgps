import {
  styled,
  TextField,
  TextFieldProps,
  Box,
  Typography,
} from "@mui/material";
import TooltipComponent from "../TooltipComponent";

type TextFieldStyledProps = Omit<TextFieldProps, "label"> & {
  label: string;
  required?: boolean;
  tooltipTitle?: string;
  isTooltipRequired?: boolean;
};

const TextFieldStyled = styled(
  ({
    label,
    required = false,
    tooltipTitle,
    isTooltipRequired = false,
    ...rest
  }: TextFieldStyledProps) => {
    return (
      <TextField
        {...rest}
        fullWidth
        variant="outlined"
        label={
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexWrap: "wrap",
              width: "100%",
              pointerEvents: "none", // allows input focus through
              gap: 0.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.5 }}>
              <Typography
                variant="body1"
                fontWeight={500}
                color="#121212"
                component="span"
              >
                {label}
              </Typography>
              {required && (
                <Typography color="#FB2020" component="span">
                  *
                </Typography>
              )}
            </Box>
            {isTooltipRequired && tooltipTitle && (
              <Box sx={{ marginLeft: "auto" }}>
                <TooltipComponent
                  title={tooltipTitle}
                  width="16px"
                  height="16px"
                />
              </Box>
            )}
          </Box>
        }
        InputLabelProps={{
          shrink: rest.value ? true : undefined, // keeps floating label smooth
        }}
      />
    );
  }
)<TextFieldProps>(({ multiline }) => ({
  "& .MuiOutlinedInput-root": {
    height: multiline ? "auto" : 52,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    "& fieldset": {
      borderColor: "#cecfd2",
      borderWidth: 1,
    },
    "&:hover fieldset": {
      borderColor: "#cecfd2",
      borderWidth: 1.5,
    },
    "&.Mui-focused fieldset": {
      borderColor: "#cecfd2",
      borderWidth: 1.5,
    },
    "& input": {
      padding: "14px 16px",
      fontSize: 16,
      color: "#484848",
      "&::placeholder": {
        color: "#9E9FA5",
        opacity: 1,
      },
    },
    "& textarea": {
      fontSize: 16,
      color: "#484848",
      "&::placeholder": {
        color: "#9E9FA5",
        opacity: 1,
      },
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: 14,
    fontWeight: 500,
    color: "#121212",
    transformOrigin: "top left",
  },
}));

export default TextFieldStyled;
