import { createTheme } from "@mui/material/styles";
import "@fontsource/inter";

// Customize your theme here
const theme = createTheme({
  palette: {
    primary: {
      main: "#04139A", // Blue
      900: "#12229d",
      700: "#233dff",
      500: "#6f80eb",
      300: "#5cb6f9",
      100: "#cae8ff",
    },
    secondary: {
      main: "#dc004e", // Pink
    },
    background: {
      default: "#f5f5f5",
    },
    text: {
      primary: "#484848",
      secondary: "#9E9FA5",
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
