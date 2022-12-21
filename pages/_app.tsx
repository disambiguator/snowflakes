import "../styles/global.scss";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import useIsMobile from "isMobile";

export default function App({ Component, pageProps }: AppProps) {
  // To prevent SSR hydration issues
  const [mobile, setIsMobile] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    setIsMobile(isMobile);
  }, [isMobile]);

  return (
    <React.StrictMode>
      <Component {...pageProps} />
      <footer className="marquee">
        {mobile ? (
          <>
            <p>Happy holidays ❄️</p>
            <p>Love from Daniella and Paras</p>
          </>
        ) : (
          "❄️ Happy holidays ❄️ Love from Daniella and Paras ️️❄️ Happy holidays ❄️ Love from Daniella and Paras ❄️ Happy holidays ❄️ Love from Daniella and Paras ❄️ Happy holidays ❄️ Love from Daniella and Paras ❄️ Happy holidays ❄️ Love from Daniella and Paras ❄️ Happy holidays ❄️ Love from Daniella and Paras ❄️ Happy holidays ❄️ Love from Daniella and Paras ❄️"
        )}
      </footer>
    </React.StrictMode>
  );
}
