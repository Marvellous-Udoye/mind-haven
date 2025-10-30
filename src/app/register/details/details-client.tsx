"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Phone,
  User,
} from "lucide-react";
import MobileContainer from "../../../components/mobile-container";
import { createClient } from "../../../utils/supabase/client";
import type { UserIdentity } from "../../../types/user";

function InputWrapper({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-12 items-center gap-3 rounded-xl border border-[#0f4a4b] bg-[#073133] px-4 text-sm">
      <span className="text-white/80">{icon}</span>
      {children}
    </div>
  );
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  password: string;
  confirmPassword: string;
}

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  password: "",
  confirmPassword: "",
};

export default function RegistrationDetailsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identity: UserIdentity =
    searchParams.get("identity") === "provider" ? "provider" : "seeker";
  const [formData, setFormData] = useState<FormState>(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: identity === "provider" ? "care_provider" : "care_seeker",
          avatar_url: null,
          phone: formData.phone,
          dob: formData.dob,
          gender: formData.gender,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Please check your email to verify your account.");
    }
    setLoading(false);
  };

  return (
    <MobileContainer>
      <section className="flex min-h-screen flex-col bg-[#0d0d0d] px-6 pb-10 pt-8 text-white">
        <motion.button
          type="button"
          onClick={() => router.push(`/register/otp?identity=${identity}`)}
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
          className="mt-8 space-y-2"
        >
          <h1
            className="text-[24px] font-black text-[#52c340]"
            style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            Welcome to MindHaven
          </h1>
          <p className="text-sm text-white/80">
            Already have account?{" "}
            <button
              type="button"
              className="text-[#52c340]"
              onClick={() => router.push(`/login?identity=${identity}`)}
            >
              Login
            </button>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex flex-col items-center"
        >
          <div className="relative h-20 w-20 rounded-3xl border border-[#0f4a4b] bg-[#073133] p-4">
            <User className="h-full w-full text-white/70" />
            <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-[#0d0d0d] bg-[#52c340] text-black text-xs font-bold">
              +
            </span>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6 flex flex-col gap-4"
        >
          <InputWrapper icon={<User size={16} />}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
              required
            />
          </InputWrapper>

          <InputWrapper icon={<User size={16} />}>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
              required
            />
          </InputWrapper>

          <InputWrapper icon={<Mail size={16} />}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
              required
            />
          </InputWrapper>

          <InputWrapper icon={<Phone size={16} />}>
            <input
              type="tel"
              name="phone"
              placeholder="Mobile Number"
              value={formData.phone}
              onChange={handleChange}
              className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
              required
            />
          </InputWrapper>

          <InputWrapper icon={<Calendar size={16} />}>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
              required
            />
          </InputWrapper>

          <div className="relative">
            <InputWrapper icon={<User size={16} />}>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="flex-1 appearance-none bg-transparent text-white placeholder:text-white/50 focus:outline-none"
                required
              >
                <option value="" className="text-black">
                  Gender
                </option>
                <option value="female" className="text-black">
                  Female
                </option>
                <option value="male" className="text-black">
                  Male
                </option>
                <option value="other" className="text-black">
                  Other
                </option>
              </select>
            </InputWrapper>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70"
              size={18}
            />
          </div>

          <InputWrapper icon={<Lock size={16} />}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </InputWrapper>

          <InputWrapper icon={<Lock size={16} />}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </InputWrapper>

          <button
            type="submit"
            className="mt-2 h-12 rounded-2xl bg-white text-base font-semibold text-black disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </motion.form>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}
        {message && (
          <p className="mt-4 text-center text-sm text-green-500">{message}</p>
        )}

        <p className="mt-4 text-center text-xs text-white/70">
          By clicking signup you are agreeing to the{" "}
          <button type="button" className="font-semibold text-[#52c340]">
            Terms of Use
          </button>{" "}
          and the{" "}
          <button type="button" className="font-semibold text-[#52c340]">
            Privacy Policy
          </button>
        </p>
      </section>
    </MobileContainer>
  );
}
