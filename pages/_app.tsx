import "../styles/global.scss";
import type { AppProps } from "next/app";
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <Component {...pageProps} />
      <footer className={"marquee"}>
        <div className={"marqueeText"}>
          ❄️ Happy holidays ❄️ Love from Daniella and Paras ️️❄️ Happy holidays
          ❄️ Love from Daniella and Paras ❄️ Happy holidays ❄️ Love from
          Daniella and Paras ❄️ Happy holidays ❄️ Love from Daniella and Paras
          ❄️ Happy holidays ❄️ Love from Daniella and Paras ❄️ Happy holidays ❄️
          Love from Daniella and Paras ❄️ Happy holidays ❄️ Love from Daniella
          and Paras ❄️
        </div>
      </footer>
    </React.StrictMode>
  );
}
