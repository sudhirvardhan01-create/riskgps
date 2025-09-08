// import React from "react";
// import { Close } from "@mui/icons-material";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   Grid,
//   IconButton,
//   Typography,
// } from "@mui/material";
// import TextFieldStyled from "@/components/TextFieldStyled";
// import { labels } from "@/utils/labels";
// import { tooltips } from "@/utils/tooltips";
// import { NISTControls } from "@/types/control";

// interface NISTControlFormModalProps {
//   operation: "create" | "edit";
//   open: boolean;
//   onClose: () => void;
//   formData: NISTControls;
//   setFormData: React.Dispatch<React.SetStateAction<NISTControls>>;
//   onSubmit: () => void;
// }

// const NISTControlFormModal: React.FC<NISTControlFormModalProps> = ({
//   operation,
//   open,
//   onClose,
//   formData,
//   setFormData,
//   onSubmit,
// }) => {
//   //Function to handle the Field change
//   const handleFieldChange = (field: keyof typeof formData, value: any) => {
//     setFormData((prev) => {
//       return {
//         ...prev,
//         [field]: value,
//       };
//     });
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullWidth
//       maxWidth="sm"
//       slotProps={{
//         paper: {
//           sx: {
//             borderRadius: 2,
//             paddingTop: "16px",
//             paddingLeft: "12px",
//             paddingRight: "10px",
//           },
//         },
//       }}
//     >
//       <DialogTitle
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Typography variant="h5" fontWeight={550} color="#121212">
//           {operation === "create" ? "Add NIST Control" : `Edit NIST Control`}
//         </Typography>
//         <IconButton onClick={onClose} sx={{ padding: "0px !important" }}>
//           <Close sx={{ color: "primary.main" }} />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ marginTop: 2 }}>
//         <Grid container spacing={4}>
//           {/* NIST 2.0 Control Category ID */}
//           <Grid mt={1} size={{ xs: 6 }}>
//             <TextFieldStyled
//               label={labels.nistControlCategoryId}
//               isTooltipRequired={true}
//               tooltipTitle={tooltips.nistControlCategoryId}
//               placeholder="Enter NIST 2.0 Control Category ID"
//               value={formData.frameWorkControlCategoryId}
//               onChange={(e) =>
//                 handleFieldChange("frameWorkControlCategoryId", e.target.value)
//               }
//             />
//           </Grid>

//           {/* NIST 2.0 Control Category */}
//           <Grid mt={1} size={{ xs: 6 }}>
//             <TextFieldStyled
//               label={labels.nistControlCategory}
//               isTooltipRequired={true}
//               tooltipTitle={tooltips.nistControlCategory}
//               placeholder="Enter NIST 2.0 Control Category"
//               value={formData.frameWorkControlCategory}
//               onChange={(e) => handleFieldChange("frameWorkControlCategory", e.target.value)}
//             />
//           </Grid>

//           {/* NIST 2.0 Control Sub-category ID */}
//           <Grid mt={1} size={{ xs: 6 }}>
//             <TextFieldStyled
//               label={labels.nistControlSubcategoryId}
//               isTooltipRequired={true}
//               tooltipTitle={tooltips.nistControlSubcategoryId}
//               placeholder="Enter NIST 2.0 Control Sub-category ID"
//               value={formData.frameWorkControlSubCategoryId}
//               onChange={(e) => handleFieldChange("frameWorkControlSubCategoryId", e.target.value)}
//             />
//           </Grid>

//           {/* NIST 2.0 Control Sub-category */}
//           <Grid mt={1} size={{ xs: 6 }}>
//             <TextFieldStyled
//               label={labels.nistControlSubcategory}
//               isTooltipRequired={true}
//               tooltipTitle={tooltips.nistControlSubcategory}
//               placeholder="Enter NIST 2.0 Control Sub-category"
//               value={formData.frameWorkControlSubCategory}
//               onChange={(e) => handleFieldChange("frameWorkControlSubCategory", e.target.value)}
//             />
//             </Grid>
//         </Grid>
//       </DialogContent>
//       <Box sx={{ display: "flex", justifyContent: "center", my: 2.5, mx: 3 }}>
//         <Divider sx={{ width: "100%" }} />
//       </Box>
//       <DialogActions
//         sx={{
//           px: 3,
//           pt: 1.5,
//           pb: 4,
//           display: "flex",
//           justifyContent: "flex-end",
//         }}
//       >
//         <Box display={"flex"} gap={3}>
//           <Button
//             onClick={onClose}
//             sx={{
//               width: 113,
//               height: 40,
//               borderRadius: 1,
//               border: "1px solid #04139A",
//             }}
//             variant="outlined"
//           >
//             <Typography variant="body1" color="primary.main">
//               Cancel
//             </Typography>
//           </Button>
//           <Button
//             sx={{
//               width: 110,
//               height: 40,
//               borderRadius: 1,
//             }}
//             variant="contained"
//             onClick={onSubmit}
//             disabled={
//               formData.frameWorkControlCategoryId === "" ||
//               formData.frameWorkControlCategory === "" ||
//               formData.frameWorkControlSubCategoryId === "" || 
//               formData.frameWorkControlSubCategory === ""
//             }
//             disableRipple
//           >
//             <Typography variant="body1" color="#F4F4F4" fontWeight={600}>
//               {operation === "create" ? "Add" : "Save"}
//             </Typography>
//           </Button>
//         </Box>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default NISTControlFormModal;
