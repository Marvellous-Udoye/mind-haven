import { Suspense } from "react";
import RegistrationDetailsClient from "./details-client";

export default function RegistrationDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0d0d]" />}>
      <RegistrationDetailsClient />
    </Suspense>
  );
}
