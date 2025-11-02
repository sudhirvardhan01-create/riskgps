import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import type { AppProps } from "next/app";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import theme from "@/styles/theme";
import { CssBaseline, Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import SideBar from "@/components/SideBar";
import { AuthProvider } from "@/context/AuthContext";
import { AssessmentProvider } from "@/context/AssessmentContext";
import { ConfigProvider } from "@/context/ConfigContext";
import LandingPage from ".";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";
  const isLandingPage = router.pathname === "/";
  const isAssessmentProcess =
    router.pathname === "/assessment/assessmentProcess";

  return (
    <AuthProvider>
      <ConfigProvider>
        <AssessmentProvider>
          {isLandingPage ? (
            <>
              <CssBaseline />
              <LandingPage />
            </>
          ) : (
            <ThemeProvider theme={theme}>
              <CssBaseline />

              <Grid container sx={{ height: "100vh" }}>
                {/* <Grid size={1}>{!isLoginPage && <SideBar />}</Grid>
                <Grid size={11}>
                  {!isLoginPage && <Header />}
                  <Component {...pageProps} />
                  {!isLoginPage && !isAssessmentProcess && <Footer />}
                </Grid> */}
                <Grid size={12}>{!isLoginPage && <Header />}</Grid>
                <Grid size={1}>{!isLoginPage && <SideBar />}</Grid>
                <Grid size={11}>
                  <Component {...pageProps} />
                  {!isLoginPage && !isAssessmentProcess && <Footer />}
                </Grid>
              </Grid>
            </ThemeProvider>
          )}
        </AssessmentProvider>
      </ConfigProvider>
    </AuthProvider>
  );
}
