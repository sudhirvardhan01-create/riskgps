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
import { WebSocketProvider } from "@/context/WebSocketContext";
import LandingPage from ".";
import ErrorBoundary from "@/components/ErrorBoundary";
import GlobalToastProvider from "@/components/GlobalToastProvider";
import { LoaderProvider } from "@/context/LoaderContext";
import GlobalInitializer from "@/components/GlobalInitializer";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";
  const isLandingPage = router.pathname === "/";
  const isAssessmentProcess =
    router.pathname === "/assessment/assessmentProcess";
  const [collapsed, setCollapsed] = useState(false);

  return (
    <GlobalToastProvider>
      <ErrorBoundary>
        <LoaderProvider>
          <AuthProvider>
            <WebSocketProvider>
              <ConfigProvider>
                <AssessmentProvider>
                {isLandingPage ? (
                  <>
                    <CssBaseline />
                    <LandingPage />
                  </>
                ) : (
                  <>
                    <GlobalInitializer />
                    <ThemeProvider theme={theme}>
                      <CssBaseline />
                      {isLoginPage && (
                        <Grid container sx={{ height: "100vh" }}>
                          <Grid size={12}>
                            <Component {...pageProps} />
                          </Grid>
                        </Grid>
                      )}

                      {!isLoginPage && (
                        <Grid
                          container
                          sx={{ height: "100vh", overflow: "hidden" }}
                        >
                          {/* Header */}
                          <Grid size={12}>{!isLoginPage && <Header />}</Grid>
                          {/* Main Content Row */}

                          <Grid
                            sx={{
                              transition: "width 0.3s ease",
                              width: collapsed ? "80px" : "120px", // match sidebar width
                              flexShrink: 0,
                            }}
                          >
                            <SideBar
                              collapsed={collapsed}
                              setCollapsed={setCollapsed}
                            />
                          </Grid>

                          <Grid
                            sx={{
                              flexGrow: 1,
                              transition: "width 0.3s ease",
                              width: `calc(100% - ${
                                collapsed ? "80px" : "220px"
                              })`,
                              overflowY: "auto",
                            }}
                          >
                            <Component {...pageProps} />
                            {!isLoginPage && !isAssessmentProcess && <Footer />}
                          </Grid>
                        </Grid>
                      )}
                    </ThemeProvider>
                  </>
                )}
                </AssessmentProvider>
              </ConfigProvider>
            </WebSocketProvider>
          </AuthProvider>
        </LoaderProvider>
      </ErrorBoundary>
    </GlobalToastProvider>
  );
}
