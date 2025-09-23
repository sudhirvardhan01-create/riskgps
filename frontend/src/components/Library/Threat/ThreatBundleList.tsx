// import { Box, Stack, TablePagination } from "@mui/material";
// import ThreatBundleCard from "./ThreatBundleCard";

// interface Item {
//     mitreTechniqueId: string;
//     mitreTechniqueName: string;
// }

// interface Props {
//   loading: boolean;
//   data: Item[];
//   totalRows: number;
//   page: number;
//   rowsPerPage: number;
//   onPageChange: (e: any, page: number) => void;
//   onRowsPerPageChange: (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => void;
//   setSelectedControlFrameworkRecord: React.Dispatch<
//     React.SetStateAction<ControlFrameworkForm | null>
//   >;
//   setIsDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const ThreatBundleList: React.FC<Props> = ({
//   data,
//   totalRows,
//   page,
//   rowsPerPage,
//   onPageChange,
//   onRowsPerPageChange,
//   setSelectedControlFrameworkRecord,
//   setIsDeleteConfirmOpen,
// }) => {
//   return (
//     <>
//       <Stack
//         spacing={2}
//         sx={{ overflow: "auto", maxHeight: "calc(100vh - 390px)" }}
//       >
//         {data && data.length > 0 ? (
//           data.map((item, index) => (
//             <div key={index ?? JSON.stringify(item)}>
//               <ThreatBundleCard
//                 mitreTechniqueId={item.mitreTechniqueId}
//                 mitreTechniqueName={item.mitreTechniqueName}
//                 onDelete={}
//               />
//             </div>
//           ))
//         ) : (
//           // empty state could be enhanced
//           <div>No records found</div>
//         )}
//       </Stack>

//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           position: "absolute",
//           bottom: 55,
//           left: "50%", // place horizontally at 50%
//           transform: "translateX(-50%)",
//         }}
//       >
//         <TablePagination
//           component="div"
//           count={totalRows}
//           page={page}
//           onPageChange={onPageChange}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={onRowsPerPageChange}
//           rowsPerPageOptions={[6, 12, 18, 24, 30]}
//         />
//       </Box>
//     </>
//   );
// };

// export default ThreatBundleList;
