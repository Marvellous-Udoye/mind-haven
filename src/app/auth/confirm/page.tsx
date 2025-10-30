"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import MobileContainer from "../../../components/mobile-container";
import { createClient } from "../../../utils/supabase/client";

export default function EmailConfirmationPage() {
  return (
    <MobileContainer>
      <Suspense fallback={<ConfirmFallback />}> 
        <EmailConfirmationContent />
      </Suspense>
    </MobileContainer>
  );
}

function EmailConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const token = searchParams.get("token");
      const type = searchParams.get("type");

      if (!token || type !== "email") {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      const supabase = createClient();

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "email",
        });

        if (error) {
          setStatus("error");
          setMessage(error.message);
        } else {
          setStatus("success");
          setMessage("Email verified successfully! Redirecting...");

          // Redirect to the appropriate dashboard after successful verification
          const {
            data: { user },
          } = await supabase.auth.getUser();
          const role = user?.user_metadata?.role;

          setTimeout(() => {
            if (role === "care_provider") {
              router.push("/care-provider/home");
            } else if (role === "care_seeker") {
              router.push("/care-seeker/home");
            } else {
              router.push("/");
            }
          }, 2000);
        }
      } catch {
        setStatus("error");
        setMessage("An unexpected error occurred");
      }
    };

    handleEmailConfirmation();
  }, [searchParams, router]);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-[#0d0d0d] px-6 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center"
      >
        {status === "loading" && (
          <>
            <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-[#52c340] border-t-transparent"></div>
            <h1 className="mb-2 text-xl font-bold text-[#52c340]">
              Verifying Email
            </h1>
            <p className="text-sm text-white/70">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="mb-6 h-16 w-16 text-[#52c340]" />
            <h1 className="mb-2 text-xl font-bold text-[#52c340]">
              Email Verified!
            </h1>
            <p className="text-sm text-white/70">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mb-6 h-16 w-16 text-red-500" />
            <h1 className="mb-2 text-xl font-bold text-red-500">
              Verification Failed
            </h1>
            <p className="mb-4 text-sm text-white/70">{message}</p>
            <button
              onClick={() => router.push("/")}
              className="rounded-2xl bg-[#52c340] px-6 py-2 text-sm font-semibold text-black"
            >
              Go Back
            </button>
          </>
        )}
      </motion.div>
    </section>
  );
}

function ConfirmFallback() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-[#0d0d0d] px-6 text-white">
      <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-[#52c340] border-t-transparent"></div>
      <p className="text-sm text-white/70">Preparing confirmation...</p>
    </section>
  );
}
