import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

const useIsMobile = () => {
  // To prevent SSR hydration issues
  const [mobile, setIsMobile] = useState(false);

  const isMobile = useMediaQuery({ query: "(max-width:768px)" });
  useEffect(() => {
    setIsMobile(isMobile);
  }, [isMobile]);

  return mobile;
};
export default useIsMobile;
