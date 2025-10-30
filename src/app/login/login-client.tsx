"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
} from "lucide-react";

import MobileContainer from "../../components/mobile-container";
import { createClient } from "../../utils/supabase/client";

type LoginMethod = "email" | "mobile";

const identityCopy: Record<string, string> = {
  seeker: "Care Seeker",
  provider: "Care Provider",
};

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identityParam = searchParams.get("identity") ?? "";
  const [method, setMethod] = useState<LoginMethod>("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const identityLabel = useMemo(
    () => identityCopy[identityParam] ?? null,
    [identityParam]
  );

  const identityValue =
    identityParam === "provider" ? "provider" : "seeker";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (method !== "email") {
      setError("Only email login is supported at this time.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: identifier,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push(
        identityValue === "provider"
          ? "/care-provider/home"
          : "/care-seeker/home"
      );
    }
    setLoading(false);
  };

  const IdentifierIcon = method === "email" ? Mail : Phone;
  const canSubmit = identifier.trim() && password.trim();

  return (
    <MobileContainer>
      <div className="relative min-h-screen bg-[#0d0d0d] px-6 pb-10 pt-8 text-white">
        <motion.button
          type="button"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0C4031]"
          onClick={() => router.push("/")}
        >
          <ArrowLeft size={20} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 flex flex-col items-center gap-3 text-center"
        >
          <div className="flex size-[90px] items-center justify-center rounded-3xl">
              <Image
                src="/logo.svg"
                alt="MindHaven neon icon"
                width={90}
                height={90}
                className="size-[90px] object-contain"
              />
            </div>
          <p
            className="text-[22px] font-black text-[#52c340]"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            Welcome Back!
          </p>
          {identityLabel && (
            <p className="text-sm text-white/70">
              Signing in as <span className="text-white">{identityLabel}</span>
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex justify-center"
        >
          <div className="grid w-full max-w-sm grid-cols-2 gap-3">
            {[
              { id: "email", label: "Email Address", icon: Mail },
              { id: "mobile", label: "Mobile Number", icon: Phone },
            ].map(({ id, label, icon: Icon }) => {
              const active = method === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMethod(id as LoginMethod)}
                  className={[
                    "flex items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-sm font-semibold whitespace-nowrap",
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
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-4"
        >
          <label className="flex h-14 items-center gap-3 rounded-2xl border border-white/40 px-4 text-sm focus-within:border-white">
            <IdentifierIcon size={18} />
            <input
              type={method === "email" ? "email" : "tel"}
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder={method === "email" ? "Email Address" : "Mobile Number"}
              className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
              required
            />
          </label>

          <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/40 px-4 text-sm focus-within:border-white">
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className={[
              "mt-2 h-12 rounded-2xl text-base font-semibold transition",
              canSubmit && !loading
                ? "bg-white text-black"
                : "bg-white/30 text-black/50",
            ].join(" ")}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </motion.form>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}

        <div className="mx-auto mt-4 flex w-full max-w-sm items-center justify-end">
          <button
            type="button"
            className="text-xs font-semibold text-white"
            onClick={() => console.log("Forgot password")}
          >
            Forgot Password?
          </button>
        </div>

        <p className="mt-16 text-center text-sm text-white/70">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="font-semibold text-[#52c340]"
            onClick={() => router.push(`/register?identity=${identityValue}`)}
          >
            Sign up
          </button>
        </p>
      </div>
    </MobileContainer>
  );
}
