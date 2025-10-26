import React, { Suspense } from "react";
import MobileContainer from "../../../components/mobile-container";
import OtpVerificationClient from "./otp-client";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-screen">Loading…</div>}>
      <MobileContainer>
        <OtpVerificationClient />
      </MobileContainer>
    </Suspense>
  );
}

