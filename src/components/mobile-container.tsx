"use client";

import { ReactNode } from 'react';

interface MobileContainerProps {
  children: ReactNode;
}

export default function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-[#0C0C0C]">
      {/* Mobile viewport */}
      <div className="relative w-full max-w-[430px] overflow-hidden bg-black md:hidden">
        {children}
      </div>

      {/* Desktop message - only shows on larger screens */}
      <div className="fixed inset-0 z-50 hidden items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),rgba(0,0,0,0.92))] px-8 text-white md:flex">
        <div className="max-w-md text-center">
          <h2 className="mb-3 text-3xl font-bold text-white">Mobile Experience Only</h2>
          <p className="text-lg text-gray-300">
            MindHaven looks best on mobile. Please try again from your phone or shrink your browser to a width of 430px or less.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#52C340]" />
            <span>Designed for 390-430px viewports</span>
          </div>
        </div>
      </div>
    </div>
  );
}
