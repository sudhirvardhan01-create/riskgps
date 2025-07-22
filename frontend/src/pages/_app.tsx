import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { usePathname } from "next/navigation";
import theme from "@/styles/theme";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

export default function App({ Component, pageProps }: AppProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login" || pathname === "/library/risk-scenario";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isLoginPage && <Header />}
      <Component {...pageProps} />
      {!isLoginPage && <Footer />}
    </ThemeProvider>
  );
}
