// "use client";

// import React, { useState } from "react";
// import {
//   Paper,
//   Typography,
//   IconButton,
//   Box,
//   Dialog,
//   Stack,
// } from "@mui/material";
// import ZoomInIcon from "@mui/icons-material/ZoomIn";
// import ZoomOutIcon from "@mui/icons-material/ZoomOut";
// import FullscreenIcon from "@mui/icons-material/Fullscreen";
// import CloseIcon from "@mui/icons-material/Close";

// export interface ChartContainerProps {
//   title: string;
//   width?: number | string;
//   height?: number;
// }

// const MIN_ZOOM = 0.8;
// const MAX_ZOOM = 1.6;
// const ZOOM_STEP = 0.1;

// export function withChartContainer<P>(
//   ChartComponent: React.ComponentType<P>
// ) {
//   const WrappedChart: React.FC<P & ChartContainerProps> = ({
//     title,
//     width = "100%",
//     height = 500,
//     ...chartProps
//   }) => {
//     const [zoom, setZoom] = useState(1);
//     const [isFullScreen, setIsFullScreen] = useState(false);

//     const handleZoomIn = () => {
//       setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
//     };

//     const handleZoomOut = () => {
//       setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
//     };

//     const ChartContent = (
//       <Box
//         sx={{
//           transform: `scale(${zoom})`,
//           transformOrigin: "center center",
//           transition: "transform 0.2s ease",
//           width: "100%",
//           height: "100%",
//         }}
//       >
//         <ChartComponent {...(chartProps as P)} />
//       </Box>
//     );

//     return (
//       <>
//         {/* Normal Mode */}
//         <Paper
//           elevation={0}
//           sx={{
//             width,
//             height,
//             p: 2,
//             borderRadius: 3,
//             border: "1px solid #E5E7EB",
//             display: "flex",
//             flexDirection: "column",
//             backgroundColor: "#fff",
//           }}
//         >
//           {/* Header */}
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             alignItems="center"
//             sx={{ mb: 1 }}
//           >
//             <Typography variant="body1" fontWeight={600}>
//               {title}
//             </Typography>

//             <Stack direction="row" spacing={1}>
//               <IconButton size="small" onClick={handleZoomOut}>
//                 <ZoomOutIcon fontSize="small" />
//               </IconButton>
//               <IconButton size="small" onClick={handleZoomIn}>
//                 <ZoomInIcon fontSize="small" />
//               </IconButton>
//               <IconButton
//                 size="small"
//                 onClick={() => setIsFullScreen(true)}
//               >
//                 <FullscreenIcon fontSize="small" />
//               </IconButton>
//             </Stack>
//           </Stack>

//           {/* Chart Area */}
//           <Box
//             sx={{
//               flex: 1,
//               overflow: "hidden",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             {ChartContent}
//           </Box>
//         </Paper>

//         {/* Full Screen Mode */}
//         <Dialog fullScreen open={isFullScreen}>
//           <Paper
//             elevation={0}
//             sx={{
//               width: "100%",
//               height: "100%",
//               p: 2,
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             {/* Fullscreen Header */}
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography variant="h6" fontWeight={600}>
//                 {title}
//               </Typography>

//               <Stack direction="row" spacing={1}>
//                 <IconButton onClick={handleZoomOut}>
//                   <ZoomOutIcon />
//                 </IconButton>
//                 <IconButton onClick={handleZoomIn}>
//                   <ZoomInIcon />
//                 </IconButton>
//                 <IconButton onClick={() => setIsFullScreen(false)}>
//                   <CloseIcon />
//                 </IconButton>
//               </Stack>
//             </Stack>

//             {/* Fullscreen Chart */}
//             <Box
//               sx={{
//                 flex: 1,
//                 overflow: "hidden",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               {ChartContent}
//             </Box>
//           </Paper>
//         </Dialog>
//       </>
//     );
//   };

//   return WrappedChart;
// }
