import { motion } from 'framer-motion';
import Image from 'next/image';

export default function SplashScreen() {
  return (
    <div className="relative flex h-full min-h-screen w-full items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/splash-screen.png"
          alt="MindHaven splash artwork"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 430px) 100vw, 430px"
        />
      </div>

      {/* Animated text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        className="absolute bottom-16 left-1/2 z-10 -translate-x-1/2 text-center"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1] }}
          transition={{ duration: 2.4, times: [0, 0.4, 1] }}
          style={{
            color: '#52C340',
            fontSize: '40px',
            fontWeight: 800,
            letterSpacing: 0.5,
            textShadow: '0 0 28px rgba(82, 195, 64, 0.25)',
          }}
        >
          MindHaven
        </motion.h1>
      </motion.div>
    </div>
  );
}
