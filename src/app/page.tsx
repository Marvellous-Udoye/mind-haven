"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from '../components/splash-screen';
import IdentitySelection from '../components/identity-selection';
import MobileContainer from '../components/mobile-container';

type Screen = 'splash' | 'identity';
type Identity = 'seeker' | 'provider';

export default function OnboardingFlow() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const router = useRouter();

  useEffect(() => {
    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setCurrentScreen('identity');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (identity: Identity) => {
    router.push(`/login?identity=${identity}`);
  };

  const handleSignup = (identity: Identity) => {
    router.push(`/register?identity=${identity}`);
  };

  return (
    <MobileContainer>
      <AnimatePresence mode="wait">
        {currentScreen === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SplashScreen/>
          </motion.div>
        )}
        
        {currentScreen === 'identity' && (
          <motion.div
            key="identity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <IdentitySelection onLogin={handleLogin} onSignup={handleSignup} />
          </motion.div>
        )}

      </AnimatePresence>
    </MobileContainer>
  );
}
