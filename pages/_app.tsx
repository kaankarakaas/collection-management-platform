import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";

const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <SessionProvider session={(pageProps as any).session}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    </>
  );
}
