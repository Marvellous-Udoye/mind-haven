"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone } from "lucide-react";

import MobileContainer from "../../components/mobile-container";

type VerificationMethod = "email" | "mobile";

export default function RegistrationMethodClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identity = searchParams.get("identity") === "provider" ? "provider" : "seeker";
  const [method, setMethod] = useState<VerificationMethod>("email");
  const [value, setValue] = useState("");

  const MethodIcon = method === "email" ? Mail : Phone;
  const isValid = value.trim().length > 0;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValid) return;
    router.push(
      `/register/otp?method=${method}&value=${encodeURIComponent(
        value.trim()
      )}&identity=${identity}`
    );
  };

  return (
    <MobileContainer>
      <section className="flex min-h-screen flex-col bg-[#0d0d0d] px-6 pb-10 pt-8 text-white">
        <motion.button
          type="button"
          onClick={() => router.push(`/login?identity=${identity}`)}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
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
            className="text-[26px] font-black text-[#52c340]"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            Registration
          </h1>
          <p className="text-sm text-white/80">
            How do you want to receive your verification code?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 grid grid-cols-2 gap-3"
        >
          {[
            { id: "email", label: "Email Address", icon: Mail },
            { id: "mobile", label: "Mobile Number", icon: Phone },
          ].map(({ id, label, icon: Icon }) => {
            const active = method === (id as VerificationMethod);
            return (
              <button
                key={id}
                type="button"
                onClick={() => setMethod(id as VerificationMethod)}
                className={[
                  "flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold whitespace-nowrap",
                  active
                    ? "border-[#52c340] bg-[#52c340] text-black"
                    : "border-white/20 text-white/85",
                ].join(" ")}
              >
                <Icon size={18} className={active ? "text-black" : "text-white"} />
                <span>{label}</span>
              </button>
            );
          })}
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col gap-6"
        >
          <label className="flex h-14 items-center gap-3 rounded-2xl border border-white/40 px-4 text-sm focus-within:border-white">
            <MethodIcon size={18} />
            <input
              type={method === "email" ? "email" : "tel"}
              placeholder={method === "email" ? "Email Address" : "Mobile Number"}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
              required
            />
          </label>

          <button
            type="submit"
            disabled={!isValid}
            className={[
              "h-12 rounded-2xl text-base font-semibold transition mt-24",
              isValid ? "bg-white text-black" : "bg-white/30 text-black/40",
            ].join(" ")}
          >
            Send OTP
          </button>
        </motion.form>
      </section>
    </MobileContainer>
  );
}