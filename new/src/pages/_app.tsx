import React, { FC } from "react";
import { AppProps } from "next/app";
import "../styles/global.css";
import { ThemeProvider, theme } from "../utils/theme";

const App: FC<AppProps> = ({ Component, pageProps }) => (
  <ThemeProvider value={theme}>
    <Component {...pageProps} />
  </ThemeProvider>
);

export default App;
