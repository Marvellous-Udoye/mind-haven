import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type Identity = 'seeker' | 'provider';

interface IdentitySelectionProps {
  onLogin: (identity: Identity) => void;
  onSignup: (identity: Identity) => void;
}

const identityOptions: Array<{
  id: Identity;
  label: string;
  image: string;
  delay: number;
}> = [
  { id: 'seeker', label: 'Care Seeker', image: '/care-seeker.png', delay: 0.15 },
  { id: 'provider', label: 'Care Provider', image: '/care-provider.png', delay: 0.25 },
];

export default function IdentitySelection({ onLogin, onSignup }: IdentitySelectionProps) {
  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(null);

  const handleSelection = (identity: Identity) => {
    setSelectedIdentity(identity);
  };

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center bg-[#050505] p-8 text-white">
      {/* Top icon + heading */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div className="flex flex-col items-center gap-5 text-center">
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
          className="font-semibold text-[#52C340] text-[24px]"
        >
            Choose your Identity
          </p>
        </div>
      </motion.div>

      {/* Identity pills */}
      <div className="mt-16 flex w-full items-center justify-center gap-10">
        {identityOptions.map((option) => {
          const isActive = selectedIdentity === option.id;
          return (
            <motion.button
              key={option.id}
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: option.delay }}
              onClick={() => handleSelection(option.id)}
              aria-pressed={isActive}
              className="relative flex flex-col items-center gap-4 text-center outline-none"
            >

                <div className="relative size-32">
                  <Image
                    src={option.image}
                    alt={option.label}
                    fill
                    sizes="(max-width: 430px) 120px, 200px"
                    className="object-contain"
                  />
                </div>
              <span className="text-lg font-semibold text-white/90">{option.label}</span>

              {/* Check badge */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#050505] bg-[#52C340] shadow-[0_4px_12px_rgba(82,195,64,0.55)]"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 8.5L6.5 11L12 5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="mt-auto w-full">
        <AnimatePresence>
          {selectedIdentity && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex w-full flex-col gap-4"
            >
              <button
                type="button"
                onClick={() => onLogin(selectedIdentity)}
                className="w-full rounded-2xl border border-white/70 px-6 py-3 text-lg font-semibold tracking-wide text-white shadow-[0_6px_24px_rgba(0,0,0,0.65)] transition duration-200 hover:bg-white/5 active:scale-[0.99]"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => onSignup(selectedIdentity)}
                className="w-full rounded-2xl bg-white px-6 py-3 text-lg font-semibold tracking-wide text-black shadow-[0_10px_24px_rgba(0,0,0,0.45)] transition duration-200 hover:bg-gray-100 active:scale-[0.99]"
              >
                Signup
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
