import { useMediaQuery } from "react-responsive";

const useIsMobile = () => useMediaQuery({ query: "(max-width:768px)" });
export default useIsMobile;
