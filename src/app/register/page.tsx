import { Suspense } from "react";
import RegistrationMethodClient from "./register-client";

export default function RegistrationMethodPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0d0d]" />}>
      <RegistrationMethodClient />
    </Suspense>
  );
}
