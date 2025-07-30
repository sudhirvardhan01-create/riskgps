import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import theme from "@/styles/theme";
import { CssBaseline, Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import SideBar from "@/components/SideBar";
import { AuthProvider } from "@/context/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Grid container sx={{ height: "100vh" }}>
          <Grid size={1}>{!isLoginPage && <SideBar />}</Grid>
          <Grid size={11}>
            {!isLoginPage && <Header />}
            <Component {...pageProps} />
            {!isLoginPage && <Footer />}
          </Grid>
        </Grid>
      </ThemeProvider>
    </AuthProvider>
  );
}
