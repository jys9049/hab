import React from "react";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";

const GoogleProvider = () => {
  const gtmId = process.env.NEXT_PUBLIC_GOOGLE_GTM_ID;
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_GA_ID;

  if (!gtmId || !gaId) return <></>;

  return (
    <>
      <GoogleAnalytics gaId={gaId} />
      <GoogleTagManager gtmId={gtmId} />
    </>
  );
};

export default GoogleProvider;
