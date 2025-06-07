"use client";

import { useEffect, useState } from "react";

const useMobileCheck = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window) {
      const clientMobileCheck = /Mobi|Android|iPhone|iPad|iPod/i.test(
        window.navigator.userAgent
      );

      setIsMobile(clientMobileCheck);
    }
  }, []);

  return { isMobile };
};

export default useMobileCheck;
