import React, { Suspense } from "react";
import MobileContainer from "../../components/mobile-container";
const LoginClient = React.lazy(() => import("./login-client"));

export default function LoginPage() {
  return (
    <MobileContainer>
      <Suspense fallback={<div />}> 
        {/* LoginClient is a client component that uses next/navigation hooks */}
        <LoginClient />
      </Suspense>
    </MobileContainer>
  );
}
