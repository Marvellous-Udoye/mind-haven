"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Delete } from "lucide-react";

import MobileContainer from "../../../components/mobile-container";

const keypadValues = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

export default function OtpVerificationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get("method") ?? "email";
  const identity =
    searchParams.get("identity") === "provider" ? "provider" : "seeker";
  const destination = searchParams.get("value");

  const [digits, setDigits] = useState(["", "", "", ""]);

  const handleDigit = (value: string) => {
    const idx = digits.findIndex((digit) => digit === "");
    if (idx === -1) return;
    const next = [...digits];
    next[idx] = value;
    setDigits(next);
  };

  const handleDelete = () => {
    const idx = [...digits].reverse().findIndex((digit) => digit !== "");
    if (idx === -1) return;
    const actualIndex = 3 - idx;
    const next = [...digits];
    next[actualIndex] = "";
    setDigits(next);
  };

  const handleVerify = () => {
    if (digits.some((digit) => digit === "")) return;
    router.push(`/register/details?identity=${identity}`);
  };

  const hasAllDigits = digits.every((digit) => digit !== "");

  return (
    <MobileContainer>
      <section className="flex min-h-screen flex-col bg-[#0d0d0d] px-6 pb-10 pt-8 text-white">
        <motion.button
          type="button"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => router.push(`/register?identity=${identity}`)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0C4031]"
        >
          <ArrowLeft size={20} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-10 space-y-2"
        >
          <h1
            className="text-[24px] font-black text-[#52c340]"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            Verification
          </h1>
          <p className="text-sm text-white/75">Please enter your 4 digit OTP code below.</p>
          {destination && (
            <p className="text-xs text-white/50">
              Sent to {method === "email" ? "email" : "mobile"}: <span className="text-white/80">{destination}</span>
            </p>
          )}
        </motion.div>

        <div className="mt-10 flex justify-center gap-3">
          {digits.map((digit, index) => (
            <div
              key={index}
              className={[
                "flex h-14 w-14 items-center justify-center rounded-xl border text-xl font-semibold",
                digit ? "border-[#52c340] bg-white text-black" : "border-white/40",
              ].join(" ")}>
              {digit || "\u00A0"}
            </div>
          ))}
        </div>

        <div className="mt-4 text-center text-sm text-white/70">
          Didn&apos;t get a code?{' '}
          <button type="button" className="text-[#52c340]" onClick={() => console.log("resend")}>Send Again</button>
        </div>

        <button
          type="button"
          onClick={handleVerify}
          disabled={!hasAllDigits}
          className={[
            "mx-auto mt-6 w-full max-w-sm rounded-2xl py-3 text-base font-semibold",
            hasAllDigits ? "bg-white text-black" : "bg-white/30 text-black/50",
          ].join(" ")}
        >
          Verify
        </button>

        <div className="mt-8 flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            {keypadValues.slice(0, 9).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleDigit(value)}
                className="rounded-xl border border-white/30 py-4 text-lg font-semibold"
              >
                {value}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <span />
            <button
              type="button"
              onClick={() => handleDigit("0")}
              className="rounded-xl border border-white/30 py-4 text-lg font-semibold"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center justify-center rounded-xl border border-white/30"
            >
              <Delete size={18} />
            </button>
          </div>
        </div>
      </section>
    </MobileContainer>
  );
}
