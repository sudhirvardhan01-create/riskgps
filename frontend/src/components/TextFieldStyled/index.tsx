import {
  styled,
  TextField,
  TextFieldProps,
  FormControl,
  InputLabel,
  Typography,
  Box,
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
      <FormControl fullWidth variant="outlined">
        <InputLabel
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
            {required && <Typography color="#FB2020" variant="body1" fontWeight={600}>*</Typography>}
            {isTooltipRequired && <TooltipComponent title={tooltipTitle} />}
          </Box>
        </InputLabel>
        <TextField {...rest}/>
      </FormControl>
    );
  }
)<TextFieldProps>(({ multiline }) => ({
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

// import {
//   styled,
//   TextField,
//   TextFieldProps,
//   Box,
//   Typography,
// } from "@mui/material";
// import TooltipComponent from "../TooltipComponent";

// type TextFieldStyledProps = Omit<TextFieldProps, "label"> & {
//   label: string;
//   required?: boolean;
//   tooltipTitle?: string;
//   isTooltipRequired?: boolean;
// };

// const TextFieldStyled = styled(
//   ({
//     label,
//     required = false,
//     tooltipTitle,
//     isTooltipRequired = false,
//     ...rest
//   }: TextFieldStyledProps) => {
//     return (
//       <TextField
//         {...rest}
//         fullWidth
//         variant="outlined"
//         label={
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "flex-start",
//               flexWrap: "wrap",
//               width: "100%",
//               pointerEvents: "none", // allows input focus through
//               gap: 0.5,
//             }}
//           >
//             <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.5 }}>
//               <Typography
//                 variant="body1"
//                 fontWeight={500}
//                 color="#121212"
//                 component="span"
//               >
//                 {label}
//               </Typography>
//               {required && (
//                 <Typography color="#FB2020" component="span">
//                   *
//                 </Typography>
//               )}
//             </Box>
//             {isTooltipRequired && tooltipTitle && (
//               <Box sx={{ marginLeft: "auto" }}>
//                 <TooltipComponent
//                   title={tooltipTitle}
//                   width="16px"
//                   height="16px"
//                 />
//               </Box>
//             )}
//           </Box>
//         }
//         InputLabelProps={{
//           shrink: true,
//         }}
//       />
//     );
//   }
// )<TextFieldProps>(({ multiline }) => ({
//   "& .MuiOutlinedInput-root": {
//     height: multiline ? "auto" : 52,
//     borderRadius: 8,
//     backgroundColor: "#ffffff",
//     "& fieldset": {
//       borderColor: "#cecfd2",
//       borderWidth: 1,
//     },
//     "&:hover fieldset": {
//       borderColor: "#cecfd2",
//       borderWidth: 1.5,
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: "#cecfd2",
//       borderWidth: 1.5,
//     },
//     "& input": {
//       padding: "14px 16px",
//       fontSize: 16,
//       color: "#484848",
//       "&::placeholder": {
//         color: "#9E9FA5",
//         opacity: 1,
//       },
//     },
//     "& textarea": {
//       fontSize: 16,
//       color: "#484848",
//       "&::placeholder": {
//         color: "#9E9FA5",
//         opacity: 1,
//       },
//     },
//   },
//   "& .MuiInputLabel-root": {
//     fontSize: 14,
//     fontWeight: 500,
//     color: "#121212",
//     transformOrigin: "top left",
//   },
// }));

// export default TextFieldStyled;
