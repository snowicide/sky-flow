import { useMediaQuery } from "react-responsive";

export function useDeviceType(): UseDeviceTypeReturn {
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ maxWidth: 768 });
  const isDesk = useMediaQuery({ minWidth: 1025 });
  const isSmallDesk = useMediaQuery({ minWidth: 1025, maxWidth: 1150 });

  return {
    isMobile,
    isTablet,
    isDesk,
    isSmallDesk,
  };
}

interface UseDeviceTypeReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesk: boolean;
  isSmallDesk: boolean;
}
